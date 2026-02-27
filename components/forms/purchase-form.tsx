'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { purchaseFormSchema, PurchaseFormData } from '@/lib/validations'
import { useCategories } from '@/hooks/use-categories'
import { TagPicker } from '@/components/ui/tag-picker'
import { ImageUpload } from '@/components/ui/image-upload'
import { CURRENCY_OPTIONS, MARKETPLACE_OPTIONS } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { UploadedImage } from '@/types'

type PurchaseFormProps = {
  initialData?: Partial<PurchaseFormData>
  onSubmit: (data: PurchaseFormData) => Promise<void>
  isLoading?: boolean
  mode: 'create' | 'edit'
}

export function PurchaseForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
}: PurchaseFormProps) {
  const router = useRouter()
  const { data: categories } = useCategories()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price ?? 0,
      currencyCode: initialData?.currencyCode ?? 'USD',
      purchaseDate: initialData?.purchaseDate ?? new Date(),
      marketplaceCode: initialData?.marketplaceCode ?? 'aliexpress',
      productUrl: initialData?.productUrl ?? '',
      categoryId: initialData?.categoryId ?? '',
      tagIds: initialData?.tagIds ?? [],
      images: initialData?.images ?? [],
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Product Title *
        </label>
        <input
          {...register('title')}
          id="title"
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Wireless Bluetooth Headphones"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description (optional)
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="Additional details about the purchase..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Price and Currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Price *
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            id="price"
            type="number"
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="currencyCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Currency *
          </label>
          <select
            {...register('currencyCode')}
            id="currencyCode"
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.currencyCode && (
            <p className="mt-1 text-sm text-red-600">{errors.currencyCode.message}</p>
          )}
        </div>
      </div>

      {/* Purchase Date and Marketplace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Purchase Date *
          </label>
          <Controller
            name="purchaseDate"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                value={
                  field.value instanceof Date
                    ? field.value.toISOString().split('T')[0]
                    : field.value
                }
                onChange={(e) => field.onChange(new Date(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            )}
          />
          {errors.purchaseDate && (
            <p className="mt-1 text-sm text-red-600">{errors.purchaseDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="marketplaceCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Marketplace *
          </label>
          <select
            {...register('marketplaceCode')}
            id="marketplaceCode"
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            {MARKETPLACE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.marketplaceCode && (
            <p className="mt-1 text-sm text-red-600">{errors.marketplaceCode.message}</p>
          )}
        </div>
      </div>

      {/* Product URL */}
      <div>
        <label htmlFor="productUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Product URL (optional)
        </label>
        <input
          {...register('productUrl')}
          id="productUrl"
          type="url"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="https://example.com/product"
        />
        {errors.productUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.productUrl.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category (optional)
        </label>
        <select
          {...register('categoryId')}
          id="categoryId"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="">No category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <Controller
          name="tagIds"
          control={control}
          render={({ field }) => (
            <TagPicker
              selectedTagIds={field.value}
              onChange={field.onChange}
              label="Tags (optional)"
              error={errors.tagIds?.message}
            />
          )}
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Images (optional)
        </label>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUpload
              images={field.value as UploadedImage[]}
              onImagesChange={field.onChange}
            />
          )}
        />
        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? 'Saving...'
            : mode === 'create'
            ? 'Create Purchase'
            : 'Update Purchase'}
        </button>
      </div>
    </form>
  )
}
