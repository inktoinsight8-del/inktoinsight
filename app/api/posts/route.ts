import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, slug, excerpt, content, coverImage, categoryId, tags, status } = body

    // 1. Ensure tags exist or create them
    const tagConnections = []
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        })
        tagConnections.push({ id: tag.id })
      }
    }

    // Check if slug is already taken
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    })
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this URL slug already exists. Please choose a different title or slug.' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status,
        author: session.user.name || 'Sanju',
        category: {
          connect: { id: categoryId }
        },
        tags: {
          connect: tagConnections
        }
      }
    })

    if (status === 'PUBLISHED') {
      revalidatePath('/')
      revalidatePath('/blog')
    }

    return NextResponse.json(post)
  } catch (error: any) {
    console.error('Failed to create post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
