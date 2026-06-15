import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"
import DOMPurify from "isomorphic-dompurify"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(comments)
  } catch (error) {
    console.error("Failed to fetch comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"

    if (!rateLimit(ip, 5, 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many comments. Please wait a minute before posting again." },
        { status: 429 }
      )
    }

    const { name, content } = await req.json()

    if (!name || !name.trim() || !content || !content.trim()) {
      return NextResponse.json({ error: "Name and comment content are required." }, { status: 400 })
    }

    const cleanContent = DOMPurify.sanitize(content.trim())
    const cleanName = DOMPurify.sanitize(name.trim())

    const comment = await prisma.comment.create({
      data: {
        postId: id,
        name: cleanName,
        content: cleanContent,
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Failed to create comment:", error)
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 })
  }
}
