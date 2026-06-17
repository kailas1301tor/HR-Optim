// components/documents/employee-documents-view.tsx
'use client'

import { useState, useMemo } from 'react'
import { FileQuestion, Search, ShieldAlert } from 'lucide-react'
import { usePermissions } from '@/components/auth/permissions-provider'
import { DocumentCard } from './document-card'
import { DocumentsSkeleton } from './documents-skeleton'
import { CommonEmptyState, CommonErrorState } from '@/components/common'
import { Input } from '@/components/ui/input'
import { uiCard, uiInput } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { useEmployeeDocuments } from './useEmployeeDocuments'

function EmployeeDocumentsPageHeader({ embedded }: { embedded: boolean }) {
  if (embedded) return null
  return (
    <div>
      <h1 className="text-2xl font-bold text-cloud">My Documents</h1>
      <p className="text-xs text-muted-foreground mt-1">
        View and download your personal verified documents
      </p>
    </div>
  )
}

export function EmployeeDocumentsView({ embedded = false }: { embedded?: boolean }) {
  const { employeeProfileId, isLoading: isAuthLoading } = usePermissions()
  const [searchQuery, setSearchQuery] = useState('')

  const { documents, isLoading, hasError, errorMessage, reload } = useEmployeeDocuments({
    employeeProfileId,
    enabled: !isAuthLoading && employeeProfileId !== null,
  })

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return documents
    const q = searchQuery.toLowerCase()
    return documents.filter((doc) => {
      const typeName = String(doc.document_type_name || '').toLowerCase()
      const docNum = String(doc.document_number || '').toLowerCase()
      return typeName.includes(q) || docNum.includes(q)
    })
  }, [documents, searchQuery])

  if (isAuthLoading || isLoading) {
    return <DocumentsSkeleton variant="employee" />
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

  if (hasError) {
    return (
      <div className="space-y-6">
        <EmployeeDocumentsPageHeader embedded={embedded} />
        <CommonErrorState
          title="Unable to load documents"
          message={errorMessage ?? 'Failed to load your documents'}
          onRetry={reload}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <EmployeeDocumentsPageHeader embedded={embedded} />

      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(uiInput, 'pl-11 min-h-11 text-xs')}
        />
      </div>

      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc, idx) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              type="employee"
              index={idx}
              onDeleteSuccess={() => {}}
              canManage={false}
            />
          ))}
        </div>
      ) : !hasError ? (
        <CommonEmptyState
          icon={FileQuestion}
          title="No documents found"
          description={
            searchQuery.trim()
              ? 'Try modifying your search criteria to find what you are looking for.'
              : 'You do not have any uploaded or verified documents registered in the system.'
          }
        />
      ) : null}
    </div>
  )
}
