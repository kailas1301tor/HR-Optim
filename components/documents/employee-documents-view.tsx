// components/documents/employee-documents-view.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FileQuestion, Search, ShieldAlert } from 'lucide-react'
import { usePermissions } from '@/components/auth/permissions-provider'
import { employeeSelfService } from '@/services/employee-self-service'
import { DocumentCard } from './document-card'
import { DocumentCardSkeleton } from './document-card-skeleton'
import { CommonEmptyState, CommonErrorState } from '@/components/common'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import {
  invalidateClientFetch,
  shouldFinalizeClientFetch,
} from '@/lib/helpers/client-fetch-lifecycle'
import { Input } from '@/components/ui/input'
import { uiCard, uiInput } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { EmployeeDocument } from '@/types/document'

export function EmployeeDocumentsView() {
  const { employeeProfileId, isLoading: isAuthLoading } = usePermissions()
  const [documents, setDocuments] = useState<EmployeeDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadToken, setReloadToken] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const fetchIdRef = useRef(0)

  useEffect(() => {
    if (isAuthLoading) return
    if (!employeeProfileId) {
      setIsLoading(false)
      return
    }
    const profileId = employeeProfileId
    const fetchId = ++fetchIdRef.current
    const controller = new AbortController()

    async function loadDocuments() {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage('')
      try {
        const data = await employeeSelfService.getDocuments({
          employeeId: profileId,
          signal: controller.signal,
        })
        if (fetchId !== fetchIdRef.current) return
        setDocuments(Array.isArray(data) ? data : [])
      } catch (error) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        console.error('🔴 Error loading self-service documents:', error)
        setDocuments([])
        setHasError(true)
        setErrorMessage(getApiErrorMessage(error, 'Failed to load your documents. Please try again.'))
      } finally {
        if (shouldFinalizeClientFetch({ signal: controller.signal, fetchId, fetchIdRef })) {
          setIsLoading(false)
        }
      }
    }

    void loadDocuments()

    return () => invalidateClientFetch(fetchIdRef, controller)
  }, [employeeProfileId, isAuthLoading, reloadToken])

  const handleRetry = () => setReloadToken((prev) => prev + 1)

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
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-cloud">My Documents</h1>
          <p className="text-xs text-muted-foreground mt-1">View and download your personal verified documents</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <DocumentCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    )
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
        <div>
          <h1 className="text-2xl font-bold text-cloud">My Documents</h1>
          <p className="text-xs text-muted-foreground mt-1">View and download your personal verified documents</p>
        </div>
        <CommonErrorState
          title="Unable to load documents"
          message={errorMessage}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cloud">My Documents</h1>
        <p className="text-xs text-muted-foreground mt-1">View and download your personal verified documents</p>
      </div>

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
      ) : (
        <CommonEmptyState
          icon={FileQuestion}
          title="No documents found"
          description={
            searchQuery.trim()
              ? 'Try modifying your search criteria to find what you are looking for.'
              : 'You do not have any uploaded or verified documents registered in the system.'
          }
        />
      )}
    </div>
  )
}
