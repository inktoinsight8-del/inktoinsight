import prisma from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"
import Image from "next/image"
import NewsletterForm from "@/components/NewsletterForm"
import { ArrowRight, ArrowUpRight, Bookmark } from "lucide-react"

export default async function HomePage() {
  const [latestPosts, totalPublishedCount] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true }
    }),
    prisma.post.count({
      where: { status: 'PUBLISHED' }
    })
  ])

  return (
    <div className="space-y-16">
      
      {/* 1. Hero Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 md:pt-16">
        
        {/* Left Side */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D15B3D] border-l-2 border-[#D15B3D] pl-2">
            FINANCE • AI • TRADING • LIFE
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight leading-[1.12] text-[#1A1A2E] dark:text-white">
            Where <span className="italic text-[#3B3FA0] dark:text-[#4F6DF5]">Ink</span> Meets <br />
            Market <span className="italic text-[#D15B3D] dark:text-[#E25C5C]">Insight.</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
            Deep dives into quant trading, Oracle Cloud, AI systems, and the intersections of finance & technology. Real stories. Honest insights. Written from Hyderabad.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <Link 
              href="/blog" 
              className="px-8 py-3.5 bg-[#D15B3D] hover:bg-[#B54A2F] text-white rounded-full font-bold transition-all shadow-md shadow-[#D15B3D]/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Start Reading</span>
              <ArrowRight size={14} />
            </Link>
            <Link 
              href="/newsletter" 
              className="px-8 py-3.5 border border-gray-300 dark:border-[#2A2D3A] text-gray-700 dark:text-gray-300 rounded-full font-bold transition-all hover:bg-gray-50 dark:hover:bg-[#1A1D27] flex items-center justify-center cursor-pointer"
            >
              Get Free Newsletter
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-6">
            <div className="flex -space-x-2.5 overflow-hidden">
              {['#D15B3D', '#3B3FA0', '#4F6DF5', '#8E9EFE', '#F5A623'].map((color, i) => (
                <div 
                  key={i} 
                  style={{ backgroundColor: color }} 
                  className="inline-block h-8 w-8 rounded-full border-2 border-white dark:border-[#0F1117] flex items-center justify-center text-[10px] font-black text-white shadow-sm"
                >
                  {['S', 'R', 'A', 'M', 'P'][i]}
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-snug">
              <strong className="text-gray-950 dark:text-white font-bold">14,000+ readers</strong> every Sunday<br />across India & beyond
            </p>
          </div>
        </div>

        {/* Right Side Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-gray-200/50 dark:border-[#2A2D3A]/50 bg-gradient-to-br from-[#1E212E] to-[#12141C] p-8 flex flex-col justify-end shadow-xl">
            {/* Article Count Badge */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-right">
              <span className="block text-2xl font-extrabold text-[#D15B3D] dark:text-[#E25C5C] leading-none">{totalPublishedCount}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Articles published</span>
            </div>
            
            {/* Background Graphic/Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
              <span className="text-[260px] font-black font-serif italic text-white">S</span>
            </div>

            {latestPosts[0] ? (
              <div className="relative z-10 space-y-4">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#D15B3D] bg-[#D15B3D]/10 px-2.5 py-1 rounded-full">
                  ✦ LATEST POST
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white line-clamp-2 leading-snug">
                  {latestPosts[0].title}
                </h2>
                <div className="flex items-center gap-2.5 text-xs text-gray-400 font-semibold">
                  <span>{latestPosts[0].author}</span>
                  <span>·</span>
                  <span>{format(new Date(latestPosts[0].createdAt), 'MMM d, yyyy')}</span>
                  {latestPosts[0].readTime && (
                    <>
                      <span>·</span>
                      <span>{latestPosts[0].readTime}</span>
                    </>
                  )}
                </div>
                <div className="pt-2">
                  <Link 
                    href={`/blog/${latestPosts[0].slug}`} 
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-white px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Read All</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative z-10 text-center py-12 text-gray-400">
                No publications yet. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Infinite Marquee Ticker */}
      <div className="w-full overflow-hidden border-y border-gray-200/50 dark:border-[#2A2D3A]/50 bg-white dark:bg-[#1A1D27] py-4 my-8 relative flex">
        <div className="animate-marquee flex whitespace-nowrap gap-12 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 select-none">
          {Array(3).fill([
            'Oracle Cloud', 'NSE Quant Strategies', 'Weekly Newsletter', 
            'InkAndInsight.in', 'Deep Dives Every Week', '14K+ Readers', 
            'Finance & Trading', 'AI & Python'
          ]).flat().map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span>{item}</span>
              <span className="text-[#D15B3D] font-extrabold">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. About the Author Section */}
      <section className="py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Gradient box */}
        <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#D15B3D]/10 to-[#3B3FA0]/10 border border-gray-200/50 dark:border-[#2A2D3A]/50 shadow-sm relative overflow-hidden flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D15B3D]/25 to-transparent opacity-60 pointer-events-none" />
          <div className="relative z-10 text-center space-y-4">
            <div className="font-serif italic text-5xl font-black text-[#1A1A2E] dark:text-white">Sanju</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Founder & Author</p>
          </div>
        </div>
        
        {/* Right Side: Text bio */}
        <div className="space-y-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D15B3D] border-l-2 border-[#D15B3D] pl-2">
            ABOUT THE AUTHOR
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            The Mind Behind <br />
            <span className="font-serif italic text-[#3B3FA0] dark:text-[#4F6DF5]">Ink</span>And<span className="font-serif italic text-[#D15B3D] dark:text-[#E25C5C]">Insight.</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Oracle Cloud Finance consultant by profession. Quant trader by obsession. Writer by choice. Based in Hyderabad, I built InkAndInsight as a space where finance meets technology meets honest writing.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Every article here is something I wish existed when I was learning — practical, specific, and written by someone who actually does the work. No generic advice. No fluff. Just insight.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Oracle Cloud Finance', 'Quant Trading', 'Python-LangGraph', 'CMA India'].map((tag) => (
              <span key={tag} className="px-3.5 py-1 bg-gray-100 dark:bg-[#2A2D3A]/50 text-gray-600 dark:text-gray-400 rounded-full text-xs font-bold">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Three Things I Know Deeply */}
      <section className="py-8 border-t border-gray-100 dark:border-[#2A2D3A]/50">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D15B3D]">WHAT I WRITE ABOUT</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">Three Things I Know <span className="font-serif italic text-[#D15B3D] dark:text-[#E25C5C]">Deeply</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Finance & Trading",
              body: "NSE swing trading strategies, MTF leverage mechanics, Monte Carlo risk models, and the psychology of holding through volatility. Real trades, real numbers.",
              color: "border-[#4F6DF5]/10 hover:border-[#4F6DF5]/40",
              bgColor: "bg-blue-500/5",
              icon: "📈"
            },
            {
              title: "AI & Technology",
              body: "Building LangGraph multi-agent systems, Oracle Cloud implementations, Python quant tools, and honest takes on what AI can and cannot do in 2026.",
              color: "border-[#D15B3D]/10 hover:border-[#D15B3D]/40",
              bgColor: "bg-[#D15B3D]/5",
              icon: "🤖"
            },
            {
              title: "Life & Career",
              body: "CMA journey, consulting life, Hyderabad's tech ecosystem, and personal essays on balancing a demanding career with ambitious side projects.",
              color: "border-purple-500/10 hover:border-purple-500/40",
              bgColor: "bg-purple-500/5",
              icon: "✍️"
            }
          ].map((item, i) => (
            <div 
              key={i} 
              className={`p-8 bg-white dark:bg-[#1A1D27] rounded-3xl border ${item.color} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className={`h-12 w-12 rounded-2xl ${item.bgColor} flex items-center justify-center text-xl`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Sunday Letter Section */}
      <section className="bg-[#1A1D27] dark:bg-[#12141C] rounded-3xl border border-gray-800/80 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 h-64 w-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Left Form */}
        <div className="space-y-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D15B3D]">
            FREE WEEKLY NEWSLETTER
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight font-serif italic">
            The InkAndInsight <br />
            <span className="text-[#D15B3D] not-italic">Sunday Letter.</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            Every Sunday, one email. My sharpest thinking from the week — trading setups, AI experiments, Oracle tips, career reflections. No filler. No spam. Just insight worth your time.
          </p>
          <NewsletterForm />
          <p className="text-[10px] text-gray-500 font-semibold">
            14,000+ readers · Unsubscribe anytime · No spam ever
          </p>
        </div>
        
        {/* Right Envelope preview */}
        <div className="relative aspect-[4/3] w-full hidden md:block rounded-2xl overflow-hidden bg-gradient-to-br from-[#D15B3D]/10 to-[#3B3FA0]/10 p-8 border border-gray-700/50 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-700/50 pb-4">
            <div className="font-serif italic text-lg font-black text-white">InkAndInsight</div>
            <span className="text-[10px] font-extrabold text-gray-500 uppercase">Sunday Letter</span>
          </div>
          
          <div className="space-y-3 py-6">
            <div className="text-sm font-bold text-white">This week: AI Trading + Oracle Insights</div>
            <div className="h-2 bg-gray-700/50 rounded-full w-full" />
            <div className="h-2 bg-gray-700/50 rounded-full w-5/6" />
            <div className="h-2 bg-gray-700/50 rounded-full w-4/6" />
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-700/50">
            <button className="px-5 py-2.5 bg-[#D15B3D] text-white text-xs font-bold rounded-lg uppercase tracking-wider">
              Subscribe Free &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 6. Latest Stories Section */}
      <section className="py-8 border-t border-gray-100 dark:border-[#2A2D3A]/50">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D15B3D]">FRESH FROM THE BLOG</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">Latest Stories</h2>
          </div>
          <Link href="/blog" className="px-5 py-2 rounded-full text-xs font-bold border border-gray-200 dark:border-[#2A2D3A] text-gray-600 dark:text-gray-400 hover:text-[#D15B3D] hover:border-[#D15B3D] transition-colors cursor-pointer">
            All posts &rarr;
          </Link>
        </div>

        {latestPosts.length <= 1 ? (
          <div className="text-center py-20 text-gray-400 border border-dashed border-gray-200 dark:border-[#2A2D3A] rounded-3xl">
            Check back later for fresh articles!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left Big Card (latestPosts[1]) */}
            {latestPosts[1] && (
              <Link 
                href={`/blog/${latestPosts[1].slug}`} 
                className="group flex flex-col bg-white dark:bg-[#1A1D27] rounded-3xl overflow-hidden border border-gray-200/50 dark:border-[#2A2D3A]/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#D15B3D]/30 transition-all duration-500"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 relative overflow-hidden">
                  {latestPosts[1].coverImage && (
                    <Image
                      src={latestPosts[1].coverImage}
                      alt={latestPosts[1].title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  )}
                </div>
                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D15B3D] dark:text-[#E25C5C] bg-[#D15B3D]/8 dark:bg-[#E25C5C]/8 px-2.5 py-0.5 rounded-full">
                      {latestPosts[1].category?.name}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-[#D15B3D] dark:group-hover:text-[#E25C5C] transition-colors duration-300">
                      {latestPosts[1].title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
                      {latestPosts[1].excerpt || latestPosts[1].content.replace(/<[^>]*>?/gm, '').substring(0, 125) + '...'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-400 font-semibold pt-6 border-t border-gray-100 dark:border-gray-800/80 mt-6">
                    <span>{latestPosts[1].author}</span>
                    <span>·</span>
                    <span>{format(new Date(latestPosts[1].createdAt), 'MMM d, yyyy')}</span>
                    {latestPosts[1].readTime && (
                      <>
                        <span>·</span>
                        <span>{latestPosts[1].readTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {/* Right Stacked Column (latestPosts[2], latestPosts[3], latestPosts[4]) */}
            <div className="flex flex-col gap-6 justify-between">
              {latestPosts.slice(2, 5).map((post) => (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.id} 
                  className="group flex flex-col sm:flex-row bg-white dark:bg-[#1A1D27] rounded-3xl overflow-hidden border border-gray-200/50 dark:border-[#2A2D3A]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#D15B3D]/30 transition-all duration-500 flex-grow"
                >
                  <div className="sm:w-1/3 aspect-video sm:aspect-auto bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 relative overflow-hidden min-h-[120px]">
                    {post.coverImage && (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    )}
                  </div>
                  <div className="p-6 sm:w-2/3 flex flex-col justify-between flex-grow">
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#D15B3D] bg-[#D15B3D]/8 px-2 py-0.5 rounded-full">
                        {post.category?.name}
                      </span>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#D15B3D] transition-colors duration-300 line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold pt-4">
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        )}
      </section>

    </div>
  )
}
