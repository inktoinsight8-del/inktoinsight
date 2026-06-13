"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('inkinsight_bookmarks') || '[]')
    setBookmarks(saved)
    
    if (saved.length > 0) {
      fetch(`/api/posts/batch?slugs=${saved.join(',')}`)
        .then(res => res.json())
        .then(data => {
          setPosts(data)
          setLoading(false)
        })
        .catch(console.error)
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Your Bookmarks</h1>
      
      {loading ? (
        <p className="text-gray-500">Loading bookmarks...</p>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post: any) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="block bg-white dark:bg-[#1A1D27] p-6 rounded-2xl border border-gray-100 dark:border-[#2A2D3A] hover:border-[#4F6DF5]/50 transition-colors">
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-[#1A1D27] rounded-2xl border border-dashed border-gray-300 dark:border-[#2A2D3A]">
          <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't bookmarked any posts yet.</p>
          <Link href="/blog" className="text-[#4F6DF5] hover:underline font-medium">
            Explore articles
          </Link>
        </div>
      )}
    </div>
  )
}
