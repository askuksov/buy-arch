'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PurchaseWithRelations } from '@/types'

type PurchasesResponse = {
  purchases: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function usePurchases(params?: {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  marketplaceCode?: string
  tagIds?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.set('page', params.page.toString())
  if (params?.limit) queryParams.set('limit', params.limit.toString())
  if (params?.search) queryParams.set('search', params.search)
  if (params?.categoryId) queryParams.set('categoryId', params.categoryId)
  if (params?.marketplaceCode) queryParams.set('marketplaceCode', params.marketplaceCode)
  if (params?.tagIds?.length) queryParams.set('tagIds', params.tagIds.join(','))
  if (params?.sortBy) queryParams.set('sortBy', params.sortBy)
  if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder)

  return useQuery<PurchasesResponse>({
    queryKey: ['purchases', params],
    queryFn: async () => {
      const response = await fetch(`/api/purchases?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch purchases')
      return response.json()
    },
  })
}

export function usePurchase(id: string) {
  return useQuery<PurchaseWithRelations>({
    queryKey: ['purchases', id],
    queryFn: async () => {
      const response = await fetch(`/api/purchases/${id}`)
      if (!response.ok) throw new Error('Failed to fetch purchase')
      return response.json()
    },
    enabled: !!id,
  })
}

export function useCreatePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create purchase')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export function useUpdatePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/purchases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update purchase')
      }

      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['purchases', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export function useDeletePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/purchases/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete purchase')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

export function usePurchaseStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch('/api/purchases/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json()
    },
  })
}
