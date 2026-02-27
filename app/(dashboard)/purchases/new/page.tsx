'use client'

import { useRouter } from 'next/navigation'
import { useCreatePurchase } from '@/hooks/use-purchases'
import { PurchaseForm } from '@/components/forms/purchase-form'
import { PurchaseFormData } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export default function NewPurchasePage() {
  const router = useRouter()
  const createPurchase = useCreatePurchase()

  const handleSubmit = async (data: PurchaseFormData) => {
    try {
      const payload = {
        ...data,
        purchaseDate: data.purchaseDate.toISOString(),
        productUrl: data.productUrl || undefined,
        categoryId: data.categoryId || undefined,
      }

      await createPurchase.mutateAsync(payload)
      router.push('/purchases')
    } catch (error) {
      console.error('Failed to create purchase:', error)
      alert(error instanceof Error ? error.message : 'Failed to create purchase')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Add New Purchase</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <PurchaseForm
          onSubmit={handleSubmit}
          isLoading={createPurchase.isPending}
          mode="create"
        />
      </div>
    </div>
  )
}
