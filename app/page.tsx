import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAMES, formatDisplayNameFromUsername } from '@/lib/cookies'
import { AppShell } from '@/components/layout/app-shell'
import { KPIGrid } from '@/components/dashboard/kpi-cards'
import { AttendanceHeatmap } from '@/components/dashboard/attendance-heatmap'
import { DocumentExpiryTimeline } from '@/components/dashboard/document-expiry'
import { DepartmentDistribution } from '@/components/dashboard/department-distribution'
import { PendingApprovals } from '@/components/dashboard/pending-approvals'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const username = cookieStore.get(AUTH_COOKIE_NAMES.username)?.value || 'john'
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

        {/* KPI Cards */}
        <KPIGrid />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceHeatmap />
          <DepartmentDistribution />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DocumentExpiryTimeline />
          <PendingApprovals />
        </div>
      </div>
    </AppShell>
  )
}
