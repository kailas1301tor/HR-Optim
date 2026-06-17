// components/dashboard/employee-dashboard-view.tsx
'use client'

import { ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/components/auth/permissions-provider'
import { CommonErrorBanner } from '@/components/common'
import { isInitialDataLoading } from '@/lib/helpers/is-initial-data-loading'
import { uiCard } from '@/lib/ui/design-system'
import { KPIGrid } from './kpi-cards'
import { AttendanceHeatmap } from './attendance-heatmap'
import { DocumentExpiryTimeline } from './document-expiry'
import { EmployeePendingRequests } from './employee-pending-requests'
import { DashboardSkeleton } from './dashboard-skeleton'
import { useEmployeeDashboard } from './useEmployeeDashboard'

export function EmployeeDashboardView() {
  const { employeeProfileId, isLoading: isAuthLoading } = usePermissions()
  const { data, isLoading, hasError, errorMessage, reload } = useEmployeeDashboard({
    employeeProfileId,
    enabled: !isAuthLoading && employeeProfileId !== null,
  })

  const isDataLoading = isInitialDataLoading(isLoading, data.kpis.length, hasError)

  if (isAuthLoading || isDataLoading) {
    return <DashboardSkeleton />
  }

  if (!employeeProfileId) {
    return (
      <div className={cn(uiCard, 'p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto mt-12 border-amber-500/20 bg-amber-500/5')}>
        <ShieldAlert className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-semibold text-cloud mb-2">No Employee Profile Linked</h3>
        <p className="text-sm text-muted-foreground">
          This account is not linked to any employee profile. Please contact your system administrator to configure your employee profile link.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {hasError ? (
        <CommonErrorBanner
          message={errorMessage ?? 'Failed to load dashboard data'}
          onRetry={reload}
        />
      ) : null}

      <KPIGrid kpis={data.kpis} />

      <AttendanceHeatmap
        days={data.attendanceOverview}
        subtitle="Your attendance over recent days"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentExpiryTimeline items={data.documentExpiry} />
        <EmployeePendingRequests items={data.pendingRequests} />
      </div>
    </div>
  )
}
