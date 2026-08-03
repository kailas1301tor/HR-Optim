// components/requests/forms/leave-request-form.tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { LIMIT_REASON } from '@/validations/field-limits'
import type { LeaveBalanceRecord, LeaveCalendarEvent } from '@/types/request'
import { findBalanceForLeaveType, formatLeaveBalance, shouldEnforceLeaveBalance } from '@/lib/helpers/leave-balance'
import { LeaveCalendarPanel } from './leave-calendar-panel'
import { LeaveDateRangeFields } from './leave-date-range-fields'
import { LeaveBalanceVisualizer } from './leave-balance-visualizer'
import { LeaveDaysVisualizer } from './leave-days-visualizer'
import { LeaveDocumentUploader } from './leave-document-uploader'
import { useBlockedDateRange } from './use-blocked-date-range'
import { rangeOverlapsBlocked } from '@/lib/helpers/calendar-blocked-dates'

interface LeaveRequestFormProps {
  leaveTypes: (LeaveType & { is_document_required?: boolean; is_paid_leave?: boolean })[]
  leaveBalances?: LeaveBalanceRecord[]
  isBalancesLoading?: boolean
  hasBalancesError?: boolean
  holidayEvents?: LeaveCalendarEvent[]
  requestEvents?: LeaveCalendarEvent[]
  existingLeaveDates?: Date[]
  blockedDates?: Date[]
  isCalendarLoading?: boolean
  sessionChoices: RequestChoiceItem[]
  isSubmitting: boolean
  onCalculate: (
    values: Pick<LeaveRequestInput, 'from_date' | 'to_date' | 'start_session' | 'end_session'>
  ) => Promise<number>
  onSubmit: (data: LeaveRequestInput, files: File[]) => Promise<void>
  onCancel: () => void
}

type CalculateState = 'idle' | 'loading' | 'success' | 'zero' | 'error' | 'invalid'

function isInvalidSessionCombo(
  fromDate: string,
  toDate: string,
  startSession: string,
  endSession: string,
  sessionChoices: RequestChoiceItem[]
): boolean {
  if (!fromDate || !toDate || fromDate !== toDate || !startSession || !endSession) {
    return false
  }
  const startIndex = sessionChoices.findIndex((choice) => choice.id === startSession)
  const endIndex = sessionChoices.findIndex((choice) => choice.id === endSession)
  if (startIndex === -1 || endIndex === -1) return false
  return endIndex < startIndex
}

export function LeaveRequestForm({
  leaveTypes,
  leaveBalances = [],
  isBalancesLoading = false,
  hasBalancesError = false,
  holidayEvents = [],
  requestEvents = [],
  existingLeaveDates = [],
  blockedDates = [],
  isCalendarLoading = false,
  sessionChoices,
  isSubmitting,
  onCalculate,
  onSubmit,
  onCancel,
}: LeaveRequestFormProps): React.JSX.Element {
  const [calculateState, setCalculateState] = useState<CalculateState>('idle')
  const [calculateMessage, setCalculateMessage] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const calculateIdRef = useRef(0)
  const runCalculateRef = useRef<() => Promise<void>>(async () => {})

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

  const selectedLeaveType = leaveTypes.find((type) => type.id === leaveTypeValue) || null
  const selectedBalance =
    selectedLeaveType && leaveTypeValue > 0
      ? findBalanceForLeaveType(selectedLeaveType.name, leaveBalances)
      : null

  const isBalanceEnforced = shouldEnforceLeaveBalance(selectedLeaveType)
  const hasInsufficientBalance =
    isBalanceEnforced && selectedBalance !== null && selectedBalance <= 0
  const exceedsBalance =
    isBalanceEnforced &&
    selectedBalance !== null &&
    numberOfDays > 0 &&
    numberOfDays > selectedBalance

  const getBalanceHint = (leaveTypeName: string): string | null => {
    if (isBalancesLoading || hasBalancesError || leaveBalances.length === 0) return null
    const balance = findBalanceForLeaveType(leaveTypeName, leaveBalances)
    if (balance === null) return null
    return formatLeaveBalance(balance)
  }

  const resetCalculation = useCallback((): void => {
    setValue('number_of_days', 0)
    setCalculateState('idle')
    setCalculateMessage(null)
  }, [setValue])

  const clearDates = useCallback((): void => {
    setValue('from_date', '')
    setValue('to_date', '')
    resetCalculation()
  }, [resetCalculation, setValue])

  const {
    blockedSet,
    blockedRangeMessage,
    validateAndApplyRange,
    handleBlockedSelectionAttempt,
  } = useBlockedDateRange({
    blockedDates,
    fromDate,
    toDate,
    onClearDates: clearDates,
  })

  const runCalculate = useCallback(async (): Promise<void> => {
    if (!fromDate || !toDate || !startSession || !endSession) {
      setCalculateState('idle')
      setCalculateMessage(null)
      return
    }
    if (rangeOverlapsBlocked(fromDate, toDate, blockedSet)) {
      setCalculateState('invalid')
      setCalculateMessage(null)
      setValue('number_of_days', 0)
      return
    }
    if (isInvalidSessionCombo(fromDate, toDate, startSession, endSession, sessionChoices)) {
      setCalculateState('invalid')
      setCalculateMessage('End session must be on or after start session on the same day.')
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
  }, [fromDate, toDate, startSession, endSession, sessionChoices, onCalculate, setValue, blockedSet])

  runCalculateRef.current = runCalculate

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!fromDate || !toDate || !startSession || !endSession) {
      setCalculateState('idle')
      return
    }
    debounceRef.current = setTimeout(() => {
      void runCalculateRef.current()
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [fromDate, toDate, startSession, endSession])

  useEffect(() => {
    setSelectedFiles([])
    setFileError(null)
  }, [leaveTypeValue])

  const handleRangeChange = (from: string, to: string): void => {
    validateAndApplyRange(from, to, (nextFrom, nextTo) => {
      setValue('from_date', nextFrom, { shouldValidate: true })
      setValue('to_date', nextTo, { shouldValidate: true })
      resetCalculation()
    })
  }

  const handleFromDateChange = (value: string): void => {
    if (!value) return
    const nextTo = !toDate || toDate < value ? value : toDate
    validateAndApplyRange(value, nextTo, (nextFrom, nextTo) => {
      setValue('from_date', nextFrom, { shouldValidate: true })
      setValue('to_date', nextTo, { shouldValidate: true })
      resetCalculation()
    })
  }

  const handleToDateChange = (value: string): void => {
    if (!value) return
    if (fromDate && value < fromDate) {
      validateAndApplyRange(value, fromDate, (nextFrom, nextTo) => {
        setValue('from_date', nextFrom, { shouldValidate: true })
        setValue('to_date', nextTo, { shouldValidate: true })
        resetCalculation()
      })
      return
    }
    validateAndApplyRange(fromDate, value, (nextFrom, nextTo) => {
      setValue('from_date', nextFrom, { shouldValidate: true })
      setValue('to_date', nextTo, { shouldValidate: true })
      resetCalculation()
    })
  }

  const onFormSubmit = async (data: LeaveRequestInput): Promise<void> => {
    if (rangeOverlapsBlocked(data.from_date, data.to_date, blockedSet)) {
      return
    }
    if (selectedLeaveType?.is_document_required && selectedFiles.length === 0) {
      setFileError('At least one document is required for this leave type.')
      return
    }
    await onSubmit(data, selectedFiles)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="lg:h-full">
      <div className="grid grid-cols-1 lg:grid-cols-5 lg:items-stretch gap-5 lg:gap-6 lg:min-h-[520px]">
        <div className="lg:col-span-3 flex flex-col h-full min-h-0">
          {isCalendarLoading ? (
            <div
              className={cn(uiCard, 'flex flex-1 min-h-[320px] items-center justify-center text-sm text-muted-foreground')}
              role="status"
              aria-label="Loading leave calendar"
            >
              Loading calendar…
            </div>
          ) : (
            <LeaveCalendarPanel
              fromDate={fromDate}
              toDate={toDate}
              onRangeChange={handleRangeChange}
              holidayEvents={holidayEvents}
              requestEvents={requestEvents}
              existingLeaveDates={existingLeaveDates}
              blockedDates={blockedDates}
              onBlockedSelectionAttempt={handleBlockedSelectionAttempt}
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
            blockedDates={blockedDates}
          />
          {blockedRangeMessage ? (
            <CommonFormFieldError message={blockedRangeMessage} />
          ) : null}
          {(errors.from_date?.message || errors.to_date?.message) && (
            <CommonFormFieldError message={errors.from_date?.message ?? errors.to_date?.message ?? ''} />
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
                {leaveTypes.map((type) => {
                  const balanceHint = getBalanceHint(type.name)
                  return (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.name}
                      {balanceHint !== null ? (
                        <span className="text-muted-foreground"> ({balanceHint})</span>
                      ) : null}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {errors.leave_type?.message && <CommonFormFieldError message={errors.leave_type.message} />}
          </div>

          <LeaveBalanceVisualizer
            selectedLeaveType={selectedLeaveType}
            leaveBalances={leaveBalances}
            isBalancesLoading={isBalancesLoading}
            hasBalancesError={hasBalancesError}
            selectedBalance={selectedBalance}
            hasInsufficientBalance={hasInsufficientBalance}
            exceedsBalance={exceedsBalance}
          />

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
              {errors.start_session?.message && <CommonFormFieldError message={errors.start_session.message} />}
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
              {errors.end_session?.message && <CommonFormFieldError message={errors.end_session.message} />}
            </div>
          </div>

          <LeaveDaysVisualizer
            calculateState={calculateState}
            calculateMessage={calculateMessage}
            numberOfDays={numberOfDays}
            fromDate={fromDate}
            toDate={toDate}
            startSession={startSession}
            endSession={endSession}
            onRecalculate={runCalculate}
            error={errors.number_of_days?.message}
          />

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Reason</Label>
            <Textarea
              value={watch('reason')}
              onChange={(e) => setValue('reason', e.target.value, { shouldValidate: true })}
              placeholder="Reason for leave..."
              className={cn(uiInput, 'text-xs min-h-[72px] resize-none')}
              aria-label="Leave reason"
              maxLength={LIMIT_REASON}
            />
            {errors.reason?.message && <CommonFormFieldError message={errors.reason.message} />}
          </div>

          {selectedLeaveType?.is_document_required && (
            <LeaveDocumentUploader
              files={selectedFiles}
              onFilesChange={setSelectedFiles}
              error={fileError}
              setError={setFileError}
            />
          )}

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
                calculateState === 'zero' ||
                (isBalanceEnforced && isBalancesLoading) ||
                (isBalanceEnforced && hasBalancesError) ||
                leaveTypeValue <= 0 ||
                hasInsufficientBalance ||
                exceedsBalance ||
                (isBalanceEnforced &&
                  selectedBalance === null &&
                  leaveTypeValue > 0 &&
                  !isBalancesLoading)
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
