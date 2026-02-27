'use client'

import { useState, useEffect } from 'react'
import { useTags } from '@/hooks/use-tags'
import { TagChip } from './tag-chip'
import { Check, ChevronDown } from 'lucide-react'

type TagPickerProps = {
  selectedTagIds: string[]
  onChange: (tagIds: string[]) => void
  label?: string
  error?: string
}

export function TagPicker({
  selectedTagIds,
  onChange,
  label = 'Tags',
  error,
}: TagPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: tags, isLoading } = useTags()

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-tag-picker]')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const selectedTags = tags?.filter((tag) => selectedTagIds.includes(tag.id)) || []

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId))
    } else {
      onChange([...selectedTagIds, tagId])
    }
  }

  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTagIds.filter((id) => id !== tagId))
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="text-sm text-gray-500">Loading tags...</div>
      </div>
    )
  }

  return (
    <div className="space-y-2" data-tag-picker>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map((tag) => (
            <TagChip
              key={tag.id}
              name={tag.name}
              color={tag.color}
              onRemove={() => handleRemoveTag(tag.id)}
              size="sm"
            />
          ))}
        </div>
      )}

      {/* Dropdown Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>
            {selectedTags.length === 0
              ? 'Select tags'
              : `${selectedTags.length} tag(s) selected`}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {tags && tags.length > 0 ? (
              <div className="py-1">
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleTag(tag.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color || '#3b82f6' }}
                        />
                        <span className="text-gray-900">{tag.name}</span>
                      </div>
                      {isSelected && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="px-3 py-6 text-center text-sm text-gray-500">
                No tags available. Create tags first.
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
