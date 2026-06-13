import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB] dark:bg-[#0F1117] text-[#1A1A2E] dark:text-[#F5F5F7] font-sans selection:bg-[#4F6DF5]/30">
      <header className="sticky top-0 z-50 bg-[#F8F9FB]/75 dark:bg-[#0F1117]/75 backdrop-blur-md border-b border-gray-200/50 dark:border-[#2A2D3A]/50 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="font-serif italic text-2xl font-bold tracking-tight bg-gradient-to-r from-[#3B3FA0] to-[#6C72E2] dark:from-[#4F6DF5] dark:to-[#8E9EFE] bg-clip-text text-transparent hover:opacity-90 transition-opacity duration-300"
          >
            Ink&Insight
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {[
              { label: 'Finance', href: '/blog?category=Finance' },
              { label: 'Tech & AI', href: '/blog?category=Tech%20%26%20AI' },
              { label: 'Culture', href: '/blog?category=Culture' },
              { label: 'Personal', href: '/blog?category=Personal' },
              { label: 'Bookmarks', href: '/bookmarks' }
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href} 
                className="relative py-1 text-gray-500 dark:text-gray-400 hover:text-[#4F6DF5] dark:hover:text-white transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#4F6DF5] after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/newsletter" 
              className="hidden md:inline-flex px-5 py-2 bg-[#1A1A2E] dark:bg-white text-white dark:text-[#1A1A2E] text-sm font-semibold rounded-full hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-white/5 transition-all duration-300"
            >
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
