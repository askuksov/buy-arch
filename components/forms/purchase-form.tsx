'use client'

import { useState } from 'react'
import { useCategories } from '@/hooks/use-categories'
import { ImageUpload } from '@/components/ui/image-upload'
import { TagPicker } from '@/components/ui/tag-picker'
import { UploadedImage } from '@/types'

interface PurchaseFormProps {
  initialData?: {
    title: string
    description?: string
    price: number
    currencyCode: string
    purchaseDate: string
    marketplaceCode: string
    productUrl?: string
    categoryId?: string
    tagIds: string[]
    images: any[]
  }
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function PurchaseForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: PurchaseFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [price, setPrice] = useState(initialData?.price?.toString() || '')
  const [currencyCode, setCurrencyCode] = useState(initialData?.currencyCode || 'USD')
  const [purchaseDate, setPurchaseDate] = useState(
    initialData?.purchaseDate
      ? new Date(initialData.purchaseDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  )
  const [marketplaceCode, setMarketplaceCode] = useState(
    initialData?.marketplaceCode || 'aliexpress'
  )
  const [productUrl, setProductUrl] = useState(initialData?.productUrl || '')
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [tagIds, setTagIds] = useState<string[]>(initialData?.tagIds || [])
  const [images, setImages] = useState<UploadedImage[]>(initialData?.images || [])

  const { data: categories } = useCategories()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !price) {
      alert('Please fill in all required fields')
      return
    }

    const priceNumber = parseFloat(price)
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert('Please enter a valid price')
      return
    }

    const purchaseDateISO = new Date(purchaseDate).toISOString()

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      price: priceNumber,
      currencyCode,
      purchaseDate: purchaseDateISO,
      marketplaceCode,
      productUrl: productUrl.trim() || undefined,
      categoryId: categoryId || undefined,
      tagIds,
      images: images.map((img) => ({
        url: img.url,
        filename: img.filename,
        size: img.size,
        mimeType: img.mimeType,
      })),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          required
          maxLength={200}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          rows={3}
          maxLength={2000}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Currency *
          </label>
          <select
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="UAH">UAH (₴)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Purchase Date *
          </label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Marketplace *
          </label>
          <select
            value={marketplaceCode}
            onChange={(e) => setMarketplaceCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="aliexpress">AliExpress</option>
            <option value="temu">Temu</option>
            <option value="olx">OLX</option>
            <option value="rozetka">Rozetka</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Product URL
        </label>
        <input
          type="url"
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <TagPicker
        selectedTagIds={tagIds}
        onChange={setTagIds}
        label="Tags"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Images
        </label>
        <ImageUpload images={images} onImagesChange={setImages} />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
