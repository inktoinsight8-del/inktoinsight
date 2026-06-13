"use client"

import { useState } from "react"
import toast from "react-hot-toast"

export default function NewsletterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(false)
    setLoading(true)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name })
      })

      if (res.ok) {
        toast.success("Welcome aboard! Check your inbox soon.")
        setName("")
        setEmail("")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } catch {
      toast.error("Failed to subscribe. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <input 
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          required
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#2A2D3A]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#D15B3D] transition-colors"
        />
      </div>
      <div>
        <input 
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#2A2D3A]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#D15B3D] transition-colors"
        />
      </div>
      <button 
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#D15B3D] hover:bg-[#B54A2F] text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
      >
        {loading ? "Joining..." : "Get Free Access →"}
      </button>
    </form>
  )
}
