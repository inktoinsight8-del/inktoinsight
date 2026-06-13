"use client"

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DeletePostButton({ postId, title }: { postId: string, title: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
      setIsDeleting(true)
      try {
        const res = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        })
        
        if (!res.ok) throw new Error('Failed to delete post')
        
        toast.success('Post deleted successfully')
        router.refresh()
      } catch (error) {
        console.error(error)
        toast.error('Failed to delete post')
        setIsDeleting(false)
      }
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className={`text-gray-400 hover:text-red-500 transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Delete post"
    >
      <Trash2 size={18} />
    </button>
  )
}
