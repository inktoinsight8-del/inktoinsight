import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle"
import { Search, Bookmark, ArrowUpRight } from "lucide-react"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB] dark:bg-[#0F1117] text-[#1A1A2E] dark:text-[#F5F5F7] font-sans selection:bg-[#4F6DF5]/30">
      <header className="sticky top-0 z-50 bg-[#F8F9FB]/75 dark:bg-[#0F1117]/75 backdrop-blur-md border-b border-gray-200/50 dark:border-[#2A2D3A]/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="font-serif italic text-2xl font-black tracking-tight text-[#1A1A2E] dark:text-white hover:opacity-90 transition-opacity duration-300 flex-shrink-0"
          >
            Ink<span className="text-[#D15B3D] dark:text-[#E25C5C]">&</span>Insight
          </Link>
          
          {/* Search bar */}
          <div className="relative max-w-xs w-full hidden md:block flex-grow max-w-[240px] lg:max-w-[280px]">
            <input 
              type="text" 
              placeholder="Search posts, tags, topics..." 
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-gray-200 dark:border-[#2A2D3A] bg-white dark:bg-[#1A1D27] placeholder-gray-400 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D15B3D] transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold flex-shrink-0">
            {[
              { label: 'Blog', href: '/blog' },
              { label: 'Finance', href: '/blog?category=Finance' },
              { label: 'Tech & AI', href: '/blog?category=Tech%20%26%20AI' },
              { label: 'Culture', href: '/blog?category=Culture' },
              { label: 'Personal', href: '/blog?category=Personal' }
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href} 
                className="relative py-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#D15B3D] after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions & Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            
            {/* Bookmarks */}
            <Link 
              href="/bookmarks" 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/20 text-[#E25C5C] dark:text-red-400 rounded-full text-xs font-bold hover:bg-red-100 dark:hover:bg-red-950/40 transition-all border border-red-100/50 dark:border-red-950/50"
            >
              <Bookmark size={12} className="fill-current text-[#E25C5C] dark:text-red-400" />
              <span>Saved</span>
            </Link>

            {/* Subscribe */}
            <Link 
              href="/newsletter" 
              className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors py-1.5 px-3"
            >
              Subscribe
            </Link>

            {/* Admin */}
            <Link 
              href="/admin" 
              className="flex items-center gap-1 px-4 py-2 bg-[#D15B3D] hover:bg-[#B54A2F] text-white rounded-full text-xs font-bold transition-all shadow-sm shadow-[#D15B3D]/20 active:scale-95"
            >
              <span>Admin</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
        {children}
      </main>

      <footer className="bg-white dark:bg-[#1A1D27] border-t border-gray-200 dark:border-[#2A2D3A] mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="font-serif italic text-xl font-bold text-[#1A1A2E] dark:text-white mb-2">
              Ink<span className="text-[#D15B3D] dark:text-[#E25C5C]">&</span>Insight
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Where Ink Meets Market Insight.</p>
          </div>
          
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#D15B3D] transition-colors">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#D15B3D] transition-colors">LinkedIn</a>
            <Link href="/admin" className="hover:text-[#D15B3D] transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
