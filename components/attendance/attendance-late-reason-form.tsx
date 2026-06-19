// components/attendance/attendance-late-reason-form.tsx
'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PrimaryButton } from '@/components/ui/primary-button'
import { CommonErrorBanner, CommonFormFieldError } from '@/components/common'
import { formatDisplayDate } from '@/lib/helpers/format-api-date'
import { uiCard, uiInput } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { LIMIT_REASON } from '@/validations/field-limits'
import { AlertCircle, Calendar, Loader2, User } from 'lucide-react'
import { useLateReasonSubmit } from './useLateReasonSubmit'
import type { AttendanceRecord } from '@/types/attendance'

interface AttendanceLateReasonFormProps {
  record: AttendanceRecord
  attendanceDate: string
  canSubmit: boolean
  onSuccess?: () => void
}

const labelClass = 'text-xs font-semibold uppercase tracking-wider text-muted-foreground'

export function AttendanceLateReasonForm({
  record,
  attendanceDate,
  canSubmit,
  onSuccess,
}: AttendanceLateReasonFormProps): React.JSX.Element {
  const {
    reason,
    setReason,
    reasonError,
    submitError,
    isSubmitting,
    isResolvingEmployee,
    canSubmitForm,
    hasEmployeeProfileId,
    handleSubmit,
  } = useLateReasonSubmit({
    record,
    attendanceDate,
    canSubmit,
    onSuccess,
  })

  const displayDate = formatDisplayDate(attendanceDate)

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(uiCard, 'p-5 space-y-4')}
      aria-label="Late reason form"
    >
      <div>
        <h4 className="text-sm font-medium text-cloud">Late Reason</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Record a reason for this employee&apos;s attendance on the selected date.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className={labelClass}>Employee</Label>
          <div
            className={cn(
              uiInput,
              'flex items-center gap-2 min-h-11 bg-muted/20 text-sm text-cloud cursor-default',
            )}
            aria-readonly="true"
          >
            <User className="h-4 w-4 shrink-0 text-violet-glow" aria-hidden="true" />
            <span className="truncate">{record.employeeName}</span>
            <span className="ml-auto shrink-0 px-1.5 py-0.5 rounded bg-violet-core/10 border border-violet-core/20 font-mono text-[10px] text-violet-glow font-semibold">
              {record.employeeId}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className={labelClass}>Date</Label>
          <div
            className={cn(
              uiInput,
              'flex items-center gap-2 min-h-11 bg-muted/20 text-sm text-cloud cursor-default',
            )}
            aria-readonly="true"
          >
            <Calendar className="h-4 w-4 shrink-0 text-violet-glow" aria-hidden="true" />
            <span>{displayDate}</span>
          </div>
        </div>
      </div>

      {isResolvingEmployee && (
        <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/30 p-3 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
          <p>Looking up employee profile…</p>
        </div>
      )}

      {!isResolvingEmployee && !hasEmployeeProfileId && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            Cannot submit — employee profile could not be resolved from code{' '}
            <span className="font-mono">{record.employeeId}</span>.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="late-reason" className={labelClass}>
          Reason <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="late-reason"
          className={cn(uiInput, 'min-h-[100px] resize-y')}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value)
          }}
          placeholder="e.g. Heavy traffic accident"
          rows={4}
          maxLength={LIMIT_REASON}
          disabled={isSubmitting || isResolvingEmployee || !hasEmployeeProfileId}
          required
          aria-invalid={reasonError ? true : undefined}
        />
        <CommonFormFieldError message={reasonError ?? undefined} />
      </div>

      {submitError && <CommonErrorBanner message={submitError} />}

      <div className="flex justify-end pt-2">
        <PrimaryButton
          type="submit"
          isLoading={isSubmitting}
          disabled={!canSubmitForm}
          className="text-xs min-h-11 w-full sm:w-auto"
        >
          Submit Reason
        </PrimaryButton>
      </div>
    </form>
  )
}
