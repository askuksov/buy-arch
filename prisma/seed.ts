import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
})

async function main() {
  console.log('Start seeding...')

  // Seed currencies
  const currencies = await Promise.all([
    prisma.currency.create({
      data: { code: 'USD', name: 'US Dollar', symbol: '$', sortOrder: 1 },
    }),
    prisma.currency.create({
      data: { code: 'EUR', name: 'Euro', symbol: '€', sortOrder: 2 },
    }),
    prisma.currency.create({
      data: { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', sortOrder: 3 },
    }),
  ])
  console.log(`Created ${currencies.length} currencies`)

  // Seed marketplaces
  const marketplaces = await Promise.all([
    prisma.marketplace.create({
      data: {
        code: 'aliexpress',
        name: 'AliExpress',
        color: '#FF6A00',
        url: 'https://aliexpress.com',
        sortOrder: 1,
      },
    }),
    prisma.marketplace.create({
      data: {
        code: 'temu',
        name: 'Temu',
        color: '#FF6F61',
        url: 'https://temu.com',
        sortOrder: 2,
      },
    }),
    prisma.marketplace.create({
      data: {
        code: 'olx',
        name: 'OLX',
        color: '#002F34',
        url: 'https://olx.ua',
        sortOrder: 3,
      },
    }),
    prisma.marketplace.create({
      data: {
        code: 'rozetka',
        name: 'Rozetka',
        color: '#00A046',
        url: 'https://rozetka.com.ua',
        sortOrder: 4,
      },
    }),
  ])
  console.log(`Created ${marketplaces.length} marketplaces`)

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  })
  console.log(`Created user: ${user.email}`)

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Electronics', color: '#3b82f6', icon: 'Laptop', sortOrder: 1 },
    }),
    prisma.category.create({
      data: { name: 'Clothing', color: '#8b5cf6', icon: 'Shirt', sortOrder: 2 },
    }),
    prisma.category.create({
      data: { name: 'Home & Garden', color: '#10b981', icon: 'Home', sortOrder: 3 },
    }),
    prisma.category.create({
      data: { name: 'Toys & Hobbies', color: '#f59e0b', icon: 'Gamepad2', sortOrder: 4 },
    }),
  ])
  console.log(`Created ${categories.length} categories`)

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Gift', color: '#ef4444' } }),
    prisma.tag.create({ data: { name: 'Sale', color: '#22c55e' } }),
    prisma.tag.create({ data: { name: 'Warranty', color: '#3b82f6' } }),
    prisma.tag.create({ data: { name: 'Favorite', color: '#eab308' } }),
  ])
  console.log(`Created ${tags.length} tags`)

  // Create sample purchases
  const purchase1 = await prisma.purchase.create({
    data: {
      title: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with USB receiver',
      price: 25.99,
      currencyCode: 'USD',
      purchaseDate: new Date('2024-01-15'),
      marketplaceCode: 'aliexpress',
      productUrl: 'https://aliexpress.com/item/example',
      categoryId: categories[0].id,
      tags: {
        connect: [{ id: tags[0].id }, { id: tags[3].id }],
      },
    },
  })
  console.log(`Created purchase: ${purchase1.title}`)

  const purchase2 = await prisma.purchase.create({
    data: {
      title: 'Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt, size M',
      price: 450,
      currencyCode: 'UAH',
      purchaseDate: new Date('2024-02-20'),
      marketplaceCode: 'rozetka',
      categoryId: categories[1].id,
      tags: {
        connect: [{ id: tags[1].id }],
      },
    },
  })
  console.log(`Created purchase: ${purchase2.title}`)

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
