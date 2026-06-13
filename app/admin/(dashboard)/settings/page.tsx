"use client"

import React, { useState, useEffect } from "react"
import { Settings, Save, Loader2, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

export default function SettingsAdminPage() {
  const [blogName, setBlogName] = useState("")
  const [tagline, setTagline] = useState("")
  const [postsPerPage, setPostsPerPage] = useState(6)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch current singleton settings
  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings")
      if (!res.ok) throw new Error("Failed to fetch site settings")
      const data = await res.json()
      
      setBlogName(data.blogName || "")
      setTagline(data.tagline || "")
      setPostsPerPage(data.postsPerPage || 6)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to load dashboard settings.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  // Save settings handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blogName.trim() || !tagline.trim()) {
      toast.error("Blog name and tagline cannot be blank.")
      return
    }

    if (postsPerPage < 1 || postsPerPage > 100) {
      toast.error("Posts per page must be a value between 1 and 100.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogName: blogName.trim(),
          tagline: tagline.trim(),
          postsPerPage: Number(postsPerPage),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to update settings.")
      }

      toast.success("Settings updated successfully!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configure global variables, blog branding, metadata, and pagination preferences.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1D27] rounded-2xl border border-gray-200 dark:border-[#2A2D3A] shadow-sm overflow-hidden transition-all duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-[#2A2D3A] flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#4F6DF5]" />
            Site Configuration
          </h2>
          {loading && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading...
            </div>
          )}
        </div>

        {loading ? (
          <div className="p-16 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F6DF5] mb-2" />
            <p className="text-xs">Fetching system settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Blog Name Input */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Blog Name / Header Brand
                </label>
                <input
                  type="text"
                  required
                  value={blogName}
                  onChange={(e) => setBlogName(e.target.value)}
                  placeholder="e.g. inktoinsight"
                  disabled={saving}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] text-gray-900 dark:text-white focus:outline-none focus:border-[#4F6DF5] focus:ring-1 focus:ring-[#4F6DF5] transition-all"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Appears in your site header, meta title prefixes, and footer copyright signatures.
                </p>
              </div>

              {/* Tagline Input */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Branding Tagline
                </label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Where Ink Meets Market Insight"
                  disabled={saving}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] text-gray-900 dark:text-white focus:outline-none focus:border-[#4F6DF5] focus:ring-1 focus:ring-[#4F6DF5] transition-all"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">
                  A catchy sub-heading used on homepages, sub-headers, and search engine results summaries.
                </p>
              </div>

              {/* Posts Per Page Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Posts Per Page (Pagination Limit)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={postsPerPage}
                  onChange={(e) => setPostsPerPage(Number(e.target.value))}
                  disabled={saving}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] text-gray-900 dark:text-white focus:outline-none focus:border-[#4F6DF5] focus:ring-1 focus:ring-[#4F6DF5] transition-all"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Number of blog posts rendered before dividing results into paginated pages.
                </p>
              </div>

            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-[#2A2D3A] flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#4F6DF5] hover:bg-[#3B3FA0] disabled:bg-gray-200 dark:disabled:bg-[#2A2D3A] text-white disabled:text-gray-400 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Configuration
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
