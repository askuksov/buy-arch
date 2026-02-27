'use client'

import { useRouter } from 'next/navigation'
import { useCreatePurchase } from '@/hooks/use-purchases'
import { PurchaseForm } from '@/components/forms/purchase-form'

export const dynamic = 'force-dynamic'

export default function NewPurchasePage() {
  const router = useRouter()
  const createPurchase = useCreatePurchase()

  const handleSubmit = async (data: any) => {
    try {
      await createPurchase.mutateAsync(data)
      router.push('/purchases')
    } catch (error) {
      console.error('Failed to create purchase:', error)
      throw error
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Purchase</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Fill in the details below to add a new purchase to your collection.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <PurchaseForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/purchases')}
          isLoading={createPurchase.isPending}
        />
      </div>
    </div>
  )
}
