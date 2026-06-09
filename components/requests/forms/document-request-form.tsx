// components/requests/forms/document-request-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CommonFormFieldError } from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { cn } from '@/lib/utils'
import { uiInput, uiOutlineBtn, uiSelect } from '@/lib/ui/design-system'
import type { RequestChoiceItem } from '@/services/employee-request-service'
import { documentRequestSchema, type DocumentRequestInput } from '@/validations/request.schema'

interface DocumentRequestFormProps {
  documentTypeChoices: RequestChoiceItem[]
  isSubmitting: boolean
  onSubmit: (data: DocumentRequestInput) => Promise<void>
  onCancel: () => void
}

export function DocumentRequestForm({
  documentTypeChoices,
  isSubmitting,
  onSubmit,
  onCancel,
}: DocumentRequestFormProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DocumentRequestInput>({
    resolver: zodResolver(documentRequestSchema),
    defaultValues: { document_type: '', purpose: '' },
  })

  const documentTypeValue = watch('document_type')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Document Type</Label>
        <Select
          value={documentTypeValue || undefined}
          onValueChange={(val) => setValue('document_type', val, { shouldValidate: true })}
        >
          <SelectTrigger className={cn(uiSelect, 'w-full text-xs h-10')}>
            <SelectValue placeholder="Select document type..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border text-xs">
            {documentTypeChoices.map((choice) => (
              <SelectItem key={choice.id} value={choice.id}>
                {choice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.document_type?.message && (
          <CommonFormFieldError message={errors.document_type.message} />
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Purpose</Label>
        <Textarea
          value={watch('purpose')}
          onChange={(e) => setValue('purpose', e.target.value, { shouldValidate: true })}
          placeholder="Purpose of document request..."
          className={cn(uiInput, 'text-xs min-h-[100px] resize-none')}
          aria-label="Document request purpose"
        />
        {errors.purpose?.message && <CommonFormFieldError message={errors.purpose.message} />}
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className={cn(uiOutlineBtn, 'text-xs h-10')}>
          Cancel
        </Button>
        <PrimaryButton type="submit" isLoading={isSubmitting} className="text-xs h-10">
          Submit Request
        </PrimaryButton>
      </div>
    </form>
  )
}
