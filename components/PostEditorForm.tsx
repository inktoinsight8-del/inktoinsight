"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import TiptapEditor from "@/components/TiptapEditor"
import toast from "react-hot-toast"
import { CldUploadWidget } from "next-cloudinary"

export default function PostEditorForm({ categories }: { categories: any[] }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "")
  const [tags, setTags] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState("DRAFT")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
      
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, slug, excerpt, content, coverImage, categoryId, tags: tagList, status
        })
      })

      if (!res.ok) {
        throw new Error("Failed to save post")
      }
      
      toast.success(status === 'PUBLISHED' ? 'Post published!' : 'Draft saved!')
      router.push("/admin/posts")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Error saving post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">New Post</h1>
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={() => { setStatus("DRAFT"); handleSubmit(new Event('submit') as any) }}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-100 dark:bg-[#2A2D3A] rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium"
          >
            Save as Draft
          </button>
          <button 
            type="submit" 
            onClick={() => setStatus("PUBLISHED")}
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={e => {
                setTitle(e.target.value)
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
              }}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] focus:ring-2 focus:ring-[#4F6DF5] focus:outline-none"
              placeholder="Post title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1A1D27] p-6 rounded-2xl border border-gray-100 dark:border-[#2A2D3A]">
            <h3 className="font-bold mb-4">Meta Data</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input 
                  type="text" 
                  required
                  value={slug} 
                  onChange={e => setSlug(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-gray-50 dark:bg-[#0F1117]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea 
                  value={excerpt} 
                  onChange={e => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cover Image</label>
                {coverImage ? (
                  <div className="relative mb-2">
                    <img src={coverImage} alt="Cover" className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-[#2A2D3A]" />
                    <button 
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <CldUploadWidget 
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset"} 
                    options={{ maxFiles: 1 }}
                    onSuccess={(result: any, { widget }) => {
                      if (result.info?.secure_url) {
                        setCoverImage(result.info.secure_url)
                        widget.close()
                      }
                    }}
                  >
                    {({ open }) => (
                      <button 
                        type="button" 
                        onClick={() => open()}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-[#2A2D3A] rounded-lg text-gray-500 dark:text-gray-400 hover:border-[#4F6DF5] hover:text-[#4F6DF5] transition-colors flex items-center justify-center font-medium"
                      >
                        Upload Cover Image
                      </button>
                    )}
                  </CldUploadWidget>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  value={categoryId} 
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117]"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={tags} 
                  onChange={e => setTags(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117]"
                  placeholder="Finance, AI, Tech"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
