// components/documents/company-document-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { CommonFormFieldError } from '@/components/common'
import { Button } from '@/components/ui/button'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uiInput, uiOutlineBtn, uiSelect } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { companyDocumentUploadSchema, type CompanyDocumentUploadInput } from '@/validations/document.schema'
import { DocumentFileDropzone } from './document-file-dropzone'

interface CompanyDocumentFormProps {
  branches: { id: number; name: string }[]
  documentTypes: { id: number; name: string }[]
  onSubmit: (data: CompanyDocumentUploadInput) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function CompanyDocumentForm({
  branches,
  documentTypes,
  onSubmit,
  onCancel,
  isSubmitting,
}: CompanyDocumentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyDocumentUploadInput>({
    resolver: zodResolver(companyDocumentUploadSchema),
    defaultValues: { company_document_type: '', branch: '', issue_date: '', expiry_date: '', file: undefined },
  })

  const file = watch('file')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-400">Document Category</Label>
        <Select onValueChange={(val) => setValue('company_document_type', val, { shouldValidate: true })}>
          <SelectTrigger className={cn('w-full text-xs', uiSelect)}>
            <SelectValue placeholder="Select type..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border text-xs">
            {documentTypes.map((type) => (
              <SelectItem key={type.id} value={String(type.id)}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CommonFormFieldError message={errors.company_document_type?.message} />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-slate-400">Branch</Label>
        <Select onValueChange={(val) => setValue('branch', val, { shouldValidate: true })}>
          <SelectTrigger className={cn('w-full text-xs', uiSelect)}>
            <SelectValue placeholder="Select branch..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border text-xs">
            {branches.map((b) => (
              <SelectItem key={b.id} value={String(b.id)}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CommonFormFieldError message={errors.branch?.message} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="issue_date" className="text-xs text-slate-400">Issue Date</Label>
          <Input
            id="issue_date"
            type="date"
            className={cn(uiInput, 'text-xs')}
            {...register('issue_date')}
          />
          <CommonFormFieldError message={errors.issue_date?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company_expiry_date" className="text-xs text-slate-400">Expiry Date</Label>
          <Input
            id="company_expiry_date"
            type="date"
            className={cn(uiInput, 'text-xs')}
            {...register('expiry_date')}
          />
          <CommonFormFieldError message={errors.expiry_date?.message} />
        </div>
      </div>

      <DocumentFileDropzone
        file={file}
        errorMessage={errors.file?.message as string | undefined}
        onFileChange={(fileObj) => setValue('file', fileObj, { shouldValidate: true })}
      />

      <div className="flex flex-col sm:flex-row items-center gap-2 pt-4 border-t border-border/40 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className={cn(uiOutlineBtn, 'w-full text-xs')}
        >
          Cancel
        </Button>
        <PrimaryButton type="submit" disabled={isSubmitting} isLoading={isSubmitting} className="w-full text-xs">
          <Plus className="w-4 h-4" />
          Add Document
        </PrimaryButton>
      </div>
    </form>
  )
}
