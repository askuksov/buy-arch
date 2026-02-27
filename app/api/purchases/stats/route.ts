import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total count
    const totalPurchases = await prisma.purchase.count()

    // Get total spent by currency
    const purchases = await prisma.purchase.findMany({
      select: {
        price: true,
        currencyCode: true,
      },
    })

    const totalByCurrency: Record<string, number> = {
      USD: 0,
      EUR: 0,
      UAH: 0,
    }

    purchases.forEach((p) => {
      totalByCurrency[p.currencyCode] += Number(p.price)
    })

    // Get recent purchases
    const recentPurchases = await prisma.purchase.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
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
        images: {
          select: {
            id: true,
            url: true,
          },
          take: 1,
        },
      },
    })

    // Get purchases by marketplace
    const byMarketplace = await prisma.purchase.groupBy({
      by: ['marketplaceCode'],
      _count: true,
    })

    return NextResponse.json({
      totalPurchases,
      totalByCurrency,
      recentPurchases,
      byMarketplace: byMarketplace.map((item) => ({
        marketplaceCode: item.marketplaceCode,
        count: item._count,
      })),
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
