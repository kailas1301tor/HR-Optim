// components/dashboard/dashboard-content.tsx
'use client'

import { CommonErrorBanner, ModuleRestrictedState, SelfServiceModuleTabs } from '@/components/common'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/components/auth/permissions-provider'
import { useModuleGate } from '@/lib/permissions/use-module-gate'
import { isInitialDataLoading } from '@/lib/helpers/is-initial-data-loading'
import { KPIGrid } from './kpi-cards'
import { AttendanceHeatmap } from './attendance-heatmap'
import { DepartmentDistribution } from './department-distribution'
import { DocumentExpiryTimeline } from './document-expiry'
import { PendingApprovals } from './pending-approvals'
import { useDashboard } from './useDashboard'
import { EmployeeDashboardView } from './employee-dashboard-view'
import { DashboardSkeleton } from './dashboard-skeleton'

function AdminDashboardSections() {
  const { canManage, isLoading: isPermissionsLoading } = usePermissions()
  const dashboardGate = useModuleGate('dashboard')
  const { data, isLoading, hasError, errorMessage, reload } = useDashboard({
    enabled: dashboardGate.fetchEnabled,
  })

  const isAdminDataLoading = isInitialDataLoading(isLoading, data.kpis.length, hasError)

  if (isAdminDataLoading) {
    return <DashboardSkeleton />
  }

  const showPendingApprovals = !isPermissionsLoading && canManage('requests')

  return (
    <div className={cn('space-y-8 animate-in fade-in duration-300')}>
      {hasError ? (
        <CommonErrorBanner message={errorMessage ?? 'Failed to load dashboard'} onRetry={reload} />
      ) : null}

      <KPIGrid kpis={data.kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceHeatmap days={data.attendanceOverview} />
        <DepartmentDistribution items={data.departmentDistribution} />
      </div>

      <div className={cn('grid grid-cols-1 gap-6', showPendingApprovals && 'lg:grid-cols-2')}>
        <DocumentExpiryTimeline items={data.documentExpiry} />
        {showPendingApprovals ? <PendingApprovals /> : null}
      </div>
    </div>
  )
}

export function DashboardContent() {
  const dashboardGate = useModuleGate('dashboard')

  if (dashboardGate.isLoading) {
    return <DashboardSkeleton />
  }

  if (dashboardGate.isRestricted) {
    return <ModuleRestrictedState moduleKey="dashboard" />
  }

  return (
    <SelfServiceModuleTabs
      showAdminView={dashboardGate.showAdminView}
      showPersonalView={dashboardGate.showPersonalView}
      teamContent={<AdminDashboardSections />}
      mineContent={<EmployeeDashboardView embedded={dashboardGate.isCombinedView} />}
    />
  )
}
