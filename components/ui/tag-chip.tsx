'use client'

import { X } from 'lucide-react'

type TagChipProps = {
  name: string
  color?: string | null
  onRemove?: () => void
  size?: 'sm' | 'md'
}

export function TagChip({ name, color, onRemove, size = 'md' }: TagChipProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full text-white font-medium ${sizeClasses[size]}`}
      style={{ backgroundColor: color || '#3b82f6' }}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${name} tag`}
        >
          <X size={size === 'sm' ? 12 : 14} />
        </button>
      )}
    </span>
  )
}
