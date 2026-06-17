// components/requests/requests-list.tsx
'use client'

import { useState, useEffect } from 'react'
import { ModuleRestrictedState, SelfServiceModuleTabs } from '@/components/common'
import { useModuleGate } from '@/lib/permissions/use-module-gate'
import { AdminRequestsList } from './admin-requests-list'
import { EmployeeRequestsView } from './employee-requests-view'
import { RequestsSkeleton } from './requests-skeleton'

export function RequestsList() {
  const [isMounted, setIsMounted] = useState(false)
  const requestsGate = useModuleGate('requests')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || requestsGate.isLoading) {
    return <RequestsSkeleton variant="generic" />
  }

  if (requestsGate.isRestricted) {
    return <ModuleRestrictedState moduleKey="requests" />
  }

  return (
    <SelfServiceModuleTabs
      showAdminView={requestsGate.showAdminView}
      showPersonalView={requestsGate.showPersonalView}
      teamContent={<AdminRequestsList />}
      mineContent={<EmployeeRequestsView embedded={requestsGate.isCombinedView} />}
    />
  )
}
