import prisma from "@/lib/prisma"
import Link from "next/link"
import DashboardCharts from "@/components/DashboardCharts"
import { format } from "date-fns"

export default async function AdminDashboard() {
  const [totalPosts, publishedPosts, draftPosts, totalViewsResult, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.findMany({ 
      take: 5, 
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, status: true, views: true, createdAt: true, slug: true }
    })
  ])

  const totalViews = totalViewsResult._sum.views || 0

  const stats = [
    { label: 'Total Posts', value: totalPosts, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Published', value: publishedPosts, color: 'text-green-600 dark:text-green-400' },
    { label: 'Drafts', value: draftPosts, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Total Views', value: totalViews, color: 'text-purple-600 dark:text-purple-400' },
  ]

  // Prepare chart data (top 5 posts by views)
  const topPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { views: 'desc' },
    where: { status: 'PUBLISHED' },
    select: { title: true, views: true }
  })

  const chartData = topPosts.map((p: any) => ({
    name: p.title.substring(0, 15) + (p.title.length > 15 ? '...' : ''),
    views: p.views
  }))

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <Link href="/admin/posts/new" className="px-5 py-2.5 bg-[#000000] dark:bg-[#FFFFFF] text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-sm flex items-center gap-2">
          <span>Write New Post</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-[#1A1D27] p-5 rounded-xl border border-gray-200 dark:border-[#2A2D3A] shadow-sm flex flex-col justify-between">
            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">{stat.label}</h3>
            <p className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D27] rounded-2xl border border-gray-100 dark:border-[#2A2D3A] p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Engagement Overview</h2>
          <DashboardCharts data={chartData} />
        </div>

        <div className="bg-white dark:bg-[#1A1D27] rounded-2xl border border-gray-100 dark:border-[#2A2D3A] p-6 shadow-sm overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {recentPosts.map((post: any) => (
                <div key={post.id} className="border-b border-gray-100 dark:border-[#2A2D3A] pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <Link href={`/admin/posts/${post.id}/edit`} className="font-semibold text-gray-900 dark:text-white hover:text-[#4F6DF5] transition-colors line-clamp-1">
                      {post.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className={`px-2 py-0.5 rounded-full ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {post.status}
                    </span>
                    <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                    <span>{post.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-[#2A2D3A]">
            <Link href="/admin/posts" className="text-sm text-[#4F6DF5] hover:underline font-medium block text-center">
              View all posts &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
