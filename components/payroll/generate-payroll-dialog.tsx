// components/payroll/generate-payroll-dialog.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SettingsFormDialog } from '@/components/settings/shared'
import { CommonFormFieldError } from '@/components/common'
import { uiInput } from '@/lib/ui/design-system'
import { generatePayrollSchema } from '@/validations/payroll.schema'
import { DatePicker } from '@/components/ui/date-picker'
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
  const [monthError, setMonthError] = useState<string | null>(null)
  const [yearError, setYearError] = useState<string | null>(null)
  const [startDateError, setStartDateError] = useState<string | null>(null)
  const [endDateError, setEndDateError] = useState<string | null>(null)

  const formValues = useMemo(
    () => ({
      month: Number(month),
      year: Number(year),
      start_date: startDate,
      end_date: endDate,
    }),
    [month, year, startDate, endDate],
  )

  const isFormValid = useMemo(
    () => generatePayrollSchema.safeParse(formValues).success,
    [formValues],
  )

  useEffect(() => {
    if (!open) return
    setMonth(String(payPeriod.month))
    setYear(String(payPeriod.year))
    setStartDate(payPeriod.start_date)
    setEndDate(payPeriod.end_date)
    setMonthError(null)
    setYearError(null)
    setStartDateError(null)
    setEndDateError(null)
  }, [open, payPeriod])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = generatePayrollSchema.safeParse(formValues)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setMonthError(fieldErrors.month?.[0] ?? null)
      setYearError(fieldErrors.year?.[0] ?? null)
      setStartDateError(fieldErrors.start_date?.[0] ?? null)
      setEndDateError(fieldErrors.end_date?.[0] ?? null)
      return
    }

    setMonthError(null)
    setYearError(null)
    setStartDateError(null)
    setEndDateError(null)

    await onSubmit({
      month: parsed.data.month,
      year: parsed.data.year,
      start_date: parsed.data.start_date,
      end_date: parsed.data.end_date,
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
      submitDisabled={!isFormValid}
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
            onChange={(e) => {
              setMonth(e.target.value)
              if (monthError) setMonthError(null)
            }}
            className={uiInput}
            required
            disabled={isSubmitting}
          />
          <CommonFormFieldError message={monthError ?? undefined} />
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
            onChange={(e) => {
              setYear(e.target.value)
              if (yearError) setYearError(null)
            }}
            className={uiInput}
            required
            disabled={isSubmitting}
          />
          <CommonFormFieldError message={yearError ?? undefined} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payroll-start" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Start Date
          </Label>
          <DatePicker
            id="payroll-start"
            value={startDate}
            onChange={(val) => {
              setStartDate(val)
              if (startDateError) setStartDateError(null)
            }}
            disabled={isSubmitting}
          />
          <CommonFormFieldError message={startDateError ?? undefined} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payroll-end" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            End Date
          </Label>
          <DatePicker
            id="payroll-end"
            value={endDate}
            onChange={(val) => {
              setEndDate(val)
              if (endDateError) setEndDateError(null)
            }}
            disabled={isSubmitting}
          />
          <CommonFormFieldError message={endDateError ?? undefined} />
        </div>
      </div>
    </SettingsFormDialog>
  )
}
