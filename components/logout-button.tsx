'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors"
    >
      <LogOut size={16} />
      Logout
    </button>
  )
}
