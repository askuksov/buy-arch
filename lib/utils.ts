import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getMarketplaceLabel(code: string): string {
  const labels: Record<string, string> = {
    aliexpress: 'AliExpress',
    temu: 'Temu',
    olx: 'OLX',
    rozetka: 'Rozetka',
  }
  return labels[code] || code
}
