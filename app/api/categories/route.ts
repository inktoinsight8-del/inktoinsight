import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

// Public GET: Fetch all categories with post counts
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })
    return NextResponse.json(categories)
  } catch (error: any) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Protected POST: Create a new category
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await req.json()
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const trimmedName = name.trim()

    // Check for duplicates
    const existing = await prisma.category.findUnique({
      where: { name: trimmedName }
    })

    if (existing) {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { name: trimmedName }
    })

    revalidatePath('/')
    revalidatePath('/blog')

    return NextResponse.json(category)
  } catch (error: any) {
    console.error('Failed to create category:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
