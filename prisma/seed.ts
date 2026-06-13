import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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

  // 4. Create First Post
  const postCount = await prisma.post.count()
  if (postCount === 0) {
    const techCategory = await prisma.category.findUnique({
      where: { name: 'Tech & AI' }
    })
    
    if (techCategory) {
      await prisma.post.create({
        data: {
          title: 'Content Overview: What to Expect from Ink&Insight',
          slug: 'content-overview',
          excerpt: 'An introductory roadmap to what we publish at Ink&Insight—exploring the intersection of quantitative finance, AI, and career growth.',
          content: `
            <h2>Welcome to Ink&Insight!</h2>
            <p>This space is dedicated to exploring the intersection of modern finance, market mechanics, and cutting-edge artificial intelligence. Here is a high-level overview of the content we will publish:</p>
            <ul>
              <li><strong>Quantitative Trading & Finance</strong>: Coding trading strategies, backtesting models, and analyzing market microstructure.</li>
              <li><strong>Tech & Artificial Intelligence</strong>: Leveraging LLMs, training custom ML pipelines, and integrating deep learning systems.</li>
              <li><strong>Career & Growth</strong>: Professional advice on breaking into quant, software engineering, and career scaling.</li>
            </ul>
            <p>Stay tuned for our first technical deep dives!</p>
          `,
          coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
          categoryId: techCategory.id,
          status: 'PUBLISHED',
          readTime: '2 min read',
          author: 'Sanju',
          tags: {
            create: [
              { name: 'Introduction' },
              { name: 'Overview' },
              { name: 'Blog' }
            ]
          }
        }
      })
      console.log('First seed post created!')
    }
  }

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
