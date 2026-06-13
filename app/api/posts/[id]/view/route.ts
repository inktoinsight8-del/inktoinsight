import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const forwardedFor = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'unknown-ip')

    // If we can't reliably get an IP, we skip tracking to prevent spam
    if (ip !== 'unknown-ip') {
      try {
        await prisma.postView.create({
          data: { postId: id, ip }
        })
        
        await prisma.post.update({
          where: { id },
          data: { views: { increment: 1 } }
        })
      } catch (dbError: any) {
        if (dbError.code === 'P2002') {
          // Unique constraint violation - already viewed by this IP
          return NextResponse.json({ success: true, message: 'Already viewed' })
        }
        throw dbError
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("View tracking error:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}
