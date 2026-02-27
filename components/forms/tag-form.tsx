'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TagFormInput } from '@/types'
import { DEFAULT_TAG_COLORS } from '@/lib/constants'

const tagFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color').optional(),
})

type TagFormProps = {
  initialData?: Partial<TagFormInput>
  onSubmit: (data: TagFormInput) => void
  onCancel: () => void
  isLoading?: boolean
}

export function TagForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: TagFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TagFormInput>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      color: initialData?.color || DEFAULT_TAG_COLORS[0],
    },
  })

  const selectedColor = watch('color')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tag Name *
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Urgent, Gift, Favorite"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tag Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {DEFAULT_TAG_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                selectedColor === color
                  ? 'border-gray-900 dark:border-white scale-110'
                  : 'border-gray-300 dark:border-gray-600 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
        <input
          {...register('color')}
          type="text"
          className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="#ef4444"
        />
        {errors.color && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.color.message}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
