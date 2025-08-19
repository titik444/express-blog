import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // --- Roles are in enum, so no insert needed ---

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@example.com',
      password: '$2b$10$hashedpassword', // ganti dengan bcrypt hash real
      role: 'ADMIN',
      avatarUrl: 'https://i.pravatar.cc/150?img=1'
    }
  })

  // Create Normal User
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@example.com',
      password: '$2b$10$hashedpassword', // bcrypt hash juga
      role: 'USER',
      avatarUrl: 'https://i.pravatar.cc/150?img=2'
    }
  })

  // Create Categories
  const categories = await prisma.$transaction([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: { name: 'Technology', slug: 'technology' }
    }),
    prisma.category.upsert({
      where: { slug: 'lifestyle' },
      update: {},
      create: { name: 'Lifestyle', slug: 'lifestyle' }
    }),
    prisma.category.upsert({
      where: { slug: 'business' },
      update: {},
      create: { name: 'Business', slug: 'business' }
    })
  ])

  // Create Post with relation
  const post = await prisma.post.create({
    data: {
      title: 'Welcome to My Blog',
      slug: 'welcome-to-my-blog',
      content: 'This is the very first post seeded into the blog.',
      featuredImage: 'https://picsum.photos/800/400',
      authorId: admin.id,
      categories: {
        create: [
          { categoryId: categories[0].id }, // Technology
          { categoryId: categories[1].id } // Lifestyle
        ]
      }
    },
    include: { categories: true }
  })

  // Add comment
  await prisma.comment.create({
    data: {
      content: 'This is a seeded comment from John Doe',
      postId: post.id,
      authorId: user.id
    }
  })

  console.log('✅ Seeding finished.')
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
