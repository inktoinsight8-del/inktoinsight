import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient({})

async function main() {
  console.log('Seeding database...')

  // 1. Create Categories
  const categories = ['Finance', 'Tech & AI', 'Culture', 'Personal', 'Leadership', 'Product']
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  // 2. Create Admin User
  const password = await bcrypt.hash('password123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@inkandinsight.in' },
    update: {},
    create: {
      email: 'admin@inkandinsight.in',
      name: 'Sanju',
      password,
      bio: 'Author & Founder of Ink&Insight',
    },
  })

  // 3. Create initial Settings
  await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      blogName: 'Ink&Insight',
      tagline: 'Where Ink Meets Market Insight',
      postsPerPage: 6,
    },
  })

  console.log('Database seeded!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
