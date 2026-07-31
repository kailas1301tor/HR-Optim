// components/requests/forms/wfh-request-form.tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CommonFormFieldError } from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { cn } from '@/lib/utils'
import { uiCard, uiInput, uiOutlineBtn } from '@/lib/ui/design-system'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import type { LeaveCalendarEvent } from '@/types/request'
import { wfhRequestSchema, type WfhRequestInput } from '@/validations/request.schema'
import { LIMIT_REASON } from '@/validations/field-limits'
import { LeaveCalendarPanel } from './leave-calendar-panel'
import { LeaveDateRangeFields } from './leave-date-range-fields'
import { LeaveDaysVisualizer } from './leave-days-visualizer'

interface WfhRequestFormProps {
  holidayEvents?: LeaveCalendarEvent[]
  existingLeaveDates?: Date[]
  isCalendarLoading?: boolean
  fullDaySessionId: string
  wfhEndSessionId: string
  isSubmitting: boolean
  onCalculate: (values: Pick<WfhRequestInput, 'from_date' | 'to_date'>) => Promise<number>
  onSubmit: (data: WfhRequestInput) => Promise<void>
  onCancel: () => void
}

type CalculateState = 'idle' | 'loading' | 'success' | 'zero' | 'error' | 'invalid'

export function WfhRequestForm({
  holidayEvents = [],
  existingLeaveDates = [],
  isCalendarLoading = false,
  fullDaySessionId,
  wfhEndSessionId,
  isSubmitting,
  onCalculate,
  onSubmit,
  onCancel,
}: WfhRequestFormProps): React.JSX.Element {
  const [calculateState, setCalculateState] = useState<CalculateState>('idle')
  const [calculateMessage, setCalculateMessage] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const calculateIdRef = useRef(0)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WfhRequestInput>({
    resolver: zodResolver(wfhRequestSchema),
    defaultValues: {
      from_date: '',
      to_date: '',
      number_of_days: 0,
      reason: '',
    },
  })

  const fromDate = watch('from_date')
  const toDate = watch('to_date')
  const numberOfDays = watch('number_of_days')

  const resetCalculation = useCallback((): void => {
    setValue('number_of_days', 0)
    setCalculateState('idle')
    setCalculateMessage(null)
  }, [setValue])

  const runCalculate = useCallback(async (): Promise<void> => {
    if (!fromDate || !toDate || !fullDaySessionId || !wfhEndSessionId) {
      setCalculateState('idle')
      setCalculateMessage(null)
      return
    }

    const calculateId = ++calculateIdRef.current
    setCalculateState('loading')
    setCalculateMessage(null)

    try {
      const days = await onCalculate({ from_date: fromDate, to_date: toDate })
      if (calculateId !== calculateIdRef.current) return
      if (days <= 0) {
        setCalculateState('zero')
        setCalculateMessage('0 working days for this range. Try different dates.')
        setValue('number_of_days', 0)
        return
      }
      setValue('number_of_days', days, { shouldValidate: true })
      setCalculateState('success')
      setCalculateMessage(null)
    } catch (error: unknown) {
      if (calculateId !== calculateIdRef.current) return
      setCalculateState('error')
      setCalculateMessage(getApiErrorMessage(error, 'Failed to calculate WFH days'))
      setValue('number_of_days', 0)
    }
  }, [fromDate, toDate, fullDaySessionId, wfhEndSessionId, onCalculate, setValue])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!fromDate || !toDate || !fullDaySessionId || !wfhEndSessionId) {
      setCalculateState('idle')
      setValue('number_of_days', 0)
      return
    }
    debounceRef.current = setTimeout(() => {
      void runCalculate()
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [fromDate, toDate, fullDaySessionId, wfhEndSessionId, runCalculate, setValue])

  const handleRangeChange = (from: string, to: string): void => {
    setValue('from_date', from, { shouldValidate: true })
    setValue('to_date', to, { shouldValidate: true })
    resetCalculation()
  }

  const handleFromDateChange = (value: string): void => {
    if (!value) return
    setValue('from_date', value, { shouldValidate: true })
    if (!toDate || toDate < value) {
      setValue('to_date', value, { shouldValidate: true })
    }
    resetCalculation()
  }

  const handleToDateChange = (value: string): void => {
    if (!value) return
    if (fromDate && value < fromDate) {
      setValue('to_date', fromDate, { shouldValidate: true })
      setValue('from_date', value, { shouldValidate: true })
    } else {
      setValue('to_date', value, { shouldValidate: true })
    }
    resetCalculation()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="lg:h-full">
      <div className="grid grid-cols-1 lg:grid-cols-5 lg:items-stretch gap-5 lg:gap-6 lg:min-h-[520px]">
        <div className="lg:col-span-3 flex flex-col h-full min-h-0">
          {isCalendarLoading ? (
            <div
              className={cn(uiCard, 'flex flex-1 min-h-[320px] items-center justify-center text-sm text-muted-foreground')}
              role="status"
              aria-label="Loading calendar"
            >
              Loading calendar…
            </div>
          ) : (
            <LeaveCalendarPanel
              fromDate={fromDate}
              toDate={toDate}
              onRangeChange={handleRangeChange}
              holidayEvents={holidayEvents}
              existingLeaveDates={existingLeaveDates}
              className="h-full"
            />
          )}
        </div>

        <div className={cn(uiCard, 'lg:col-span-2 p-5 flex flex-col h-full min-h-0 gap-4 overflow-y-auto max-h-[85vh]')}>
          <LeaveDateRangeFields
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={handleFromDateChange}
            onToDateChange={handleToDateChange}
          />
          {(errors.from_date?.message || errors.to_date?.message) && (
            <CommonFormFieldError message={errors.from_date?.message ?? errors.to_date?.message ?? ''} />
          )}

          <LeaveDaysVisualizer
            calculateState={calculateState}
            calculateMessage={calculateMessage}
            numberOfDays={numberOfDays}
            fromDate={fromDate}
            toDate={toDate}
            startSession={fullDaySessionId}
            endSession={wfhEndSessionId}
            onRecalculate={() => void runCalculate()}
            error={errors.number_of_days?.message}
          />

          <div className="space-y-1.5">
            <Label htmlFor="wfh-reason" className="text-xs text-muted-foreground">
              Reason
            </Label>
            <Textarea
              id="wfh-reason"
              value={watch('reason')}
              onChange={(event) => setValue('reason', event.target.value, { shouldValidate: true })}
              placeholder="Brief reason for working from home..."
              maxLength={LIMIT_REASON}
              className={cn(uiInput, 'min-h-[96px] resize-none text-xs')}
              aria-invalid={Boolean(errors.reason)}
            />
            {errors.reason?.message && <CommonFormFieldError message={errors.reason.message} />}
          </div>

          <div className="flex justify-end gap-2 pt-2 mt-auto">
            <Button type="button" variant="outline" className={uiOutlineBtn} onClick={onCancel}>
              Cancel
            </Button>
            <PrimaryButton
              type="submit"
              disabled={isSubmitting || numberOfDays <= 0 || calculateState === 'loading'}
              isLoading={isSubmitting}
            >
              Submit Request
            </PrimaryButton>
          </div>
        </div>
      </div>
    </form>
  )
}
