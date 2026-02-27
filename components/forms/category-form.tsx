'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CategoryFormInput } from '@/types'
import { DEFAULT_CATEGORY_COLORS } from '@/lib/constants'

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color').optional(),
  icon: z.string().optional(),
})

type CategoryFormProps = {
  initialData?: Partial<CategoryFormInput>
  onSubmit: (data: CategoryFormInput) => void
  onCancel: () => void
  isLoading?: boolean
}

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      color: initialData?.color || DEFAULT_CATEGORY_COLORS[0],
      icon: initialData?.icon || '',
    },
  })

  const selectedColor = watch('color')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Category Name *
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Electronics, Clothing, Home & Garden"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {DEFAULT_CATEGORY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                selectedColor === color
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
        <input
          {...register('color')}
          type="text"
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="#3b82f6"
        />
        {errors.color && (
          <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
          Icon Name (optional)
        </label>
        <input
          {...register('icon')}
          id="icon"
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Laptop, Shirt, Home"
        />
        <p className="mt-1 text-xs text-gray-500">
          Icon names from lucide-react (e.g., Laptop, Shirt, Home)
        </p>
        {errors.icon && (
          <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
