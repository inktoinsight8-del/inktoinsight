"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import DashboardCharts from "@/components/DashboardCharts"

type PostData = {
  id: string
  title: string
  status: string
  views: number
  createdAt: string
  slug: string
}

type StatsType = {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  recentPosts: PostData[]
  topPosts: { title: string; views: number }[]
}

export default function RealtimeDashboard({ initialData }: { initialData: StatsType }) {
  const [data, setData] = useState<StatsType>(initialData)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats')
        if (res.ok) {
          const newData = await res.json()
          setData(newData)
        }
      } catch (err) {
        console.error("Failed to poll dashboard stats", err)
      }
    }

    // Poll every 5 seconds
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { label: 'Total Posts', value: data.totalPosts, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Published', value: data.publishedPosts, color: 'text-green-600 dark:text-green-400' },
    { label: 'Drafts', value: data.draftPosts, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Total Views', value: data.totalViews, color: 'text-purple-600 dark:text-purple-400' },
  ]

  const chartData = data.topPosts.map((p) => ({
    name: p.title.substring(0, 15) + (p.title.length > 15 ? '...' : ''),
    views: p.views
  }))

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
            Live Real-Time View
          </p>
        </div>
        <Link href="/admin/posts/new" className="px-5 py-2.5 bg-[#000000] dark:bg-[#FFFFFF] text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-sm flex items-center gap-2">
          <span>Write New Post</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-[#1A1D27] p-5 rounded-xl border border-gray-200 dark:border-[#2A2D3A] shadow-sm flex flex-col justify-between transition-all duration-300">
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
              {data.recentPosts.length === 0 ? (
                <div className="text-sm text-gray-500">No posts yet.</div>
              ) : (
                data.recentPosts.map((post) => (
                  <div key={post.id} className="border-b border-gray-100 dark:border-[#2A2D3A] pb-4 last:border-0 transition-all">
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
                      <span className="font-medium text-[#4F6DF5]">{post.views} views</span>
                    </div>
                  </div>
                ))
              )}
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
