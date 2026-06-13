"use client"

import { useState } from "react"

export default function NewsletterPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      
      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-8">
        <span className="text-2xl">📬</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Stay in the Loop</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
        Get the latest insights on finance, quant trading, and AI delivered straight to your inbox. No spam, ever.
      </p>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
        <input 
          type="email" 
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-6 py-4 rounded-full border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] focus:ring-2 focus:ring-[#4F6DF5] focus:outline-none pr-32 shadow-sm"
          disabled={status === "loading" || status === "success"}
        />
        <button 
          type="submit" 
          disabled={status === "loading" || status === "success"}
          className="absolute right-2 top-2 bottom-2 px-6 bg-[#4F6DF5] text-white rounded-full font-medium hover:bg-[#3B3FA0] transition-colors disabled:opacity-70"
        >
          {status === "loading" ? "..." : "Join"}
        </button>
      </form>

      {status === "success" && (
        <p className="mt-6 text-green-600 dark:text-green-400 font-medium">
          Thanks for subscribing! Check your inbox soon.
        </p>
      )}
      {status === "error" && (
        <p className="mt-6 text-red-500 font-medium">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  )
}
