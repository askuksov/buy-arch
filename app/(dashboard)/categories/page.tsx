'use client'

import { useState } from 'react'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/use-categories'
import { CategoryForm } from '@/components/forms/category-form'
import { CategoryFormInput } from '@/types'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function CategoriesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: categories, isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const handleCreate = async (data: CategoryFormInput) => {
    try {
      await createCategory.mutateAsync(data)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create category:', error)
      alert(error instanceof Error ? error.message : 'Failed to create category')
    }
  }

  const handleUpdate = async (data: CategoryFormInput) => {
    if (!editingId) return

    try {
      await updateCategory.mutateAsync({ id: editingId, data })
      setEditingId(null)
    } catch (error) {
      console.error('Failed to update category:', error)
      alert(error instanceof Error ? error.message : 'Failed to update category')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      await deleteCategory.mutateAsync(id)
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete category')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 dark:text-gray-300">Loading categories...</p>
      </div>
    )
  }

  const editingCategory = categories?.find((c) => c.id === editingId)

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
        {!showCreateForm && !editingId && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Add Category
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create Category</h2>
          <CategoryForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            isLoading={createCategory.isPending}
          />
        </div>
      )}

      {editingId && editingCategory && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Category</h2>
          <CategoryForm
            initialData={{
              name: editingCategory.name,
              color: editingCategory.color || undefined,
              icon: editingCategory.icon || undefined,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
            isLoading={updateCategory.isPending}
          />
        </div>
      )}

      <div className="grid gap-4">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: category.color || '#3b82f6' }}
              >
                {category.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category._count.purchases} purchase(s)
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingId(category.id)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                aria-label="Edit category"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(category.id, category.name)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                aria-label="Delete category"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {categories?.length === 0 && !showCreateForm && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-400">No categories yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  )
}
