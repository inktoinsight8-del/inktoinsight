import prisma from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"
import Image from "next/image"
import NewsletterForm from "@/components/NewsletterForm"
import { Clock, Eye, ChevronRight, TrendingUp, Calendar, BookOpen, Award, ArrowUpRight, Heart } from "lucide-react"

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: categoryFilter } = await searchParams

  const [posts, categories, trendingPosts, totalPublishedCount] = await Promise.all([
    prisma.post.findMany({
      where: { 
        status: 'PUBLISHED',
        ...(categoryFilter ? { category: { name: categoryFilter } } : {})
      },
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: { status: 'PUBLISHED' }
            }
          }
        }
      }
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [
        { views: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 3,
      include: { category: true }
    }),
    prisma.post.count({
      where: { status: 'PUBLISHED' }
    })
  ])

  return (
    <div className="space-y-12">
      {/* 1. Exploration Header Banner */}
      <div className="relative rounded-[2rem] bg-gradient-to-br from-[#1E212E] to-[#12141C] border border-gray-200/10 dark:border-[#2A2D3A]/20 p-8 md:p-12 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D15B3D]/10 to-transparent opacity-60 pointer-events-none" />
        <div className="absolute -top-24 -right-24 h-96 w-96 bg-[#3B3FA0]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D15B3D] border-l-2 border-[#D15B3D] pl-2">
            INKTOINSIGHT ARCHIVE
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-white leading-none">
            Explore the <span className="italic text-[#D15B3D] dark:text-[#E25C5C]">Archive.</span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">
            All our deep dives, implementation guides, and technical essays. Filter by topic to find exactly what you need.
          </p>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
          <TrendingUp size={14} className="text-[#D15B3D]" />
          <span>Filter by Topic</span>
        </div>
        <div className="flex flex-wrap gap-2.5 pb-2">
          <Link 
            href="/blog" 
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 active:scale-95 border flex items-center gap-1.5 shadow-sm ${!categoryFilter ? 'bg-[#D15B3D] text-white border-transparent shadow-md shadow-[#D15B3D]/25 scale-105' : 'bg-white dark:bg-[#1A1D27] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2A2D3A] border-gray-200/60 dark:border-[#2A2D3A]/60'}`}
          >
            <span>All Topics</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${!categoryFilter ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
              {totalPublishedCount}
            </span>
          </Link>
          {categories.map((c: any) => {
            const count = c._count.posts
            if (count === 0) return null
            const isActive = categoryFilter === c.name
            return (
              <Link 
                key={c.id}
                href={`/blog?category=${encodeURIComponent(c.name)}`} 
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 active:scale-95 border flex items-center gap-1.5 shadow-sm ${isActive ? 'bg-[#D15B3D] text-white border-transparent shadow-md shadow-[#D15B3D]/25 scale-105' : 'bg-white dark:bg-[#1A1D27] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2A2D3A] border-gray-200/60 dark:border-[#2A2D3A]/60'}`}
              >
                <span>{c.name}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                  {count}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 3. Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Post Grid */}
        <div className="lg:col-span-8 space-y-8">
          {posts.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-[#1A1D27] rounded-3xl border border-gray-200/50 dark:border-[#2A2D3A]/50 border-dashed">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found in this category.</p>
              <Link href="/blog" className="inline-block mt-4 px-6 py-2 bg-[#D15B3D] text-white rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all">
                Reset Filter
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post: any) => {
                const plainText = post.content.replace(/<[^>]*>?/gm, "")
                const words = plainText.trim().split(/\s+/).length
                const calculatedReadTime = Math.max(1, Math.ceil(words / 200)) + " min"
                
                return (
                  <article 
                    key={post.id} 
                    className="group bg-white dark:bg-[#1A1D27] rounded-3xl overflow-hidden border border-gray-200/50 dark:border-[#2A2D3A]/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#D15B3D]/30 transition-all duration-500 flex flex-col h-full"
                  >
                    {/* Cover image area */}
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/10 dark:to-purple-950/10 overflow-hidden border-b border-gray-100 dark:border-gray-800/50">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center font-serif italic text-3xl font-black text-gray-300/40 dark:text-gray-700/30 select-none">
                          inktoinsight
                        </div>
                      )}
                      
                      {/* Floating tag */}
                      <div className="absolute top-4 left-4">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-white bg-[#D15B3D] px-2.5 py-1 rounded-md shadow-sm">
                          {post.category?.name}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-[#D15B3D] transition-colors duration-300 line-clamp-2 leading-snug">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-3 leading-relaxed">
                          {post.excerpt || (plainText.substring(0, 110) + "...")}
                        </p>
                      </div>

                      {/* Meta Footer Row */}
                      <div className="flex flex-col gap-3 pt-5 border-t border-gray-100 dark:border-gray-800/80 mt-5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <div className="flex items-center justify-between">
                          {/* Author info */}
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-[#D15B3D]/10 dark:bg-[#D15B3D]/20 text-[#D15B3D] flex items-center justify-center text-[10px] font-black border border-[#D15B3D]/10">
                              {post.author[0]?.toUpperCase()}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold">{post.author}</span>
                          </div>
                          
                          {/* Reading time */}
                          <span className="flex items-center gap-1">
                            <Clock size={11} className="text-gray-400 dark:text-gray-500" />
                            <span>{post.readTime || calculatedReadTime} read</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-gray-500/80 dark:text-gray-500 text-[9px] tracking-widest">
                          {/* Date */}
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {format(new Date(post.createdAt), 'MMM d, yyyy')}
                          </span>

                          {/* Views & Likes */}
                          <div className="flex items-center gap-2.5">
                            <span className="flex items-center gap-1">
                              <Eye size={11} />
                              {post.views} Views
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart size={11} className="text-red-400/80" />
                              {post.likes} Likes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Widget 1: Author Bio Card */}
          <div className="bg-white dark:bg-[#1A1D27] rounded-3xl border border-gray-200/50 dark:border-[#2A2D3A]/50 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-[#D15B3D]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#D15B3D] to-[#3B3FA0] p-[2px] shadow-md">
                  <div className="h-full w-full rounded-2xl bg-white dark:bg-[#1A1D27] flex items-center justify-center font-serif italic text-xl font-black text-[#D15B3D]">
                    S
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white leading-none">Sanju</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Founder & Author</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Oracle Cloud Finance consultant by profession. Quant trader by obsession. Writer by choice. Based in Hyderabad, sharing real stories and honest technical guides.
              </p>

              {/* Author Stats Row */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 dark:border-gray-800/80 text-center bg-gray-50/50 dark:bg-gray-800/20 rounded-xl">
                <div>
                  <span className="block text-xs font-black text-[#D15B3D]">{totalPublishedCount}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Posts</span>
                </div>
                <div>
                  <span className="block text-xs font-black text-[#D15B3D]">14K+</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Readers</span>
                </div>
                <div>
                  <span className="block text-xs font-black text-[#D15B3D]">3+ Yrs</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Exp</span>
                </div>
              </div>

              <div className="flex gap-4 items-center justify-between text-xs font-bold">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#D15B3D] transition-colors flex items-center gap-1">
                  LinkedIn <ArrowUpRight size={10} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#D15B3D] transition-colors flex items-center gap-1">
                  Twitter <ArrowUpRight size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* Widget 2: Browse Topics Card */}
          <div className="bg-white dark:bg-[#1A1D27] rounded-3xl border border-gray-200/50 dark:border-[#2A2D3A]/50 p-6 shadow-sm">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
              <BookOpen size={13} className="text-[#D15B3D]" />
              <span>Browse Topics</span>
            </h4>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
              {categories.map((c: any) => {
                const count = c._count.posts
                if (count === 0) return null
                const isSelected = categoryFilter === c.name
                
                return (
                  <Link
                    key={c.id}
                    href={`/blog?category=${encodeURIComponent(c.name)}`}
                    className="flex items-center justify-between py-3 group font-bold text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight size={12} className={`text-gray-300 dark:text-gray-700 group-hover:text-[#D15B3D] group-hover:translate-x-0.5 transition-all ${isSelected ? 'text-[#D15B3D]' : ''}`} />
                      <span className={isSelected ? 'text-[#D15B3D]' : ''}>{c.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isSelected ? 'bg-[#D15B3D] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                      {count}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Widget 3: Newsletter Box */}
          <div className="bg-[#1A1D27] dark:bg-[#12141C] border border-gray-800/80 rounded-3xl p-6 shadow-md relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 h-32 w-32 bg-[#D15B3D]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <span className="inline-block text-[8px] font-extrabold uppercase tracking-widest text-[#D15B3D] bg-[#D15B3D]/10 px-2 py-0.5 rounded-md">
                SUNDAY LETTER
              </span>
              <h4 className="text-base font-black tracking-tight leading-snug">
                Join <span className="font-serif italic text-[#D15B3D]">14,000+</span> Weekly Readers
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Trading strategies, Oracle setups, and Python insights delivered directly to your inbox every Sunday.
              </p>
              
              <div className="pt-2">
                <NewsletterForm />
              </div>
            </div>
          </div>

          {/* Widget 4: Trending Articles Widget */}
          <div className="bg-white dark:bg-[#1A1D27] rounded-3xl border border-gray-200/50 dark:border-[#2A2D3A]/50 p-6 shadow-sm">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
              <Award size={13} className="text-[#D15B3D]" />
              <span>Trending Insights</span>
            </h4>
            
            <div className="space-y-4">
              {trendingPosts.map((post: any, i: number) => (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.id} 
                  className="flex gap-3 items-start group"
                >
                  <div className="h-6 w-6 rounded-lg bg-gray-100 dark:bg-gray-800/60 flex items-center justify-center text-xs font-black text-gray-400 dark:text-gray-500 group-hover:bg-[#D15B3D] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[#D15B3D]">
                      {post.category?.name}
                    </span>
                    <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug group-hover:text-[#D15B3D] transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h5>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
                      <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Eye size={9} />
                        {post.views}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </aside>

      </div>
    </div>
  )
}
