"use client"

import { useEffect, useState } from "react"
import { Bookmark, Heart, Share2 } from "lucide-react"

export default function PostActions({ postId, slug, initialLikes }: { postId: string, slug: string, initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)

  useEffect(() => {
    // Check bookmarks in localStorage
    const bookmarks = JSON.parse(localStorage.getItem('inkinsight_bookmarks') || '[]')
    if (bookmarks.includes(slug)) {
      setIsBookmarked(true)
    }
  }, [slug])

  const handleLike = async () => {
    if (hasLiked) return
    setHasLiked(true)
    setLikes(l => l + 1)
    // Would call API to increment like here
    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
    } catch (e) {
      console.error('Failed to like', e)
    }
  }

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('inkinsight_bookmarks') || '[]')
    if (isBookmarked) {
      const updated = bookmarks.filter((b: string) => b !== slug)
      localStorage.setItem('inkinsight_bookmarks', JSON.stringify(updated))
      setIsBookmarked(false)
    } else {
      bookmarks.push(slug)
      localStorage.setItem('inkinsight_bookmarks', JSON.stringify(bookmarks))
      setIsBookmarked(true)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-40 bg-white/90 dark:bg-[#1A1D27]/90 backdrop-blur border border-gray-200 dark:border-[#2A2D3A] rounded-full px-6 py-3 shadow-lg flex items-center gap-6">
      <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${hasLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}>
        <Heart size={20} className={hasLiked ? 'fill-current' : ''} />
        <span className="text-sm font-medium">{likes}</span>
      </button>
      
      <div className="w-px h-4 bg-gray-300 dark:bg-[#2A2D3A]"></div>
      
      <button onClick={handleBookmark} className={`transition-colors ${isBookmarked ? 'text-[#4F6DF5]' : 'text-gray-500 dark:text-gray-400 hover:text-[#4F6DF5]'}`}>
        <Bookmark size={20} className={isBookmarked ? 'fill-current' : ''} />
      </button>
      
      <div className="w-px h-4 bg-gray-300 dark:bg-[#2A2D3A]"></div>
      
      <button onClick={handleShare} className="text-gray-500 dark:text-gray-400 hover:text-[#4F6DF5] transition-colors">
        <Share2 size={20} />
      </button>
    </div>
  )
}
