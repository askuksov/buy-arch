import Link from 'next/link'
import { Plus, ListFilter, Tags, FolderOpen, LucideIcon } from 'lucide-react'

interface QuickAction {
  label: string
  href: string
  icon: LucideIcon
  color: string
  bgColor: string
  description: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Add Purchase',
    href: '/purchases/new',
    icon: Plus,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    description: 'Add a new purchase',
  },
  {
    label: 'View All',
    href: '/purchases',
    icon: ListFilter,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    description: 'Browse all purchases',
  },
  {
    label: 'Categories',
    href: '/categories',
    icon: FolderOpen,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    description: 'Manage categories',
  },
  {
    label: 'Tags',
    href: '/tags',
    icon: Tags,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    description: 'Manage tags',
  },
]

export function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all group"
          >
            <div className={`${action.bgColor} p-3 rounded-full mb-2 group-hover:scale-110 transition-transform`}>
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
              {action.label}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              {action.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
