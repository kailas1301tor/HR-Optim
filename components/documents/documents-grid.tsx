// components/documents/documents-grid.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { FileQuestion } from 'lucide-react'
import { downloadBlob } from '@/lib/helpers/download-blob'
import { companyDocumentService, employeeDocumentService } from '@/services/document-service'
import { Button } from '@/components/ui/button'
import {
  CommonEmptyState,
  CommonErrorState,
  CommonFilterChips,
} from '@/components/common'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { DocumentCard } from './document-card'
import { DocumentCardSkeleton } from './document-card-skeleton'
import { UploadDocumentModal } from './upload-document-modal'
import { DocumentsToolbar } from './documents-toolbar'
import { DocumentsStatsCards } from './documents-stats-cards'
import { useDocumentsList } from './useDocumentsList'
import { usePermissions } from '@/components/auth/permissions-provider'

const TAB_OPTIONS = [
  { value: 'employee', label: 'Employee' },
  { value: 'company', label: 'Company' },
]

export function DocumentsGrid() {
  const [isExporting, setIsExporting] = useState(false)
  const { canManage } = usePermissions()
  const canManageDocuments = canManage('documents')

  const {
    tab,
    statusFilter,
    categoryFilter,
    localSearch,
    setLocalSearch,
    loading,
    hasError,
    documents,
    counts,
    categories,
    isUploadOpen,
    setIsUploadOpen,
    updateQueryParams,
    refreshList,
    handleRetry,
    handleTabChange,
    handleClearFilters,
    handleStatusCardSelect,
  } = useDocumentsList()

  const handleExportExpiry = async () => {
    setIsExporting(true)
    try {
      const result =
        tab === 'employee'
          ? await employeeDocumentService.exportExpiry(30)
          : await companyDocumentService.exportExpiry(30)
      downloadBlob(result.blob, result.filename)
      toast.success('Expiry report downloaded')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to export documents'
      toast.error(message)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <CommonFilterChips options={TAB_OPTIONS} value={tab} onChange={handleTabChange} />

      <DocumentsToolbar
        tab={tab}
        localSearch={localSearch}
        setLocalSearch={setLocalSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={(val) => updateQueryParams({ category: val })}
        categories={categories}
        onUploadClick={() => setIsUploadOpen(true)}
        onExportExpiry={handleExportExpiry}
        isExporting={isExporting}
        canManage={canManageDocuments}
      />

      <DocumentsStatsCards
        counts={counts}
        statusFilter={statusFilter}
        isLoading={loading}
        onSelect={handleStatusCardSelect}
      />

      {hasError ? (
        <CommonErrorState
          title="Failed to load documents"
          message="Please check your connection and try again."
          onRetry={handleRetry}
        />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <DocumentCardSkeleton key={idx} />
          ))}
        </div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, idx) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              type={tab}
              index={idx}
              onDeleteSuccess={refreshList}
              canManage={canManageDocuments}
            />
          ))}
        </div>
      ) : (
        <CommonEmptyState
          icon={FileQuestion}
          title="No documents matching your search"
          description="Try adjusting your search query, status filters, or document type criteria."
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              className={cn(uiOutlineBtn, 'text-xs min-h-11')}
            >
              Clear Filters
            </Button>
          }
        />
      )}

      <UploadDocumentModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        tab={tab}
        onSuccess={refreshList}
      />
    </div>
  )
}
