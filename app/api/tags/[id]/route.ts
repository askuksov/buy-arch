import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
})

// GET /api/tags/[id] - Get single tag
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

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { purchases: true },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error fetching tag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/tags/[id] - Update tag
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
    const validatedData = tagSchema.parse(body)

    // Check if tag exists
    const existing = await prisma.tag.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    // Check for duplicate name (excluding current tag)
    const duplicate = await prisma.tag.findFirst({
      where: {
        name: validatedData.name,
        id: { not: id },
      },
    })

    if (duplicate) {
      return NextResponse.json(
        { error: 'Tag with this name already exists' },
        { status: 400 }
      )
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(tag)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating tag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/tags/[id] - Delete tag
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

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { purchases: true },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    await prisma.tag.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
