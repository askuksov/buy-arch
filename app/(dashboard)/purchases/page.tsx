'use client'

import { useState } from 'react'
import { usePurchases, useCreatePurchase, useUpdatePurchase, useDeletePurchase } from '@/hooks/use-purchases'
import { PurchaseForm } from '@/components/forms/purchase-form'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function PurchasesPage() {
  const [page, setPage] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { data, isLoading } = usePurchases({ page, limit: 20 })
  const createPurchase = useCreatePurchase()
  const updatePurchase = useUpdatePurchase()
  const deletePurchase = useDeletePurchase()

  const handleCreate = async (data: any) => {
    try {
      await createPurchase.mutateAsync(data)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create purchase:', error)
      alert(error instanceof Error ? error.message : 'Failed to create purchase')
    }
  }

  const handleUpdate = async (data: any) => {
    if (!editingId) return

    try {
      await updatePurchase.mutateAsync({ id: editingId, data })
      setEditingId(null)
    } catch (error) {
      console.error('Failed to update purchase:', error)
      alert(error instanceof Error ? error.message : 'Failed to update purchase')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      await deletePurchase.mutateAsync(id)
    } catch (error) {
      console.error('Failed to delete purchase:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete purchase')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 dark:text-gray-300">Loading purchases...</p>
      </div>
    )
  }

  const editingPurchase = data?.purchases.find((p) => p.id === editingId)

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Purchases</h1>
        {!showCreateForm && !editingId && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Add Purchase
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Create Purchase
          </h2>
          <PurchaseForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            isLoading={createPurchase.isPending}
          />
        </div>
      )}

      {editingId && editingPurchase && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Edit Purchase
          </h2>
          <PurchaseForm
            initialData={{
              title: editingPurchase.title,
              description: editingPurchase.description || undefined,
              price: Number(editingPurchase.price),
              currencyCode: editingPurchase.currencyCode,
              purchaseDate: editingPurchase.purchaseDate,
              marketplaceCode: editingPurchase.marketplaceCode,
              productUrl: editingPurchase.productUrl || undefined,
              categoryId: editingPurchase.category?.id,
              tagIds: editingPurchase.tags.map((t) => t.id),
              images: editingPurchase.images.map((img) => ({
                url: img.url,
                filename: img.url.split('/').pop() || '',
                size: 0,
                mimeType: 'image/jpeg',
                originalName: img.url.split('/').pop() || '',
              })),
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
            isLoading={updatePurchase.isPending}
          />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Marketplace
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
              {data?.purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {purchase.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {purchase.currency.symbol}{Number(purchase.price).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {purchase.category ? (
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: purchase.category.color || '#3b82f6',
                          color: 'white',
                        }}
                      >
                        {purchase.category.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {purchase.marketplace.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(purchase.id)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        aria-label="Edit purchase"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(purchase.id, purchase.title)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        aria-label="Delete purchase"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.purchases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No purchases yet. Create your first one!</p>
          </div>
        )}
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
            Page {page} of {data.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === data.pagination.totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
