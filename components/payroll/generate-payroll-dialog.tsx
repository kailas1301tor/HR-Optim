// components/payroll/generate-payroll-dialog.tsx
'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SettingsFormDialog } from '@/components/settings/shared'
import { uiInput } from '@/lib/ui/design-system'
import type { PayPeriod } from '@/lib/helpers/payroll-period'
import type { GeneratePayrollPayload } from '@/types/payroll'

interface GeneratePayrollDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payPeriod: PayPeriod
  isSubmitting: boolean
  onSubmit: (payload: GeneratePayrollPayload) => Promise<void>
}

export function GeneratePayrollDialog({
  open,
  onOpenChange,
  payPeriod,
  isSubmitting,
  onSubmit,
}: GeneratePayrollDialogProps) {
  const [month, setMonth] = useState(String(payPeriod.month))
  const [year, setYear] = useState(String(payPeriod.year))
  const [startDate, setStartDate] = useState(payPeriod.start_date)
  const [endDate, setEndDate] = useState(payPeriod.end_date)

  useEffect(() => {
    if (!open) return
    setMonth(String(payPeriod.month))
    setYear(String(payPeriod.year))
    setStartDate(payPeriod.start_date)
    setEndDate(payPeriod.end_date)
  }, [open, payPeriod])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const monthNum = Number(month)
    const yearNum = Number(year)
    if (!Number.isFinite(monthNum) || !Number.isFinite(yearNum) || !startDate || !endDate) return

    await onSubmit({
      month: monthNum,
      year: yearNum,
      start_date: startDate,
      end_date: endDate,
    })
  }

  return (
    <SettingsFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Generate Payroll"
      description="Create payroll records for the selected pay period."
      submitLabel="Generate Payroll"
      isSubmitting={isSubmitting}
      size="lg"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payroll-month" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Month
          </Label>
          <Input
            id="payroll-month"
            type="number"
            min={1}
            max={12}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={uiInput}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payroll-year" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Year
          </Label>
          <Input
            id="payroll-year"
            type="number"
            min={2000}
            max={2100}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={uiInput}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payroll-start" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Start Date
          </Label>
          <Input
            id="payroll-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={uiInput}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payroll-end" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            End Date
          </Label>
          <Input
            id="payroll-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={uiInput}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
    </SettingsFormDialog>
  )
}
