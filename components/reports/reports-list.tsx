// components/reports/reports-list.tsx
'use client'

import { ModuleRestrictedState } from '@/components/common'
import { useModuleGate } from '@/lib/permissions/use-module-gate'
import { ReportsDashboard } from './reports-dashboard'
import { ReportsSkeleton } from './reports-skeleton'
import { useReportsData } from './useReportsData'

export function ReportsList() {
  const reportsGate = useModuleGate('reports')
  const { data, isLoading, hasError, errorMessage, reload } = useReportsData({
    enabled: reportsGate.fetchEnabled,
  })

  if (reportsGate.isLoading || (isLoading && !hasError)) {
    return <ReportsSkeleton />
  }

  if (reportsGate.isRestricted) {
    return <ModuleRestrictedState moduleKey="reports" />
  }

  return (
    <ReportsDashboard
      data={data}
      isLoading={isLoading}
      hasError={hasError}
      errorMessage={errorMessage}
      onReload={reload}
    />
  )
}
