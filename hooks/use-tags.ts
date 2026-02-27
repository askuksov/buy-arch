'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TagFormInput } from '@/types'

type Tag = {
  id: string
  name: string
  color: string | null
  isActive: boolean
  createdAt: Date
  _count: {
    purchases: number
  }
}

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await fetch('/api/tags')
      if (!response.ok) throw new Error('Failed to fetch tags')
      return response.json()
    },
  })
}

export function useTag(id: string) {
  return useQuery<Tag>({
    queryKey: ['tags', id],
    queryFn: async () => {
      const response = await fetch(`/api/tags/${id}`)
      if (!response.ok) throw new Error('Failed to fetch tag')
      return response.json()
    },
    enabled: !!id,
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TagFormInput) => {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create tag')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TagFormInput }) => {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update tag')
      }

      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['tags', variables.id] })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete tag')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
