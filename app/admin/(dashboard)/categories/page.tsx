"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Check, X } from "lucide-react"
import toast from "react-hot-toast"

interface Category {
  id: string
  name: string
  _count: {
    posts: number
  }
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error("Failed to load categories")
      const data = await res.json()
      setCategories(data)
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Create Category
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    setIsCreating(true)
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create category")
      }

      toast.success("Category created!")
      setNewCategoryName("")
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  // Edit/Rename Category
  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return

    setIsUpdating(true)
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to rename category")
      }

      toast.success("Category renamed!")
      setEditingId(null)
      setEditingName("")
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  // Delete Category
  const handleDelete = async (category: Category) => {
    if (category._count.posts > 0) {
      toast.error(`Safety Block: Cannot delete. Move or delete the ${category._count.posts} post(s) using this category first.`)
      return
    }

    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE"
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category")
      }

      toast.success("Category deleted!")
      fetchCategories()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const startEditing = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Manager</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Add, rename, or delete classifications dynamically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1A1D27] p-6 rounded-2xl border border-gray-200 dark:border-[#2A2D3A] shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4">Add New Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Category Name</label>
              <input 
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="e.g. Finance, Tech"
                disabled={isCreating}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:border-[#4F6DF5]"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating || !newCategoryName.trim()}
              className="w-full py-2 bg-[#4F6DF5] hover:bg-[#3B3FA0] disabled:bg-gray-200 dark:disabled:bg-[#2A2D3A] text-white disabled:text-gray-400 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Add Category
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D27] rounded-2xl border border-gray-200 dark:border-[#2A2D3A] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-[#2A2D3A]">
            <h2 className="text-lg font-bold">Active Classifications</h2>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F6DF5] mb-2" />
                <p>Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No categories found. Add one to get started!</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#0F1117] border-b border-gray-200 dark:border-[#2A2D3A]">
                    <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-center">Post Count</th>
                    <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2A2D3A]">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-[#2A2D3A]/20 transition-colors">
                      <td className="px-6 py-4">
                        {editingId === category.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="text"
                              value={editingName}
                              onChange={e => setEditingName(e.target.value)}
                              disabled={isUpdating}
                              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-[#2A2D3A] bg-white dark:bg-[#0F1117] text-gray-900 dark:text-white focus:outline-none focus:border-[#4F6DF5]"
                              autoFocus
                            />
                            <button 
                              onClick={() => handleUpdate(category.id)}
                              disabled={isUpdating}
                              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              disabled={isUpdating}
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-[#2A2D3A]/50 px-2.5 py-1 rounded-md text-xs">
                            {category.name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-800 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 rounded-full min-w-6">
                          {category._count.posts}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {editingId !== category.id && (
                            <>
                              <button 
                                onClick={() => startEditing(category)}
                                className="p-1.5 text-gray-400 hover:text-[#4F6DF5] hover:bg-gray-100 dark:hover:bg-[#2A2D3A] rounded transition-all"
                                title="Rename Category"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button 
                                onClick={() => handleDelete(category)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                                title="Delete Category"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
