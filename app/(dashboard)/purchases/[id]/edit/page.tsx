'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePurchase, useUpdatePurchase } from '@/hooks/use-purchases'
import { PurchaseForm } from '@/components/forms/purchase-form'
import { PurchaseFormData } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export default function EditPurchasePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: purchase, isLoading, error } = usePurchase(id)
  const updatePurchase = useUpdatePurchase()

  const handleSubmit = async (data: PurchaseFormData) => {
    try {
      const payload = {
        ...data,
        purchaseDate: data.purchaseDate.toISOString(),
        productUrl: data.productUrl || undefined,
        categoryId: data.categoryId || undefined,
      }

      await updatePurchase.mutateAsync({ id, data: payload })
      router.push('/purchases')
    } catch (error) {
      console.error('Failed to update purchase:', error)
      alert(error instanceof Error ? error.message : 'Failed to update purchase')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <p className="text-gray-600 dark:text-gray-400">Loading purchase...</p>
      </div>
    )
  }

  if (error || !purchase) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <p className="text-red-600 dark:text-red-400">Purchase not found</p>
      </div>
    )
  }

  const initialData: Partial<PurchaseFormData> = {
    title: purchase.title,
    description: purchase.description || '',
    price: Number(purchase.price),
    currencyCode: purchase.currencyCode,
    purchaseDate: new Date(purchase.purchaseDate),
    marketplaceCode: purchase.marketplaceCode,
    productUrl: purchase.productUrl || '',
    categoryId: purchase.category?.id || '',
    tagIds: purchase.tags.map((t) => t.id),
    images: purchase.images.map((img) => ({
      id: img.id,
      url: img.url,
      filename: img.filename,
      size: img.size,
      mimeType: img.mimeType,
    })),
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Purchase</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <PurchaseForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={updatePurchase.isPending}
          mode="edit"
        />
      </div>
    </div>
  )
}
