import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

// Protected PUT: Rename a category
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { name } = await req.json()

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const trimmedName = name.trim()

    // Check if duplicate name exists for another ID
    const duplicate = await prisma.category.findFirst({
      where: {
        name: trimmedName,
        NOT: { id }
      }
    })

    if (duplicate) {
      return NextResponse.json({ error: 'Another category with this name already exists' }, { status: 400 })
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name: trimmedName }
    })

    revalidatePath('/')
    revalidatePath('/blog')

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Failed to update category:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Protected DELETE: Remove a category safely
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify no posts are assigned to this category
    const postsWithCategory = await prisma.post.count({
      where: { categoryId: id }
    })

    if (postsWithCategory > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category: ${postsWithCategory} post(s) are currently assigned to it. Reassign or delete the posts first.` 
      }, { status: 400 })
    }

    await prisma.category.delete({
      where: { id }
    })

    revalidatePath('/')
    revalidatePath('/blog')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete category:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
