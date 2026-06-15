"use client"

import { useState, useEffect } from "react"
import { Mail, Send, Search, Trash2, Users } from "lucide-react"
import toast from "react-hot-toast"
import TiptapEditor from "@/components/TiptapEditor"
import { format } from "date-fns"

interface Subscriber {
  id: string
  email: string
  createdAt: string
}

export default function NewsletterAdminPage() {
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/newsletter/subscribers")
      if (!res.ok) throw new Error("Failed to load subscribers")
      const data = await res.json()
      setSubscribers(data)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to load subscribers")
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !content.trim()) {
      toast.error("Subject and message content are required.")
      return
    }

    if (subscribers.length === 0) {
      toast.error("No subscribers found to send to.")
      return
    }

    if (!confirm(`Are you sure you want to broadcast this newsletter to all ${subscribers.length} subscribers?`)) {
      return
    }

    setSubmitting(true)
    const toastId = toast.loading("Broadcasting email campaign...")
    
    try {
      const res = await fetch("/api/admin/newsletter/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to broadcast newsletter")
      }

      toast.success(
        `Broadcast completed! Sent: ${data.sent}, Failed: ${data.failed}`, 
        { id: toastId, duration: 6000 }
      )
      
      // Clear composer on successful broadcast
      setSubject("")
      setContent("")
    } catch (error: any) {
      toast.error(error.message || "Broadcast failed.", { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove "${email}" from the subscriber list?`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: "DELETE"
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete subscriber")
      }

      toast.success("Subscriber removed successfully")
      setSubscribers(subscribers.filter(sub => sub.id !== id))
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter Campaigns</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Compose rich-text updates and dispatch them directly to all Sunday Letter readers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Email Composer Form */}
        <form onSubmit={handleBroadcast} className="lg:col-span-8 bg-white dark:bg-[#1A1D27] p-6 rounded-2xl border border-gray-200 dark:border-[#2A2D3A] shadow-sm space-y-6">
          <div className="border-b border-gray-100 dark:border-[#2A2D3A] pb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Mail size={18} className="text-[#D15B3D]" />
              <span>Compose Campaign</span>
            </h2>
            
            <button
              type="submit"
              disabled={submitting || subscribers.length === 0}
              className="px-5 py-2 bg-[#D15B3D] hover:bg-[#B54A2F] disabled:opacity-50 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{submitting ? "Sending..." : "Send Broadcast"}</span>
              <Send size={12} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="newsletter-subject" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Subject Line
              </label>
              <input
                id="newsletter-subject"
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Sunday Letter: AI Trading + Oracle Cloud traps"
                required
                disabled={submitting}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D15B3D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email Body Content
              </label>
              <div className="border border-gray-300 dark:border-[#2A2D3A] rounded-xl overflow-hidden min-h-[500px]">
                <TiptapEditor 
                  content={content} 
                  onChange={setContent} 
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right Column: Subscriber Database Manager */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1A1D27] rounded-2xl border border-gray-200 dark:border-[#2A2D3A] shadow-sm overflow-hidden flex flex-col max-h-[770px]">
          <div className="p-6 border-b border-gray-100 dark:border-[#2A2D3A] space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users size={18} className="text-[#3B3FA0] dark:text-[#4F6DF5]" />
              <span>Subscribers ({subscribers.length})</span>
            </h2>

            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Filter by email..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#4F6DF5] transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-[300px]">
            {loadingList ? (
              <div className="p-8 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#4F6DF5] mb-2" />
                <p className="text-xs">Loading mailing list...</p>
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs">
                {searchTerm ? "No emails match your filter." : "Your list is currently empty."}
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-[#2A2D3A]">
                {filteredSubscribers.map(sub => (
                  <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#2A2D3A]/20 transition-all gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {sub.email}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        Added {format(new Date(sub.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-all flex-shrink-0"
                      title="Delete Subscriber"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
