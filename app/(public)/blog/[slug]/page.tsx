import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import ReadingProgress from "@/components/ReadingProgress"
import PostActions from "@/components/PostActions"

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true, tags: true }
  })

  if (!post || post.status !== 'PUBLISHED') {
    notFound()
  }

  // Increment views
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  })

  return (
    <>
      <ReadingProgress />
      <article className="max-w-3xl mx-auto relative pb-20">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-[#F5A623]">
              {post.category?.name}
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>By <strong className="text-gray-900 dark:text-white">{post.author}</strong></span>
          </div>
        </header>

        <div className="w-full aspect-[21/9] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl mb-12 relative overflow-hidden">
        </div>

        <div 
          className="prose dark:prose-invert max-w-none prose-lg md:prose-xl prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#4F6DF5] prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-[#2A2D3A]">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: any) => (
              <span key={tag.id} className="px-3 py-1 bg-gray-100 dark:bg-[#2A2D3A] text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </article>

      <PostActions postId={post.id} slug={post.slug} initialLikes={post.likes} />
    </>
  )
}
