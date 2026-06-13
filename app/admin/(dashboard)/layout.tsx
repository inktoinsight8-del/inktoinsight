import Link from 'next/link'
import { LogOut, LayoutDashboard, FileText, Settings, PlusCircle, Folder, Users } from 'lucide-react'
import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    // Should be handled by middleware, but double check
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F1117] text-gray-900 dark:text-[#F5F5F7] flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-white dark:bg-[#1A1D27] border-b md:border-r border-gray-200 dark:border-[#2A2D3A] flex-shrink-0">
        <div className="p-6 h-full flex flex-col">
          <div className="mb-8 flex items-center justify-between md:justify-start gap-4">
            <Link href="/admin" className="flex items-center gap-2 font-serif italic text-2xl font-bold tracking-tight text-[#3B3FA0] dark:text-[#4F6DF5]">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover bg-white" />
              <span>inktoinsight</span>
            </Link>
          </div>
          
          <nav className="flex-1 space-y-1.5 mt-4">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D3A] transition-all text-sm font-semibold text-gray-700 dark:text-gray-300">
              <LayoutDashboard size={18} className="text-gray-400" />
              Dashboard
            </Link>
            <Link href="/admin/posts" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D3A] transition-all text-sm font-semibold text-gray-700 dark:text-gray-300">
              <FileText size={18} className="text-gray-400" />
              All Posts
            </Link>
            <Link href="/admin/posts/new" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D3A] transition-all text-sm font-semibold text-gray-700 dark:text-gray-300">
              <PlusCircle size={18} className="text-gray-400" />
              New Post
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D3A] transition-all text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Folder size={18} className="text-gray-400" />
              Categories
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D3A] transition-all text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Users size={18} className="text-gray-400" />
              Users
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D3A] transition-all text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Settings size={18} className="text-gray-400" />
              Settings
            </Link>
          </nav>

          <div className="mt-8 border-t border-gray-100 dark:border-[#2A2D3A] pt-6">
            <div className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Account
            </div>
            <div className="px-4 py-2 text-sm text-gray-900 dark:text-white font-medium mb-2 truncate">
              {session.user.name}
            </div>
            <form action={async () => {
              "use server"
              await signOut()
            }}>
              <button type="submit" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-all text-sm font-semibold">
                <LogOut size={18} />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
