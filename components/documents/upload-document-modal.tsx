// components/documents/upload-document-modal.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Upload } from 'lucide-react'
import { CommonErrorState } from '@/components/common'
import { uiDialog, uiSkeletonBlock } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { DocumentTab } from '@/types/document'
import { EmployeeDocumentForm } from './employee-document-form'
import { CompanyDocumentForm } from './company-document-form'
import { useUploadDocumentModal } from './useUploadDocumentModal'

interface UploadDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tab: DocumentTab
  onSuccess: () => void
}

export function UploadDocumentModal({ open, onOpenChange, tab, onSuccess }: UploadDocumentModalProps) {
  const {
    isSubmitting,
    loadingMetadata,
    metadataError,
    employees,
    employeeSearch,
    setEmployeeSearch,
    employeesLoading,
    branches,
    employeeDocTypes,
    companyDocTypes,
    onEmployeeSubmit,
    onCompanySubmit,
    reloadMetadata,
  } = useUploadDocumentModal(open, tab, onOpenChange, onSuccess)

  const handleClose = () => onOpenChange(false)

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose() }}>
      <DialogContent className={cn(uiDialog, 'max-w-md md:max-w-lg flex flex-col max-h-[90vh] overflow-hidden')}>
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-cloud font-semibold text-lg flex items-center gap-2">
            <Upload className="w-5 h-5 text-violet-glow" aria-hidden />
            Upload {tab === 'employee' ? 'Employee' : 'Company'} Document
          </DialogTitle>
        </DialogHeader>

        {metadataError ? (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <CommonErrorState
              title="Failed to load form data"
              message="We couldn't load the options needed for this form. Check your connection and try again."
              onRetry={reloadMetadata}
            />
          </div>
        ) : loadingMetadata ? (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 py-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className={cn('h-3 w-1/4 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                <Skeleton className={cn('h-10 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
              </div>
            ))}
            <Skeleton className={cn('h-28 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          </div>
        ) : tab === 'employee' ? (
          <EmployeeDocumentForm
            key={`employee-${open}`}
            employees={employees}
            employeesLoading={employeesLoading}
            employeeSearch={employeeSearch}
            onEmployeeSearchChange={setEmployeeSearch}
            documentTypes={employeeDocTypes}
            onSubmit={onEmployeeSubmit}
            onCancel={handleClose}
            isSubmitting={isSubmitting}
          />
        ) : (
          <CompanyDocumentForm
            key={`company-${open}`}
            branches={branches}
            documentTypes={companyDocTypes}
            onSubmit={onCompanySubmit}
            onCancel={handleClose}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
