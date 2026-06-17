// components/documents/documents-grid.tsx
'use client'

import { DocumentsSkeleton } from './documents-skeleton'
import { useModuleGate } from '@/lib/permissions/use-module-gate'
import { AdminDocumentsGrid } from './admin-documents-grid'
import { EmployeeDocumentsView } from './employee-documents-view'

export function DocumentsGrid() {
  const documentsGate = useModuleGate('documents')

  if (documentsGate.shouldRenderPersonalView) {
    return <EmployeeDocumentsView />
  }

  if (documentsGate.isLoading) {
    return <DocumentsSkeleton showHeader={false} />
  }

  return <AdminDocumentsGrid />
}
