import prisma from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"

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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!categoryFilter ? 'bg-[#4F6DF5] text-white' : 'bg-white dark:bg-[#1A1D27] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2D3A] border border-gray-200 dark:border-[#2A2D3A]'}`}
          >
            All
          </Link>
          {categories.map((c: any) => (
            <Link 
              key={c.id}
              href={`/blog?category=${encodeURIComponent(c.name)}`} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === c.name ? 'bg-[#4F6DF5] text-white' : 'bg-white dark:bg-[#1A1D27] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2D3A] border border-gray-200 dark:border-[#2A2D3A]'}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {posts.map((post: any) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col md:flex-row bg-white dark:bg-[#1A1D27] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#2A2D3A] shadow-sm hover:shadow-xl hover:border-[#4F6DF5]/50 transition-all duration-300">
            <div className="md:w-1/3 aspect-video md:aspect-auto bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 relative">
            </div>
            <div className="p-6 md:w-2/3 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
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
