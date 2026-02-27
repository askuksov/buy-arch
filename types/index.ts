import { Prisma } from '@prisma/client'

// String literal types for currencies and marketplaces
export type CurrencyCode = 'USD' | 'EUR' | 'UAH'
export type MarketplaceCode = 'aliexpress' | 'temu' | 'olx' | 'rozetka'

// Purchase with all relations
export type PurchaseWithRelations = Prisma.PurchaseGetPayload<{
  include: {
    currency: true
    marketplace: true
    category: true
    tags: true
    images: true
  }
}>

// Purchase for list view (without description)
export type PurchaseListItem = Prisma.PurchaseGetPayload<{
  select: {
    id: true
    title: true
    price: true
    currencyCode: true
    currency: {
      select: {
        code: true
        symbol: true
      }
    }
    purchaseDate: true
    marketplaceCode: true
    marketplace: {
      select: {
        code: true
        name: true
        color: true
      }
    }
    category: {
      select: {
        id: true
        name: true
        color: true
      }
    }
    tags: {
      select: {
        id: true
        name: true
        color: true
      }
    }
    images: {
      select: {
        id: true
        url: true
      }
      take: 1
    }
    createdAt: true
  }
}>

// Form input types
export type PurchaseFormInput = {
  title: string
  description?: string
  price: number
  currencyCode: CurrencyCode
  purchaseDate: Date
  marketplaceCode: MarketplaceCode
  productUrl?: string
  categoryId?: string
  tagIds: string[]
}

export type CategoryFormInput = {
  name: string
  color?: string
  icon?: string
}

export type TagFormInput = {
  name: string
  color?: string
}

// Filter types
export type PurchaseFilters = {
  search?: string
  categoryId?: string
  tagIds?: string[]
  marketplaceCode?: MarketplaceCode
  minPrice?: number
  maxPrice?: number
  startDate?: Date
  endDate?: Date
}

export type SortOption = 'date' | 'price' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export type UploadedImage = {
  filename: string
  url: string
  size: number
  mimeType: string
  originalName: string
}

export type ImageRecord = {
  id: string
  url: string
  filename: string
  size: number
  mimeType: string
  purchaseId: string
  createdAt: Date
}
