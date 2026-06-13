import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    // Basic IP-based rate limit
    const ip = req.headers.get("x-forwarded-for") || "unknown"
    if (!rateLimit(ip, 5, 15 * 60 * 1000)) { // 5 requests per 15 minutes
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }

    const { email, code, password } = await req.json()

    if (!email || !code || !password) {
      return NextResponse.json({ error: "Email, code, and new password are required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user || !user.resetCode || !user.resetExpires) {
      return NextResponse.json({ error: "No active password reset session found for this email" }, { status: 400 })
    }

    // Check code match
    if (user.resetCode !== code.trim()) {
      return NextResponse.json({ error: "Invalid 6-digit verification code" }, { status: 400 })
    }

    // Check expiration
    if (new Date() > new Date(user.resetExpires)) {
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user password and clear reset fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetExpires: null,
      },
    })

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error: any) {
    console.error("Reset password API error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
