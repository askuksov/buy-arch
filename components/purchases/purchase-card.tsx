'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency, formatDate, getMarketplaceLabel } from '@/lib/utils'
import { Eye, Pencil, Trash2 } from 'lucide-react'

type PurchaseCardProps = {
  purchase: {
    id: string
    title: string
    price: number
    currencyCode: string
    currency: {
      code: string
      symbol: string
    }
    purchaseDate: Date | string
    marketplaceCode: string
    marketplace: {
      code: string
      name: string
      color: string | null
    }
    category?: {
      id: string
      name: string
      color: string | null
    } | null
    tags: Array<{
      id: string
      name: string
      color: string | null
    }>
    images: Array<{
      id: string
      url: string
    }>
  }
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function PurchaseCard({ purchase, onDelete, onView }: PurchaseCardProps) {
  const firstImage = purchase.images[0]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={purchase.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            No image
          </div>
        )}
        {purchase.images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            +{purchase.images.length - 1}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[56px]">
          {purchase.title}
        </h3>

        <div className="flex flex-col gap-1 mb-3">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(purchase.price, purchase.currency.code)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {getMarketplaceLabel(purchase.marketplace.code)} · {formatDate(purchase.purchaseDate)}
          </span>
        </div>

        <div className="space-y-2 mb-4 flex-grow">
          {purchase.category && (
            <div>
              <div
                className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: purchase.category.color || '#3b82f6' }}
              >
                {purchase.category.name}
              </div>
            </div>
          )}

          {purchase.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {purchase.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-block px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color || '#666',
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 mt-auto border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onView?.(purchase.id)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded transition-colors"
            title="View details"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">View</span>
          </button>
          <Link
            href={`/purchases/${purchase.id}/edit`}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600/30 rounded transition-colors"
            title="Edit purchase"
          >
            <Pencil size={14} />
            <span className="hidden sm:inline">Edit</span>
          </Link>
          <button
            onClick={() => onDelete?.(purchase.id)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/20 rounded transition-colors"
            title="Delete purchase"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
