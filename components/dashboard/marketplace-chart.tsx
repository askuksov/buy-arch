import { getMarketplaceLabel } from '@/lib/utils'

interface MarketplaceData {
  marketplaceCode: string
  count: number
}

interface MarketplaceChartProps {
  data: MarketplaceData[]
}

const MARKETPLACE_COLORS: Record<string, string> = {
  aliexpress: '#FF6B00',
  temu: '#FF6600',
  olx: '#002F34',
  rozetka: '#00A046',
}

export function MarketplaceChart({ data }: MarketplaceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Purchases by Marketplace
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No purchase data available yet.
        </p>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Purchases by Marketplace
      </h2>

      <div className="space-y-4">
        {data.map((item) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0
          const color = MARKETPLACE_COLORS[item.marketplaceCode] || '#3b82f6'

          return (
            <div key={item.marketplaceCode}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {getMarketplaceLabel(item.marketplaceCode)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.count} {item.count === 1 ? 'purchase' : 'purchases'}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {total > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {total} {total === 1 ? 'purchase' : 'purchases'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
