// Zod validation schemas
// This file will contain validation schemas for forms and API endpoints

import { z } from 'zod'

export const emptySchema = z.object({})

// Authentication validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

// Purchase validation schemas
export const purchaseFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  price: z
    .number()
    .positive('Price must be greater than 0')
    .max(1000000, 'Price is too large'),
  currencyCode: z.string().min(1, 'Please select a currency'),
  purchaseDate: z.date(),
  marketplaceCode: z.string().min(1, 'Please select a marketplace'),
  productUrl: z
    .string()
    .url('Invalid URL')
    .optional()
    .or(z.literal('')),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()),
  images: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string(),
      filename: z.string(),
      size: z.number(),
      mimeType: z.string(),
      originalName: z.string().optional(),
    })
  ),
})

export type PurchaseFormData = z.infer<typeof purchaseFormSchema>
