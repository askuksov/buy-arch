// Application constants
export const APP_NAME = 'Personal Purchase Organizer'
export const MAX_FILE_SIZE = 5242880 // 5MB in bytes
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Sort options for purchase lists
export const SORT_OPTIONS = [
  { value: 'date', label: 'Purchase Date' },
  { value: 'price', label: 'Price' },
  { value: 'createdAt', label: 'Date Added' },
] as const

// Default color palette for categories
export const DEFAULT_CATEGORY_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
] as const

// Default color palette for tags
export const DEFAULT_TAG_COLORS = [
  '#ef4444', // red
  '#22c55e', // green
  '#3b82f6', // blue
  '#eab308', // yellow
  '#8b5cf6', // purple
  '#06b6d4', // cyan
] as const
