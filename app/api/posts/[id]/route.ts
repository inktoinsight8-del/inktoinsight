import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from 'next/cache'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.post.delete({
      where: { id }
    })
    
    revalidatePath('/')
    revalidatePath('/blog')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { title, slug, excerpt, content, coverImage, categoryId, tags, status } = await req.json()

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

    // Check if slug is already taken by another post
    const existingPost = await prisma.post.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    })
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this URL slug already exists. Please choose a different title or slug.' },
        { status: 400 }
      )
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status,
        category: {
          connect: { id: categoryId }
        },
        tags: {
          set: [],
          connect: tagConnections
        }
      }
    })

    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)

    return NextResponse.json(post)
  } catch (error: any) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: error.message || "Failed to update post" }, { status: 500 })
  }
}
