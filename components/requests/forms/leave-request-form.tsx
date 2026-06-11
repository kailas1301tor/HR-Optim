// components/requests/forms/leave-request-form.tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CommonFormFieldError } from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { uiCard, uiInput, uiOutlineBtn, uiSelect } from '@/lib/ui/design-system'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import type { LeaveType } from '@/services/leave-type-service'
import type { RequestChoiceItem } from '@/services/employee-request-service'
import { leaveRequestSchema, type LeaveRequestInput } from '@/validations/request.schema'
import { LeaveCalendarPanel } from './leave-calendar-panel'
import { LeaveDateRangeFields } from './leave-date-range-fields'

interface LeaveRequestFormProps {
  leaveTypes: LeaveType[]
  holidayDates?: Date[]
  sessionChoices: RequestChoiceItem[]
  isSubmitting: boolean
  onCalculate: (
    values: Pick<LeaveRequestInput, 'from_date' | 'to_date' | 'start_session' | 'end_session'>
  ) => Promise<number>
  onSubmit: (data: LeaveRequestInput) => Promise<void>
  onCancel: () => void
}

type CalculateState = 'idle' | 'loading' | 'success' | 'zero' | 'error' | 'invalid'

function isInvalidSessionCombo(
  fromDate: string,
  toDate: string,
  startSession: string,
  endSession: string
): boolean {
  return Boolean(
    fromDate &&
      toDate &&
      fromDate === toDate &&
      startSession &&
      endSession &&
      startSession === endSession
  )
}

export function LeaveRequestForm({
  leaveTypes,
  holidayDates = [],
  sessionChoices,
  isSubmitting,
  onCalculate,
  onSubmit,
  onCancel,
}: LeaveRequestFormProps) {
  const [calculateState, setCalculateState] = useState<CalculateState>('idle')
  const [calculateMessage, setCalculateMessage] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const calculateIdRef = useRef(0)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeaveRequestInput>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      leave_type: 0,
      from_date: '',
      to_date: '',
      start_session: '',
      end_session: '',
      number_of_days: 0,
      reason: '',
    },
  })

  const fromDate = watch('from_date')
  const toDate = watch('to_date')
  const startSession = watch('start_session')
  const endSession = watch('end_session')
  const numberOfDays = watch('number_of_days')
  const leaveTypeValue = watch('leave_type')

  const resetCalculation = useCallback((): void => {
    setValue('number_of_days', 0)
    setCalculateState('idle')
    setCalculateMessage(null)
  }, [setValue])

  const runCalculate = useCallback(async (): Promise<void> => {
    if (!fromDate || !toDate || !startSession || !endSession) {
      setCalculateState('idle')
      setCalculateMessage(null)
      return
    }

    if (isInvalidSessionCombo(fromDate, toDate, startSession, endSession)) {
      setCalculateState('invalid')
      setCalculateMessage('Start and end session cannot be the same on a single day.')
      setValue('number_of_days', 0)
      return
    }

    const calculateId = ++calculateIdRef.current
    setCalculateState('loading')
    setCalculateMessage(null)

    try {
      const days = await onCalculate({
        from_date: fromDate,
        to_date: toDate,
        start_session: startSession,
        end_session: endSession,
      })

      if (calculateId !== calculateIdRef.current) return

      if (days <= 0) {
        setCalculateState('zero')
        setCalculateMessage('0 working days for this range. Try different dates or sessions.')
        setValue('number_of_days', 0)
        return
      }

      setValue('number_of_days', days, { shouldValidate: true })
      setCalculateState('success')
      setCalculateMessage(null)
    } catch (error: unknown) {
      if (calculateId !== calculateIdRef.current) return
      setCalculateState('error')
      setCalculateMessage(getApiErrorMessage(error, 'Failed to calculate leave days'))
      setValue('number_of_days', 0)
    }
  }, [fromDate, toDate, startSession, endSession, onCalculate, setValue])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!fromDate || !toDate || !startSession || !endSession) {
      setCalculateState('idle')
      setValue('number_of_days', 0)
      return
    }

    debounceRef.current = setTimeout(() => {
      runCalculate()
    }, 400)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [fromDate, toDate, startSession, endSession, runCalculate, setValue])

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
          <LeaveCalendarPanel
            fromDate={fromDate}
            toDate={toDate}
            onRangeChange={handleRangeChange}
            holidayDates={holidayDates}
            className="h-full"
          />
        </div>

        <div
          className={cn(
            uiCard,
            'lg:col-span-2 p-5 flex flex-col h-full min-h-0 gap-4'
          )}
        >
          <LeaveDateRangeFields
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={handleFromDateChange}
            onToDateChange={handleToDateChange}
          />
          {(errors.from_date?.message || errors.to_date?.message) && (
            <CommonFormFieldError
              message={errors.from_date?.message ?? errors.to_date?.message ?? ''}
            />
          )}

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Leave Type</Label>
            <Select
              value={leaveTypeValue > 0 ? String(leaveTypeValue) : undefined}
              onValueChange={(val) => setValue('leave_type', Number(val), { shouldValidate: true })}
            >
              <SelectTrigger className={cn(uiSelect, 'w-full text-xs h-10')}>
                <SelectValue placeholder="Select leave type..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border text-xs">
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.leave_type?.message && (
              <CommonFormFieldError message={errors.leave_type.message} />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Start Session</Label>
              <Select
                value={startSession || undefined}
                onValueChange={(val) => setValue('start_session', val, { shouldValidate: true })}
              >
                <SelectTrigger className={cn(uiSelect, 'w-full text-xs h-10')}>
                  <SelectValue placeholder="Session..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border text-xs">
                  {sessionChoices.map((choice) => (
                    <SelectItem key={choice.id} value={choice.id}>
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.start_session?.message && (
                <CommonFormFieldError message={errors.start_session.message} />
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">End Session</Label>
              <Select
                value={endSession || undefined}
                onValueChange={(val) => setValue('end_session', val, { shouldValidate: true })}
              >
                <SelectTrigger className={cn(uiSelect, 'w-full text-xs h-10')}>
                  <SelectValue placeholder="Session..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border text-xs">
                  {sessionChoices.map((choice) => (
                    <SelectItem key={choice.id} value={choice.id}>
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.end_session?.message && (
                <CommonFormFieldError message={errors.end_session.message} />
              )}
            </div>
          </div>

          <div
            className={cn(
              'flex items-center justify-between gap-3 rounded-[20px] [corner-shape:squircle] border px-4 py-3',
              calculateState === 'success' && 'border-lime-400/30 bg-lime-400/10',
              calculateState === 'zero' && 'border-amber-500/30 bg-amber-500/10',
              calculateState === 'error' && 'border-red-500/30 bg-red-500/10',
              calculateState === 'invalid' && 'border-red-500/30 bg-red-500/10',
              calculateState === 'loading' && 'border-violet-core/30 bg-violet-core/10',
              calculateState === 'idle' && 'border-border/50 bg-muted/40'
            )}
          >
            <div className="min-w-0">
              <Label className="text-xs text-muted-foreground">Working Days</Label>
              {calculateMessage && (
                <p
                  className={cn(
                    'text-[11px] font-medium mt-0.5 truncate',
                    calculateState === 'zero' ? 'text-amber-600 dark:text-amber-300' : 'text-red-600 dark:text-red-400'
                  )}
                >
                  {calculateMessage}
                </p>
              )}
              {errors.number_of_days?.message && calculateState !== 'zero' && (
                <CommonFormFieldError message={errors.number_of_days.message} />
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {calculateState === 'loading' ? (
                <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label="Calculating" />
              ) : (
                <span
                  className={cn(
                    'tabular-nums font-bold',
                    numberOfDays > 0 ? 'text-2xl text-foreground' : 'text-lg text-muted-foreground'
                  )}
                >
                  {numberOfDays > 0 ? numberOfDays : '—'}
                </span>
              )}
              {calculateState !== 'loading' && fromDate && toDate && startSession && endSession && (
                <button
                  type="button"
                  onClick={runCalculate}
                  className="flex items-center justify-center size-8 rounded-[16px] [corner-shape:squircle] border border-border/40 text-violet-glow hover:bg-violet-core/10 transition-colors"
                  aria-label="Recalculate leave days"
                >
                  <RefreshCw className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Reason</Label>
            <Textarea
              value={watch('reason')}
              onChange={(e) => setValue('reason', e.target.value, { shouldValidate: true })}
              placeholder="Reason for leave..."
              className={cn(uiInput, 'text-xs flex-1 min-h-[88px] resize-none')}
              aria-label="Leave reason"
            />
            {errors.reason?.message && <CommonFormFieldError message={errors.reason.message} />}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 mt-auto border-t border-border/40 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className={cn(uiOutlineBtn, 'text-xs h-10')}
            >
              Cancel
            </Button>
            <PrimaryButton
              type="submit"
              isLoading={isSubmitting}
              disabled={
                numberOfDays <= 0 ||
                calculateState === 'loading' ||
                calculateState === 'error' ||
                calculateState === 'invalid' ||
                calculateState === 'zero'
              }
              className="text-xs h-10"
            >
              Submit Request
            </PrimaryButton>
          </div>
        </div>
      </div>
    </form>
  )
}
