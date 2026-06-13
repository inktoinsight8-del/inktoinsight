import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB] dark:bg-[#0F1117] text-[#1A1A2E] dark:text-[#F5F5F7] font-sans selection:bg-[#4F6DF5]/30">
      <header className="sticky top-0 z-50 bg-[#F8F9FB]/80 dark:bg-[#0F1117]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#2A2D3A]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif italic text-2xl font-bold tracking-tight text-[#3B3FA0] dark:text-[#4F6DF5]">
            Ink&Insight
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/blog?category=Finance" className="hover:text-[#4F6DF5] transition-colors">Finance</Link>
            <Link href="/blog?category=Tech & AI" className="hover:text-[#4F6DF5] transition-colors">Tech & AI</Link>
            <Link href="/blog?category=Culture" className="hover:text-[#4F6DF5] transition-colors">Culture</Link>
            <Link href="/blog?category=Personal" className="hover:text-[#4F6DF5] transition-colors">Personal</Link>
            <Link href="/bookmarks" className="hover:text-[#4F6DF5] transition-colors">Bookmarks</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/newsletter" className="hidden md:inline-flex px-4 py-2 bg-[#1A1A2E] dark:bg-white text-white dark:text-[#1A1A2E] text-sm font-medium rounded-full hover:bg-[#3B3FA0] dark:hover:bg-gray-200 transition-colors">
              Subscribe
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-10">
        {children}
      </main>

      <footer className="bg-white dark:bg-[#1A1D27] border-t border-gray-200 dark:border-[#2A2D3A] mt-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="font-serif italic text-xl font-bold text-[#3B3FA0] dark:text-[#4F6DF5] mb-2">Ink&Insight</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Where Ink Meets Market Insight.</p>
          </div>
          
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#4F6DF5] transition-colors">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#4F6DF5] transition-colors">LinkedIn</a>
            <Link href="/admin/login" className="hover:text-[#4F6DF5] transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
