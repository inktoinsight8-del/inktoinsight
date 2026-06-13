"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Shield, User, Mail, FileText, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

interface UserProfile {
  id: string
  name: string
  email: string
  bio: string | null
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)

  // New user form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // Fetch session & active admins list
  const loadData = async () => {
    try {
      // Fetch session to determine who is logged in
      const sessionRes = await fetch("/api/auth/session")
      const session = await sessionRes.json()
      if (session?.user?.email) {
        setCurrentUserEmail(session.user.email)
      }

      // Fetch admin users list
      const usersRes = await fetch("/api/users")
      if (!usersRes.ok) throw new Error("Failed to retrieve users list")
      const usersData = await usersRes.json()
      setUsers(usersData)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to load admin workspace data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Create Admin User
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in name, email, and password.")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.")
      return
    }

    setIsCreating(true)
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
          bio: bio.trim() || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user.")
      }

      toast.success("Administrator account registered!")
      setName("")
      setEmail("")
      setPassword("")
      setBio("")
      
      // Reload users list
      loadData()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  // Delete Admin User
  const handleDelete = async (user: UserProfile) => {
    if (user.email === currentUserEmail) {
      toast.error("Self-protection block: You cannot delete your own account.")
      return
    }

    if (!confirm(`Are you sure you want to revoke admin access for "${user.name}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/users?id=${user.id}`, {
        method: "DELETE",
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user.")
      }

      toast.success("Administrator access revoked.")
      loadData()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Helper to generate profile initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Administration</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Create and manage administrator accounts authorized to access the inktoinsight backend.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Administrator Card */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1A1D27] p-6 rounded-2xl border border-gray-200 dark:border-[#2A2D3A] shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4">Register New Admin</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sanju Sharma"
                  disabled={isCreating}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-[#4F6DF5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  disabled={isCreating}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-[#4F6DF5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Dashboard Password
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  disabled={isCreating}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-[#4F6DF5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Author Biography (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief note about the author..."
                  disabled={isCreating}
                  rows={3}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-[#4F6DF5] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreating || !name.trim() || !email.trim() || !password.trim()}
              className="w-full py-2 bg-[#4F6DF5] hover:bg-[#3B3FA0] disabled:bg-gray-200 dark:disabled:bg-[#2A2D3A] text-white disabled:text-gray-400 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus size={16} />
                  Add User
                </>
              )}
            </button>
          </form>
        </div>

        {/* Administrators List Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D27] rounded-2xl border border-gray-200 dark:border-[#2A2D3A] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-[#2A2D3A] flex justify-between items-center">
            <h2 className="text-lg font-bold">Active Administrators</h2>
            <span className="bg-[#4F6DF5]/10 text-[#4F6DF5] text-xs font-bold px-2.5 py-1 rounded-md">
              {users.length} Total
            </span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-[#2A2D3A]">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F6DF5] mb-2" />
                <p>Loading active users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No users loaded.
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-[#2A2D3A]/20 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* User Initials Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B3FA0] to-[#4F6DF5] text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        {user.email === currentUserEmail && (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                        <span className="text-[10px] bg-gray-100 dark:bg-[#2A2D3A] text-gray-600 dark:text-gray-400 font-medium px-1.5 py-0.5 rounded">
                          Admin
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {user.email}
                      </p>
                      {user.bio ? (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-[#0F1117] p-2.5 rounded-lg border border-gray-100 dark:border-gray-800/40 italic">
                          "{user.bio}"
                        </p>
                      ) : (
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 italic mt-2">
                          No biography details available.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Revoke Action */}
                  {user.email !== currentUserEmail && (
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Revoke Admin Access"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
