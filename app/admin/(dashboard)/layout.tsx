import Link from 'next/link'
import { LogOut, LayoutDashboard, FileText, Settings, PlusCircle } from 'lucide-react'
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
            <Link href="/admin" className="font-serif italic text-2xl font-bold tracking-tight text-[#3B3FA0] dark:text-[#4F6DF5]">
              Ink&Insight
            </Link>
          </div>
          
          <nav className="flex-1 space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D3A] transition-colors font-medium">
              <LayoutDashboard size={20} className="text-gray-500" />
              Dashboard
            </Link>
            <Link href="/admin/posts" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D3A] transition-colors font-medium">
              <FileText size={20} className="text-gray-500" />
              All Posts
            </Link>
            <Link href="/admin/posts/new" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D3A] transition-colors font-medium">
              <PlusCircle size={20} className="text-gray-500" />
              New Post
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D3A] transition-colors font-medium">
              <Settings size={20} className="text-gray-500" />
              Settings
            </Link>
          </nav>

          <div className="mt-8 border-t border-gray-200 dark:border-[#2A2D3A] pt-4">
            <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              Signed in as <strong>{session.user.name}</strong>
            </div>
            <form action={async () => {
              "use server"
              await signOut()
            }}>
              <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors font-medium">
                <LogOut size={20} />
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
