import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { deleteImage, getFilenameFromUrl } from '@/lib/upload'

const purchaseUpdateSchema = z.object({
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
        id: z.string().optional(), // Existing image
        url: z.string(),
        filename: z.string(),
        size: z.number(),
        mimeType: z.string(),
      })
    )
    .optional()
    .default([]),
})

// GET /api/purchases/[id] - Get single purchase
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        currency: true,
        marketplace: true,
        category: true,
        tags: true,
        images: true,
      },
    })

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(purchase)
  } catch (error) {
    console.error('Error fetching purchase:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/purchases/[id] - Update purchase
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = purchaseUpdateSchema.parse(body)

    // Check if purchase exists
    const existing = await prisma.purchase.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      )
    }

    // Handle image updates
    const existingImageIds = existing.images.map((img) => img.id)
    const newImageIds = validatedData.images
      .filter((img) => img.id)
      .map((img) => img.id!)
    const imagesToDelete = existingImageIds.filter(
      (id) => !newImageIds.includes(id)
    )
    const imagesToCreate = validatedData.images.filter((img) => !img.id)

    // Delete removed images from database and disk
    for (const imageId of imagesToDelete) {
      const image = existing.images.find((img) => img.id === imageId)
      if (image) {
        await deleteImage(getFilenameFromUrl(image.url))
      }
    }

    // Update purchase
    const purchase = await prisma.purchase.update({
      where: { id },
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
          set: validatedData.tagIds.map((id) => ({ id })),
        },
        images: {
          deleteMany: { id: { in: imagesToDelete } },
          create: imagesToCreate.map((img) => ({
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

    return NextResponse.json(purchase)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating purchase:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/purchases/[id] - Delete purchase
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: { images: true },
    })

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      )
    }

    // Delete all associated images from disk
    for (const image of purchase.images) {
      await deleteImage(getFilenameFromUrl(image.url))
    }

    // Delete purchase (cascade will handle images in DB)
    await prisma.purchase.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Purchase deleted successfully' })
  } catch (error) {
    console.error('Error deleting purchase:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
