import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendResetCode } from "@/lib/mail"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    // Basic IP-based rate limit
    const ip = req.headers.get("x-forwarded-for") || "unknown"
    if (!rateLimit(ip, 5, 15 * 60 * 1000)) { // 5 requests per 15 minutes
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }

    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user) {
      return NextResponse.json({ error: "Admin user not found with this email" }, { status: 404 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode: code,
        resetExpires: expires,
      },
    })

    try {
      await sendResetCode(user.email, code)
    } catch (mailError: any) {
      console.error("Nodemailer error:", mailError)
      return NextResponse.json({ 
        error: "Failed to send email. Please verify SMTP_USER and SMTP_PASS environment variables." 
      }, { status: 500 })
    }

    return NextResponse.json({ message: "Verification code sent successfully" })
  } catch (error: any) {
    console.error("Forgot password API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
