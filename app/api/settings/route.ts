import { auth } from "@/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: "singleton" },
    })

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: "singleton",
          blogName: "inktoinsight",
          tagline: "Where Ink Meets Market Insight",
          postsPerPage: 6,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error("Get settings API error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { blogName, tagline, postsPerPage } = await req.json()

    if (!blogName || !tagline || typeof postsPerPage !== "number") {
      return NextResponse.json({ error: "Blog name, tagline, and posts per page must be provided correctly" }, { status: 400 })
    }

    const settings = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: {
        blogName: blogName.trim(),
        tagline: tagline.trim(),
        postsPerPage: parseInt(postsPerPage as any),
      },
      create: {
        id: "singleton",
        blogName: blogName.trim(),
        tagline: tagline.trim(),
        postsPerPage: parseInt(postsPerPage as any),
      },
    })

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error("Update settings API error:", error)
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 })
  }
}
