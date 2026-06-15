import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: {
            title: true,
            slug: true,
          }
        }
      }
    })
    return NextResponse.json(comments)
  } catch (error) {
    console.error("Failed to fetch comments for admin:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}
