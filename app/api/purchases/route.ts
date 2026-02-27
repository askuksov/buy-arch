import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const purchaseCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  price: z.number().positive('Price must be positive'),
  currencyCode: z.enum(['USD', 'EUR', 'UAH']),
  purchaseDate: z.string().datetime(),
  marketplaceCode: z.enum(['aliexpress', 'temu', 'olx', 'rozetka']),
  productUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  categoryId: z.string().uuid().optional().or(z.literal('')),
  tagIds: z.array(z.string().uuid()).optional().default([]),
  images: z
    .array(
      z.object({
        url: z.string(),
        filename: z.string(),
        size: z.number(),
        mimeType: z.string(),
      })
    )
    .optional()
    .default([]),
})

// GET /api/purchases - List all purchases with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Filters
    const search = searchParams.get('search')
    const categoryId = searchParams.get('categoryId')
    const marketplaceCode = searchParams.get('marketplaceCode')
    const tagIds = searchParams.get('tagIds')?.split(',').filter(Boolean)

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (marketplaceCode) {
      where.marketplaceCode = marketplaceCode
    }

    if (tagIds && tagIds.length > 0) {
      where.tags = {
        some: {
          id: { in: tagIds },
        },
      }
    }

    // Execute query
    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          currency: {
            select: {
              code: true,
              symbol: true,
            },
          },
          marketplace: {
            select: {
              code: true,
              name: true,
              color: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
            },
            take: 1, // Only first image for list view
          },
        },
      }),
      prisma.purchase.count({ where }),
    ])

    return NextResponse.json({
      purchases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/purchases - Create new purchase
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = purchaseCreateSchema.parse(body)

    // Create purchase with relations
    const purchase = await prisma.purchase.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        currencyCode: validatedData.currencyCode,
        purchaseDate: new Date(validatedData.purchaseDate),
        marketplaceCode: validatedData.marketplaceCode,
        productUrl: validatedData.productUrl || null,
        categoryId: validatedData.categoryId || null,
        tags: {
          connect: validatedData.tagIds.map((id) => ({ id })),
        },
        images: {
          create: validatedData.images.map((img) => ({
            url: img.url,
            filename: img.filename,
            size: img.size,
            mimeType: img.mimeType,
          })),
        },
      },
      include: {
        currency: true,
        marketplace: true,
        category: true,
        tags: true,
        images: true,
      },
    })

    return NextResponse.json(purchase, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating purchase:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
