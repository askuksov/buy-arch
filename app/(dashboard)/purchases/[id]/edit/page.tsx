'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePurchase, useUpdatePurchase } from '@/hooks/use-purchases'
import { PurchaseForm } from '@/components/forms/purchase-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function EditPurchasePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: purchase, isLoading, error } = usePurchase(id)
  const updatePurchase = useUpdatePurchase()

  const handleSubmit = async (data: any) => {
    try {
      await updatePurchase.mutateAsync({ id, data })
      router.push(`/purchases/${id}`)
    } catch (error) {
      console.error('Failed to update purchase:', error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400">Loading purchase...</p>
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          href={`/purchases/${id}`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Purchase
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Purchase</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Update the purchase details below.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <PurchaseForm
          initialData={{
            title: purchase.title,
            description: purchase.description || undefined,
            price: Number(purchase.price),
            currencyCode: purchase.currencyCode,
            purchaseDate: new Date(purchase.purchaseDate).toISOString().split('T')[0],
            marketplaceCode: purchase.marketplaceCode,
            productUrl: purchase.productUrl || undefined,
            categoryId: purchase.category?.id,
            tagIds: purchase.tags.map((t) => t.id),
            images: purchase.images.map((img) => ({
              url: img.url,
              filename: img.url.split('/').pop() || '',
              size: 0,
              mimeType: 'image/jpeg',
              originalName: img.url.split('/').pop() || '',
            })),
          }}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/purchases/${id}`)}
          isLoading={updatePurchase.isPending}
        />
      </div>
    </div>
  )
}
