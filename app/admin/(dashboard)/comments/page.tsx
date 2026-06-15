"use client"

import { useState, useEffect } from "react"
import { Trash2, MessageSquare, Search, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"
import { format } from "date-fns"
import Link from "next/link"

interface Comment {
  id: string
  name: string
  content: string
  createdAt: string
  postId: string
  post: {
    title: string
    slug: string
  }
}

export default function CommentsAdminPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/admin/comments")
      if (!res.ok) throw new Error("Failed to load comments")
      const data = await res.json()
      setComments(data)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to fetch comments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
      return
    }

    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE"
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete comment")
      }

      toast.success("Comment deleted successfully!")
      // Remove from local state immediately
      setComments(comments.filter(comment => comment.id !== id))
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Filter comments based on search query
  const filteredComments = comments.filter(comment => 
    comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comment Moderation</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review, search, and manage discussions across all blog articles.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1D27] rounded-2xl border border-gray-200 dark:border-[#2A2D3A] shadow-sm overflow-hidden">
        {/* Search bar header */}
        <div className="p-6 border-b border-gray-100 dark:border-[#2A2D3A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare size={18} className="text-[#D15B3D]" />
            <span>All Comments ({filteredComments.length})</span>
          </h2>
          
          <div className="relative max-w-xs w-full">
            <input 
              type="text" 
              placeholder="Search comments, authors, posts..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#4F6DF5] transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D15B3D] mb-2" />
              <p>Loading comments...</p>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {searchTerm ? "No comments found matching your query." : "No comments found."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#0F1117] border-b border-gray-200 dark:border-[#2A2D3A]">
                  <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider w-1/5">Author</th>
                  <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider w-2/5">Comment</th>
                  <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider w-1/5">Article</th>
                  <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider w-1/10">Date</th>
                  <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right w-1/10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#2A2D3A]">
                {filteredComments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-gray-50 dark:hover:bg-[#2A2D3A]/20 transition-colors align-top">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        {comment.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed break-words max-w-md">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 line-clamp-2">
                          {comment.post.title}
                        </span>
                        <Link 
                          href={`/blog/${comment.post.slug}`} 
                          target="_blank" 
                          className="text-xs text-[#4F6DF5] dark:text-[#8E9EFE] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>View article</span>
                          <ExternalLink size={10} />
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {format(new Date(comment.createdAt), "MMM d, yyyy")}
                      <span className="block text-[10px] text-gray-400 mt-0.5">
                        {format(new Date(comment.createdAt), "h:mm a")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-all"
                        title="Delete Comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
