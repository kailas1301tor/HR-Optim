// components/documents/upload-document-modal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { uiDialog, uiSkeletonBlock } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { employeeDocumentService, companyDocumentService } from '@/services/document-service'
import { employeeService } from '@/services/employee-service'
import { branchService } from '@/services/branch-service'
import type { Employee } from '@/components/employees/employee-table'
import { EmployeeDocumentForm } from './employee-document-form'
import { CompanyDocumentForm } from './company-document-form'
import type { EmployeeDocumentUploadInput, CompanyDocumentUploadInput } from '@/validations/document.schema'

interface UploadDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tab: 'employee' | 'company'
  onSuccess: () => void
}

export function UploadDocumentModal({ open, onOpenChange, tab, onSuccess }: UploadDocumentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([])
  const [employeeDocTypes, setEmployeeDocTypes] = useState<{ id: number; name: string }[]>([])
  const [companyDocTypes, setCompanyDocTypes] = useState<{ id: number; name: string }[]>([])
  const [loadingMetadata, setLoadingMetadata] = useState(false)

  useEffect(() => {
    if (!open) return

    const loadMetadata = async () => {
      setLoadingMetadata(true)
      try {
        if (tab === 'employee') {
          const [empRes, dropdownRes] = await Promise.all([
            employeeService.getEmployees({ page_size: 1000 }),
            employeeDocumentService.getDropdowns(),
          ])
          setEmployees(empRes.data)
          setEmployeeDocTypes(dropdownRes.employee_document_types)
        } else {
          const [dropdownRes, branchesRes] = await Promise.all([
            companyDocumentService.getDropdowns(),
            branchService.getBranches(),
          ])
          setCompanyDocTypes(dropdownRes.company_document_types || [])
          setBranches(branchesRes || [])
        }
      } catch (err: unknown) {
        console.error('Failed to load document metadata:', err)
        toast.error('Failed to load form lookup data')
      } finally {
        setLoadingMetadata(false)
      }
    }

    loadMetadata()
  }, [open, tab])

  const onEmployeeSubmit = async (data: EmployeeDocumentUploadInput) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('employee', data.employee)
      formData.append('document_type', data.document_type)
      formData.append('document_number', data.document_number)
      formData.append('expiry_date', data.expiry_date)
      if (data.file instanceof File) {
        formData.append('file', data.file)
      }

      await employeeDocumentService.upload(formData)
      toast.success('Employee document uploaded successfully!')
      onSuccess()
      handleClose()
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Failed to upload document'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onCompanySubmit = async (data: CompanyDocumentUploadInput) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('company_document_type', data.company_document_type)
      formData.append('branch', data.branch)
      formData.append('issue_date', data.issue_date)
      formData.append('expiry_date', data.expiry_date)
      if (data.file instanceof File) {
        formData.append('file', data.file)
      }

      await companyDocumentService.upload(formData)
      toast.success('Company document uploaded successfully!')
      onSuccess()
      handleClose()
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Failed to upload document'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose() }}>
      <DialogContent className={cn(uiDialog, 'max-w-md overflow-y-auto max-h-[90vh]')}>
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg flex items-center gap-2">
            <Upload className="w-5 h-5 text-violet-glow" />
            Upload {tab === 'employee' ? 'Employee' : 'Company'} Document
          </DialogTitle>
        </DialogHeader>

        {loadingMetadata ? (
          <div className="space-y-4 py-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className={cn('h-3 w-1/4 rounded', uiSkeletonBlock)} />
                <Skeleton className={cn('h-10 w-full rounded-xl', uiSkeletonBlock)} />
              </div>
            ))}
            <Skeleton className={cn('h-28 w-full rounded-xl', uiSkeletonBlock)} />
          </div>
        ) : tab === 'employee' ? (
          <EmployeeDocumentForm
            employees={employees}
            documentTypes={employeeDocTypes}
            onSubmit={onEmployeeSubmit}
            onCancel={handleClose}
            isSubmitting={isSubmitting}
          />
        ) : (
          <CompanyDocumentForm
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
