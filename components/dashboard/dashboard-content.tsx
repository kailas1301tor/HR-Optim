// components/dashboard/dashboard-content.tsx
'use client'

import { CommonErrorBanner } from '@/components/common'
import { KPIGrid } from './kpi-cards'
import { AttendanceHeatmap } from './attendance-heatmap'
import { DepartmentDistribution } from './department-distribution'
import { DocumentExpiryTimeline } from './document-expiry'
import { PendingApprovals } from './pending-approvals'
import { useDashboard } from './useDashboard'

export function DashboardContent() {
  const { data, isLoading, hasError, errorMessage, reload } = useDashboard()

  return (
    <div className="space-y-8">
      {hasError ? (
        <CommonErrorBanner message={errorMessage ?? 'Failed to load dashboard'} onRetry={reload} />
      ) : null}

      <KPIGrid kpis={data.kpis} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceHeatmap days={data.attendanceOverview} isLoading={isLoading} />
        <DepartmentDistribution items={data.departmentDistribution} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentExpiryTimeline items={data.documentExpiry} isLoading={isLoading} />
        <PendingApprovals />
      </div>
    </div>
  )
}
