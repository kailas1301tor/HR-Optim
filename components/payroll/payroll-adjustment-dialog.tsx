// components/payroll/payroll-adjustment-dialog.tsx
'use client'

import { useEffect, useState } from 'react'
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
import { uiInput, uiSelect } from '@/lib/ui/design-system'
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

  useEffect(() => {
    if (!open) {
      setAdjustmentType('Allowance')
      setDescription('')
      setAmount('')
      setReason('')
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || !amount.trim() || !reason.trim()) return
    await onSubmit({
      adjustment_type: adjustmentType,
      description,
      amount,
      reason,
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
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Custom Bonus"
          className={uiInput}
          required
          disabled={isSubmitting}
        />
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
          onChange={(e) => setAmount(e.target.value)}
          placeholder="500.00"
          className={uiInput}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="adjustment-reason" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Reason
        </Label>
        <Textarea
          id="adjustment-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Outstanding performance"
          className={uiInput}
          rows={3}
          required
          disabled={isSubmitting}
        />
      </div>
    </SettingsFormDialog>
  )
}
