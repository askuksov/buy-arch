'use client'

import { usePurchaseStats } from '@/hooks/use-purchases'
import { StatCard } from '@/components/dashboard/stat-card'
import { RecentPurchasesList } from '@/components/dashboard/recent-purchases-list'
import { MarketplaceChart } from '@/components/dashboard/marketplace-chart'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ShoppingCart, DollarSign, TrendingUp, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const { data: stats, isLoading, error } = usePurchaseStats()

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load dashboard data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !stats) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalByCurrency = stats.totalByCurrency || {}
  const currencies = Object.entries(totalByCurrency).filter(([_, amount]) => (amount as number) > 0)

  return (
    <main className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here&apos;s an overview of your purchases.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Purchases"
          value={stats.totalPurchases || 0}
          icon={ShoppingCart}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        />

        <StatCard
          title="Total Spent (USD)"
          value={formatCurrency(totalByCurrency.USD || 0, 'USD')}
          icon={DollarSign}
          iconColor="text-green-600 dark:text-green-400"
          iconBgColor="bg-green-100 dark:bg-green-900/30"
        />

        <StatCard
          title="Total Spent (EUR)"
          value={formatCurrency(totalByCurrency.EUR || 0, 'EUR')}
          icon={TrendingUp}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        />

        <StatCard
          title="Total Spent (UAH)"
          value={formatCurrency(totalByCurrency.UAH || 0, 'UAH')}
          icon={Package}
          iconColor="text-orange-600 dark:text-orange-400"
          iconBgColor="bg-orange-100 dark:bg-orange-900/30"
        />
      </div>

      {/* Currency Summary (if multiple currencies) */}
      {currencies.length > 1 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Total spent across all currencies:</strong>{' '}
            {currencies.map(([code, amount], index) => (
              <span key={code}>
                {formatCurrency(amount as number, code)}
                {index < currencies.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchases - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentPurchasesList purchases={stats.recentPurchases || []} />
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Marketplace Chart */}
          <MarketplaceChart data={stats.byMarketplace || []} />

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </main>
  )
}
