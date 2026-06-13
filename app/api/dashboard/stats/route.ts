import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const [totalPosts, publishedPosts, draftPosts, totalViewsResult, recentPosts, topPosts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.post.findMany({ 
        take: 5, 
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, status: true, views: true, createdAt: true, slug: true }
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { views: 'desc' },
        where: { status: 'PUBLISHED' },
        select: { title: true, views: true }
      })
    ])

    const totalViews = totalViewsResult._sum.views || 0

    return NextResponse.json({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      recentPosts,
      topPosts
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
