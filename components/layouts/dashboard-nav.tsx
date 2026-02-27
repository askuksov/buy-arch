'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Tag, FolderOpen, LayoutDashboard } from 'lucide-react'

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      href: '/categories',
      icon: FolderOpen,
      label: 'Categories',
    },
    {
      href: '/tags',
      icon: Tag,
      label: 'Tags',
    },
  ]

  return (
    <div className="hidden md:flex items-center gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
