import { prisma } from './prisma'

/**
 * Fetch all active currencies from database
 * Results are ordered by sortOrder field
 */
export async function getCurrencies() {
  return prisma.currency.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

/**
 * Fetch all active marketplaces from database
 * Results are ordered by sortOrder field
 */
export async function getMarketplaces() {
  return prisma.marketplace.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

/**
 * Fetch a single currency by code
 */
export async function getCurrency(code: string) {
  return prisma.currency.findUnique({
    where: { code },
  })
}

/**
 * Fetch a single marketplace by code
 */
export async function getMarketplace(code: string) {
  return prisma.marketplace.findUnique({
    where: { code },
  })
}
