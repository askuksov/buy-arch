import { requireAuth } from '@/lib/auth-helpers'
import { LogoutButton } from '@/components/logout-button'
import { DashboardNav } from '@/components/layouts/dashboard-nav'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Purchase Organizer
                </h1>
              </Link>

              <DashboardNav />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user.name || user.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  )
}
