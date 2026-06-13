import prisma from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"
import Image from "next/image"

export default async function HomePage() {
  const latestPosts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: { category: true }
  })

  return (
    <div>
      <section className="py-20 md:py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Where <span className="font-serif italic text-[#3B3FA0] dark:text-[#4F6DF5]">Ink</span> Meets Market <span className="font-serif italic text-[#3B3FA0] dark:text-[#4F6DF5]">Insight</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Deep dives into finance, AI, quant trading, and career building by Sanju.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/blog" className="px-8 py-3 bg-[#4F6DF5] text-white rounded-full font-medium hover:bg-[#3B3FA0] transition-colors shadow-lg shadow-[#4F6DF5]/30">
            Read Latest Posts
          </Link>
          <Link href="/newsletter" className="px-8 py-3 bg-white dark:bg-[#1A1D27] text-gray-900 dark:text-white border border-gray-200 dark:border-[#2A2D3A] rounded-full font-medium hover:bg-gray-50 dark:hover:bg-[#2A2D3A] transition-colors">
            Subscribe
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Latest Perspectives</h2>
          <Link href="/blog" className="text-[#4F6DF5] hover:text-[#3B3FA0] font-medium transition-colors">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post: any) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white dark:bg-[#1A1D27] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#2A2D3A] shadow-sm hover:shadow-xl hover:border-[#4F6DF5]/50 transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 relative overflow-hidden">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F5A623]">
                    {post.category?.name}
                  </span>
                  <span className="text-gray-400 text-sm">·</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#4F6DF5] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                  {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...'}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        {latestPosts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-[#1A1D27] rounded-2xl border border-dashed border-gray-300 dark:border-[#2A2D3A]">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No posts published yet. Check back later!</p>
          </div>
        )}
      </section>
    </div>
  )
}
