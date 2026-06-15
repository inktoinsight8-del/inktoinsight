import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { sendNewsletterEmail } from "@/lib/mail"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { subject, content } = await req.json()

    if (!subject || !subject.trim() || !content || !content.trim()) {
      return NextResponse.json({ error: "Subject and email body content are required." }, { status: 400 })
    }

    const subscribers = await prisma.subscriber.findMany({
      select: { email: true }
    })

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "No subscribers to broadcast to." })
    }

    // Batch mailing in chunks of 5 with 200ms delay to respect SMTP policies and function execution limits
    const BATCH_SIZE = 5
    let successCount = 0
    let failureCount = 0

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const chunk = subscribers.slice(i, i + BATCH_SIZE)
      const results = await Promise.allSettled(
        chunk.map(sub => sendNewsletterEmail(sub.email, subject.trim(), content.trim()))
      )

      results.forEach(res => {
        if (res.status === "fulfilled") {
          successCount++
        } else {
          failureCount++
          console.error("Mailing broadcast failure:", res.reason)
        }
      })

      if (i + BATCH_SIZE < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    return NextResponse.json({
      success: true,
      total: subscribers.length,
      sent: successCount,
      failed: failureCount
    })
  } catch (error: any) {
    console.error("Newsletter broadcast system error:", error)
    return NextResponse.json({ error: error.message || "Failed to broadcast newsletter" }, { status: 500 })
  }
}
