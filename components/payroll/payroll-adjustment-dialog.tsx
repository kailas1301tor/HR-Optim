// components/payroll/payroll-adjustment-dialog.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SettingsFormDialog } from '@/components/settings/shared'
import { CommonFormFieldError } from '@/components/common'
import { uiInput, uiSelect } from '@/lib/ui/design-system'
import { LIMIT_REASON, LIMIT_SHORT_NAME } from '@/validations/field-limits'
import { payrollAdjustmentSchema } from '@/validations/payroll.schema'
import type { PayrollAdjustmentType, PayrollRecord } from '@/types/payroll'

const ADJUSTMENT_TYPES: PayrollAdjustmentType[] = ['Allowance', 'Deduction']

interface PayrollAdjustmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: PayrollRecord | null
  isSubmitting: boolean
  onSubmit: (input: {
    adjustment_type: PayrollAdjustmentType
    description: string
    amount: string
    reason: string
  }) => Promise<void>
}

export function PayrollAdjustmentDialog({
  open,
  onOpenChange,
  target,
  isSubmitting,
  onSubmit,
}: PayrollAdjustmentDialogProps) {
  const [adjustmentType, setAdjustmentType] = useState<PayrollAdjustmentType>('Allowance')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [descriptionError, setDescriptionError] = useState<string | null>(null)
  const [amountError, setAmountError] = useState<string | null>(null)
  const [reasonError, setReasonError] = useState<string | null>(null)

  const formValues = useMemo(
    () => ({ adjustment_type: adjustmentType, description, amount, reason }),
    [adjustmentType, description, amount, reason],
  )

  const isFormValid = useMemo(
    () => payrollAdjustmentSchema.safeParse(formValues).success,
    [formValues],
  )

  useEffect(() => {
    if (!open) {
      setAdjustmentType('Allowance')
      setDescription('')
      setAmount('')
      setReason('')
      setDescriptionError(null)
      setAmountError(null)
      setReasonError(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = payrollAdjustmentSchema.safeParse(formValues)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setDescriptionError(fieldErrors.description?.[0] ?? null)
      setAmountError(fieldErrors.amount?.[0] ?? null)
      setReasonError(fieldErrors.reason?.[0] ?? null)
      return
    }

    setDescriptionError(null)
    setAmountError(null)
    setReasonError(null)

    await onSubmit({
      adjustment_type: parsed.data.adjustment_type,
      description: parsed.data.description,
      amount: parsed.data.amount,
      reason: parsed.data.reason,
    })
  }

  return (
    <SettingsFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Payroll Adjustment"
      description={
        target
          ? `Add an adjustment for ${target.employeeName} (${target.employeeId}).`
          : 'Add a payroll adjustment.'
      }
      submitLabel="Add Adjustment"
      isSubmitting={isSubmitting}
      submitDisabled={!isFormValid}
      size="lg"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="adjustment-type" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Adjustment Type
        </Label>
        <Select
          value={adjustmentType}
          onValueChange={(value) => setAdjustmentType(value as PayrollAdjustmentType)}
          disabled={isSubmitting}
        >
          <SelectTrigger id="adjustment-type" className={uiSelect}>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {ADJUSTMENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="adjustment-description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </Label>
        <Input
          id="adjustment-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (descriptionError) setDescriptionError(null)
          }}
          placeholder="e.g. Custom Bonus"
          className={uiInput}
          required
          disabled={isSubmitting}
          maxLength={LIMIT_SHORT_NAME}
        />
        <CommonFormFieldError message={descriptionError ?? undefined} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adjustment-amount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Amount (AED)
        </Label>
        <Input
          id="adjustment-amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            if (amountError) setAmountError(null)
          }}
          placeholder="500.00"
          className={uiInput}
          required
          disabled={isSubmitting}
        />
        <CommonFormFieldError message={amountError ?? undefined} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adjustment-reason" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Reason
        </Label>
        <Textarea
          id="adjustment-reason"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value)
            if (reasonError) setReasonError(null)
          }}
          placeholder="Outstanding performance"
          className={uiInput}
          rows={3}
          required
          disabled={isSubmitting}
          maxLength={LIMIT_REASON}
        />
        <CommonFormFieldError message={reasonError ?? undefined} />
      </div>
    </SettingsFormDialog>
  )
}
