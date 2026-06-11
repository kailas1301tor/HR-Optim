import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAMES, formatDisplayNameFromUsername } from '@/lib/cookies'
import { AppShell } from '@/components/layout/app-shell'
import { Suspense } from 'react'
import { CommonPageSkeleton } from '@/components/common'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const username = cookieStore.get(AUTH_COOKIE_NAMES.username)?.value || 'User'
  const displayName = formatDisplayNameFromUsername(username)

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-cloud mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {displayName}. Here&apos;s what&apos;s happening with your team today.
          </p>
        </div>

        <Suspense fallback={<CommonPageSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </AppShell>
  )
}
