// components/requests/requests-list.tsx
'use client'

import { useModuleGate } from '@/lib/permissions/use-module-gate'
import { AdminRequestsList } from './admin-requests-list'
import { EmployeeRequestsView } from './employee-requests-view'
import { RequestsSkeleton } from './requests-skeleton'

export function RequestsList() {
  const requestsGate = useModuleGate('requests')

  if (requestsGate.shouldRenderPersonalView) {
    return <EmployeeRequestsView />
  }

  if (requestsGate.isLoading) {
    return <RequestsSkeleton variant="generic" />
  }

  return <AdminRequestsList />
}
