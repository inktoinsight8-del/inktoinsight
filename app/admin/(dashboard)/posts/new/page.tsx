import prisma from "@/lib/prisma"
import PostEditorForm from "@/components/PostEditorForm"

export default async function NewPostPage() {
  const categories = await prisma.category.findMany()

  return (
    <div>
      <PostEditorForm categories={categories} />
    </div>
  )
}
