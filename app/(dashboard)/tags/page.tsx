'use client'

import { useState } from 'react'
import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from '@/hooks/use-tags'
import { TagForm } from '@/components/forms/tag-form'
import { TagFormInput } from '@/types'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function TagsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: tags, isLoading } = useTags()
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()

  const handleCreate = async (data: TagFormInput) => {
    try {
      await createTag.mutateAsync(data)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create tag:', error)
      alert(error instanceof Error ? error.message : 'Failed to create tag')
    }
  }

  const handleUpdate = async (data: TagFormInput) => {
    if (!editingId) return

    try {
      await updateTag.mutateAsync({ id: editingId, data })
      setEditingId(null)
    } catch (error) {
      console.error('Failed to update tag:', error)
      alert(error instanceof Error ? error.message : 'Failed to update tag')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      await deleteTag.mutateAsync(id)
    } catch (error) {
      console.error('Failed to delete tag:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete tag')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 dark:text-gray-300">Loading tags...</p>
      </div>
    )
  }

  const editingTag = tags?.find((t) => t.id === editingId)

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tags</h1>
        {!showCreateForm && !editingId && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Add Tag
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create Tag</h2>
          <TagForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            isLoading={createTag.isPending}
          />
        </div>
      )}

      {editingId && editingTag && (
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Tag</h2>
          <TagForm
            initialData={{
              name: editingTag.name,
              color: editingTag.color || undefined,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
            isLoading={updateTag.isPending}
          />
        </div>
      )}

      <div className="grid gap-4">
        {tags?.map((tag) => (
          <div
            key={tag.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className="px-4 py-2 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: tag.color || '#3b82f6' }}
              >
                {tag.name}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tag._count.purchases} purchase(s)
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingId(tag.id)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                aria-label="Edit tag"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(tag.id, tag.name)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                aria-label="Delete tag"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {tags?.length === 0 && !showCreateForm && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-400">No tags yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  )
}
