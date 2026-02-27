'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePurchase } from '@/hooks/use-purchases'
import { formatCurrency, formatDate, getMarketplaceLabel } from '@/lib/utils'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function PurchaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: purchase, isLoading, error } = usePurchase(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">Loading purchase details...</p>
      </div>
    )
  }

  if (error || !purchase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load purchase</p>
          <Link
            href="/purchases"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Back to Purchases
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/purchases"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft size={20} />
          Back to Purchases
        </Link>

        <div className="flex gap-2">
          <Link
            href={`/purchases/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Pencil size={18} />
            Edit
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Images */}
        {purchase.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-gray-900">
            {purchase.images.map((image) => (
              <div key={image.id} className="relative h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  alt={purchase.title}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Details */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{purchase.title}</h1>

          {purchase.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">{purchase.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Price</label>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(Number(purchase.price), purchase.currency.code)}
              </p>
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Purchase Date
              </label>
              <p className="text-lg text-gray-900 dark:text-white">{formatDate(purchase.purchaseDate)}</p>
            </div>

            {/* Marketplace */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Marketplace
              </label>
              <p className="text-lg text-gray-900 dark:text-white">
                {getMarketplaceLabel(purchase.marketplace.code)}
              </p>
            </div>

            {/* Category */}
            {purchase.category && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Category
                </label>
                <div
                  className="inline-block px-3 py-1 rounded text-sm font-medium text-white"
                  style={{ backgroundColor: purchase.category.color || '#3b82f6' }}
                >
                  {purchase.category.name}
                </div>
              </div>
            )}

            {/* Product URL */}
            {purchase.productUrl && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Product URL
                </label>
                <a
                  href={purchase.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline break-all"
                >
                  {purchase.productUrl}
                </a>
              </div>
            )}

            {/* Tags */}
            {purchase.tags.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {purchase.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color || '#666',
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
