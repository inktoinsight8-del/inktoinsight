import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const post = await prisma.post.update({
      where: { id },
      data: {
        likes: { increment: 1 }
      }
    })
    
    return NextResponse.json({ likes: post.likes })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
