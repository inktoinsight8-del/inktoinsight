import prisma from "@/lib/prisma"

import { notFound } from "next/navigation"
import { format } from "date-fns"
import ReadingProgress from "@/components/ReadingProgress"
import PostActions from "@/components/PostActions"
import Image from "next/image"
import ViewTracker from "@/components/ViewTracker"

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let decodedSlug = slug
  try {
    decodedSlug = decodeURIComponent(slug)
  } catch (e) {}

  let post = await prisma.post.findUnique({
    where: { slug: decodedSlug },
    include: { category: true, tags: true }
  })

  if (!post) {
    post = await prisma.post.findUnique({
      where: { slug },
      include: { category: true, tags: true }
    })
  }

  if (!post) {
    post = await prisma.post.findUnique({
      where: { slug: encodeURIComponent(decodedSlug) },
      include: { category: true, tags: true }
    })
  }

  if (!post || post.status !== 'PUBLISHED') {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-500">We could not find a published post at this URL.</p>
        <a href="/blog" className="inline-block mt-6 text-[#4F6DF5] font-semibold hover:underline">&larr; Back to all posts</a>
      </div>
    )
  }


  return (
    <>
      <ViewTracker postId={post.id} />
      <ReadingProgress />
      <article className="max-w-3xl mx-auto relative pb-20">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#4F6DF5] dark:text-[#8E9EFE] bg-[#4F6DF5]/8 dark:bg-[#8E9EFE]/8 px-3.5 py-1 rounded-full">
              {post.category?.name}
            </span>
            <span className="text-gray-300 dark:text-gray-700 text-sm">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight text-gray-900 dark:text-white">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>By <strong className="text-gray-950 dark:text-white font-bold">{post.author}</strong></span>
          </div>
        </header>

        <div className="w-full aspect-[21/9] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl mb-12 relative overflow-hidden shadow-sm">
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          )}
        </div>

        <div
          className="prose dark:prose-invert max-w-none prose-lg md:prose-xl prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#4F6DF5] dark:prose-a:text-[#8E9EFE] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-[#4F6DF5] dark:prose-blockquote:border-[#8E9EFE] prose-blockquote:italic prose-blockquote:font-serif prose-img:rounded-2xl"
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
