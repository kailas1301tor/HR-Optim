// components/documents/employee-document-form.tsx
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
import type { Employee } from '@/components/employees/employee-table'
import { employeeDocumentUploadSchema, type EmployeeDocumentUploadInput } from '@/validations/document.schema'
import { DocumentFileDropzone } from './document-file-dropzone'

interface EmployeeDocumentFormProps {
  employees: Employee[]
  documentTypes: { id: number; name: string }[]
  onSubmit: (data: EmployeeDocumentUploadInput) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function EmployeeDocumentForm({
  employees,
  documentTypes,
  onSubmit,
  onCancel,
  isSubmitting,
}: EmployeeDocumentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeDocumentUploadInput>({
    resolver: zodResolver(employeeDocumentUploadSchema),
    defaultValues: { employee: '', document_type: '', document_number: '', expiry_date: '', file: undefined },
  })

  const file = watch('file')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-400">Employee</Label>
        <Select onValueChange={(val) => setValue('employee', val, { shouldValidate: true })}>
          <SelectTrigger className={cn('w-full text-xs', uiSelect)}>
            <SelectValue placeholder="Select employee..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border text-xs">
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={String(emp.id)}>
                {emp.full_name} ({emp.employee_id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CommonFormFieldError message={errors.employee?.message} />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-slate-400">Document Category</Label>
        <Select onValueChange={(val) => setValue('document_type', val, { shouldValidate: true })}>
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
        <CommonFormFieldError message={errors.document_type?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="doc_number" className="text-xs text-slate-400">Document Number</Label>
        <Input
          id="doc_number"
          placeholder="e.g. Passport/ID number"
          className={cn(uiInput, 'text-xs')}
          {...register('document_number')}
        />
        <CommonFormFieldError message={errors.document_number?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="expiry_date" className="text-xs text-slate-400">Expiry Date</Label>
        <Input
          id="expiry_date"
          type="date"
          className={cn(uiInput, 'text-xs')}
          {...register('expiry_date')}
        />
        <CommonFormFieldError message={errors.expiry_date?.message} />
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
