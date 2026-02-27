'use client'

import { useState } from 'react'
import { usePurchases, useDeletePurchase } from '@/hooks/use-purchases'
import { PurchaseCard } from '@/components/purchases/purchase-card'
import { Pagination } from '@/components/ui/pagination'
import { Plus, Grid, List, Eye, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency, formatDate, getMarketplaceLabel } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default function PurchasesPage() {
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data, isLoading, error } = usePurchases({ page, limit: 12 })
  const deletePurchase = useDeletePurchase()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this purchase?')) return

    try {
      await deletePurchase.mutateAsync(id)
    } catch (error) {
      console.error('Failed to delete purchase:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete purchase')
    }
  }

  const handleView = (id: string) => {
    window.location.href = `/purchases/${id}`
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load purchases</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Purchases</h1>
          {data && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {data.pagination.total} total purchase(s)
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {/* View Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List size={20} />
            </button>
          </div>

          <Link
            href="/purchases/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Purchase
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Loading purchases...</p>
        </div>
      )}

      {/* Empty State */}
      {data && data.purchases.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No purchases yet. Start adding your first purchase!
          </p>
          <Link
            href="/purchases/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={20} />
            Add First Purchase
          </Link>
        </div>
      )}

      {/* Purchases Grid/List */}
      {data && data.purchases.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.purchases.map((purchase) => (
                <PurchaseCard
                  key={purchase.id}
                  purchase={purchase}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Purchase
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.purchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
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
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {purchase.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {getMarketplaceLabel(purchase.marketplace.code)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(Number(purchase.price), purchase.currency.code)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {purchase.category ? (
                            <span
                              className="px-2 py-1 text-xs font-medium rounded text-white"
                              style={{ backgroundColor: purchase.category.color || '#3b82f6' }}
                            >
                              {purchase.category.name}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(purchase.purchaseDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleView(purchase.id)}
                              className="p-2 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded transition-colors"
                              title="View details"
                            >
                              <Eye size={16} />
                            </button>
                            <Link
                              href={`/purchases/${purchase.id}/edit`}
                              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600/30 rounded transition-colors"
                              title="Edit purchase"
                            >
                              <Pencil size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(purchase.id)}
                              className="p-2 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/20 rounded transition-colors"
                              title="Delete purchase"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
