// components/requests/forms/salary-advance-request-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CommonFormFieldError } from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { cn } from '@/lib/utils'
import { uiInput, uiOutlineBtn } from '@/lib/ui/design-system'
import { salaryAdvanceRequestSchema, type SalaryAdvanceRequestInput } from '@/validations/request.schema'

interface SalaryAdvanceRequestFormProps {
  isSubmitting: boolean
  onSubmit: (data: SalaryAdvanceRequestInput) => Promise<void>
  onCancel: () => void
}

export function SalaryAdvanceRequestForm({
  isSubmitting,
  onSubmit,
  onCancel,
}: SalaryAdvanceRequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SalaryAdvanceRequestInput>({
    resolver: zodResolver(salaryAdvanceRequestSchema),
    defaultValues: { request_amount: 0, tenure: 1, reason: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Request Amount</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            {...register('request_amount')}
            placeholder="5000.00"
            className={cn(uiInput, 'text-xs h-10')}
            aria-label="Request amount"
          />
          {errors.request_amount?.message && (
            <CommonFormFieldError message={errors.request_amount.message} />
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Tenure (months)</Label>
          <Input
            type="number"
            min="1"
            max="60"
            {...register('tenure')}
            placeholder="6"
            className={cn(uiInput, 'text-xs h-10')}
            aria-label="Tenure in months"
          />
          {errors.tenure?.message && <CommonFormFieldError message={errors.tenure.message} />}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Reason</Label>
        <Textarea
          {...register('reason')}
          placeholder="Reason for salary advance..."
          className={cn(uiInput, 'text-xs min-h-[100px] resize-none')}
          aria-label="Salary advance reason"
        />
        {errors.reason?.message && <CommonFormFieldError message={errors.reason.message} />}
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
