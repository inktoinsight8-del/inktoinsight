import prisma from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"
import Image from "next/image"

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: categoryFilter } = await searchParams

  const posts = await prisma.post.findMany({
    where: { 
      status: 'PUBLISHED',
      ...(categoryFilter ? { category: { name: categoryFilter } } : {})
    },
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  })

  const categories = await prisma.category.findMany()

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore the <span className="font-serif italic text-[#3B3FA0] dark:text-[#4F6DF5]">Archive</span></h1>
        
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/blog" 
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95 border ${!categoryFilter ? 'bg-[#4F6DF5] text-white border-transparent shadow-md shadow-indigo-500/20' : 'bg-white dark:bg-[#1A1D27] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2A2D3A] border-gray-200/50 dark:border-[#2A2D3A]/50 shadow-sm'}`}
          >
            All
          </Link>
          {categories.map((c: any) => (
            <Link 
              key={c.id}
              href={`/blog?category=${encodeURIComponent(c.name)}`} 
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95 border ${categoryFilter === c.name ? 'bg-[#4F6DF5] text-white border-transparent shadow-md shadow-indigo-500/20' : 'bg-white dark:bg-[#1A1D27] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2A2D3A] border-gray-200/50 dark:border-[#2A2D3A]/50 shadow-sm'}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {posts.map((post: any) => (
          <Link 
            href={`/blog/${post.slug}`} 
            key={post.id} 
            className="group flex flex-col md:flex-row bg-white dark:bg-[#1A1D27] rounded-2xl overflow-hidden border border-gray-200/50 dark:border-[#2A2D3A]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#4F6DF5]/40 transition-all duration-500"
          >
            <div className="md:w-1/3 aspect-video md:aspect-auto bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 relative overflow-hidden min-h-[160px]">
              {post.coverImage && (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              )}
            </div>
            <div className="p-6 md:w-2/3 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F6DF5] dark:text-[#8E9EFE] bg-[#4F6DF5]/8 dark:bg-[#8E9EFE]/8 px-2.5 py-0.5 rounded-full">
                  {post.category?.name}
                </span>
                <span className="text-gray-300 dark:text-gray-700 text-sm">·</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
                  {format(new Date(post.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[#4F6DF5] transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...'}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found for this category.</p>
        </div>
      )}
    </div>
  )
}
