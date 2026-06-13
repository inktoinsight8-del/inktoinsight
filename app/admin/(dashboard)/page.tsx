import prisma from "@/lib/prisma"
import RealtimeDashboard from "@/components/RealtimeDashboard"

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
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

  const initialData = {
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews,
    recentPosts: recentPosts.map((p: any) => ({ ...p, createdAt: p.createdAt.toISOString() })),
    topPosts
  }

  return <RealtimeDashboard initialData={initialData} />
}
