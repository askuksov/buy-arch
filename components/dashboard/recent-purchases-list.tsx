import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency, formatDate, getMarketplaceLabel } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface Purchase {
  id: string
  title: string
  price: number
  purchaseDate: string
  currency: {
    code: string
    symbol: string
  }
  marketplace: {
    code: string
    name: string
    color: string | null
  }
  category: {
    id: string
    name: string
    color: string | null
  } | null
  images: {
    id: string
    url: string
  }[]
}

interface RecentPurchasesListProps {
  purchases: Purchase[]
}

export function RecentPurchasesList({ purchases }: RecentPurchasesListProps) {
  if (!purchases || purchases.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Purchases
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No purchases yet. Start adding your first purchase!
        </p>
        <div className="text-center">
          <Link
            href="/purchases/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add First Purchase
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Purchases
        </h2>
        <Link
          href="/purchases"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {purchases.map((purchase) => (
          <Link
            key={purchase.id}
            href={`/purchases/${purchase.id}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {purchase.images[0] ? (
              <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                <Image
                  src={purchase.images[0].url}
                  alt={purchase.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                No img
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {purchase.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {getMarketplaceLabel(purchase.marketplace.code)}
                </span>
                {purchase.category && (
                  <>
                    <span className="text-xs text-gray-400">•</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: purchase.category.color || '#3b82f6' }}
                    >
                      {purchase.category.name}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(purchase.price, purchase.currency.code)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(purchase.purchaseDate)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
