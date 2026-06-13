import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const slugs = url.searchParams.get('slugs')?.split(',').filter(Boolean)

  if (!slugs || slugs.length === 0) {
    return NextResponse.json([])
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        slug: { in: slugs },
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
      }
    })
    
    return NextResponse.json(posts)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
