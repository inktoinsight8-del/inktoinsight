import prisma from "@/lib/prisma"
import PostEditorForm from "@/components/PostEditorForm"
import { notFound } from "next/navigation"

export default async function EditPostPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true
    }
  })

  if (!post) {
    notFound()
  }

  const categories = await prisma.category.findMany()

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      <PostEditorForm categories={categories} initialPost={post} />
    </div>
  )
}
