import prisma from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"
import { Edit, Trash2 } from "lucide-react"

import DeletePostButton from "@/components/DeletePostButton"

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <Link href="/admin/posts/new" className="px-4 py-2 bg-[#4F6DF5] text-white rounded-lg hover:bg-[#3B3FA0] transition-colors font-medium">
          New Post
        </Link>
      </div>

      <div className="bg-white dark:bg-[#1A1D27] rounded-2xl border border-gray-100 dark:border-[#2A2D3A] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#0F1117] border-b border-gray-200 dark:border-[#2A2D3A]">
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2A2D3A]">
              {posts.map((post: any) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-[#2A2D3A]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{post.title}</div>
                    <div className="text-sm text-gray-500">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {post.category?.name || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/posts/${post.id}/edit`} className="text-gray-400 hover:text-[#4F6DF5] transition-colors">
                        <Edit size={18} />
                      </Link>
                      <DeletePostButton postId={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No posts found. Start writing!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
