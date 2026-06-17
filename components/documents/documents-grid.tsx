// components/documents/documents-grid.tsx
'use client'

import { ModuleRestrictedState, SelfServiceModuleTabs } from '@/components/common'
import { DocumentsSkeleton } from './documents-skeleton'
import { useModuleGate } from '@/lib/permissions/use-module-gate'
import { AdminDocumentsGrid } from './admin-documents-grid'
import { EmployeeDocumentsView } from './employee-documents-view'

export function DocumentsGrid() {
  const documentsGate = useModuleGate('documents')

  if (documentsGate.isLoading) {
    return <DocumentsSkeleton showHeader={false} />
  }

  if (documentsGate.isRestricted) {
    return <ModuleRestrictedState moduleKey="documents" />
  }

  return (
    <SelfServiceModuleTabs
      showAdminView={documentsGate.showAdminView}
      showPersonalView={documentsGate.showPersonalView}
      teamContent={<AdminDocumentsGrid />}
      mineContent={<EmployeeDocumentsView embedded={documentsGate.isCombinedView} />}
    />
  )
}
