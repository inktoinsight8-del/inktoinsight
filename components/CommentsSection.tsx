"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import toast from "react-hot-toast"
import { MessageSquare, Send, User } from "lucide-react"

type Comment = {
  id: string
  name: string
  content: string
  createdAt: string
}

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      } else {
        console.error("Failed to load comments")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) {
      toast.error("Please fill in both name and comment.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success("Comment posted successfully!")
        setContent("")
        // Refresh list
        setComments((prev) => [data, ...prev])
      } else {
        toast.error(data.error || "Failed to post comment.")
      }
    } catch (err) {
      console.error(err)
      toast.error("An error occurred while posting comment.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-16 border-t border-gray-200 dark:border-[#2A2D3A] pt-12 space-y-12">
      <div className="flex items-center gap-3">
        <MessageSquare className="text-[#D15B3D] dark:text-[#E25C5C]" size={24} />
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Discussion ({comments.length})
        </h2>
      </div>

      {/* 1. Comment Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1A1D27] p-6 rounded-3xl border border-gray-200/50 dark:border-[#2A2D3A]/50 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Join the conversation</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="comment-name" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500">
                <User size={16} />
              </span>
              <input
                id="comment-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-[#2A2D3A] bg-gray-50 dark:bg-[#0F1117] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D15B3D] transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="comment-content" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Comment
            </label>
            <textarea
              id="comment-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are your thoughts on this article?"
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-[#2A2D3A] bg-gray-50 dark:bg-[#0F1117] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D15B3D] transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#D15B3D] hover:bg-[#B54A2F] disabled:opacity-50 text-white text-xs font-bold rounded-full uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{submitting ? "Posting..." : "Post Comment"}</span>
            <Send size={12} />
          </button>
        </div>
      </form>

      {/* 2. Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 dark:border-[#2A2D3A] rounded-2xl text-gray-500 dark:text-gray-400 text-sm">
            No comments yet. Be the first to start the discussion!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-[#1A1D27] p-6 rounded-2xl border border-gray-100 dark:border-[#2A2D3A] shadow-sm flex flex-col gap-2 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {comment.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed mt-1">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
