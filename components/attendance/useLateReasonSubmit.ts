// components/attendance/useLateReasonSubmit.ts
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api'
import { attendanceService } from '@/services/attendance-service'
import { employeeService } from '@/services/employee-service'
import { lateReasonSchema } from '@/validations/attendance.schema'
import type { AttendanceRecord } from '@/types/attendance'

export interface UseLateReasonSubmitOptions {
  record: AttendanceRecord | null
  attendanceDate: string
  canSubmit: boolean
  onSuccess?: () => void
}

export interface UseLateReasonSubmitReturn {
  reason: string
  setReason: (value: string) => void
  reasonError: string | null
  submitError: string | null
  isSubmitting: boolean
  isResolvingEmployee: boolean
  canSubmitForm: boolean
  hasEmployeeProfileId: boolean
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

export function useLateReasonSubmit({
  record,
  attendanceDate,
  canSubmit,
  onSuccess,
}: UseLateReasonSubmitOptions): UseLateReasonSubmitReturn {
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resolvedProfileId, setResolvedProfileId] = useState<number | null>(
    record?.employeeProfileId ?? null,
  )
  const [isResolvingEmployee, setIsResolvingEmployee] = useState(false)

  useEffect(() => {
    setReason('')
    setReasonError(null)
    setSubmitError(null)
  }, [record?.id, attendanceDate])

  useEffect(() => {
    const controller = new AbortController()

    if (record?.employeeProfileId != null) {
      setResolvedProfileId(record.employeeProfileId)
      setIsResolvingEmployee(false)
      return () => controller.abort()
    }

    const employeeCode = record?.employeeId?.trim()
    if (!employeeCode) {
      setResolvedProfileId(null)
      setIsResolvingEmployee(false)
      return () => controller.abort()
    }

    const codeToResolve = employeeCode

    async function resolveProfileId(): Promise<void> {
      setIsResolvingEmployee(true)
      setResolvedProfileId(null)

      try {
        const profileId = await employeeService.resolveProfileIdByEmployeeCode(
          codeToResolve,
          controller.signal,
        )
        if (controller.signal.aborted) return
        setResolvedProfileId(profileId)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setResolvedProfileId(null)
      } finally {
        if (!controller.signal.aborted) {
          setIsResolvingEmployee(false)
        }
      }
    }

    void resolveProfileId()
    return () => controller.abort()
  }, [record?.employeeProfileId, record?.employeeId, record?.id])

  const hasEmployeeProfileId = resolvedProfileId != null

  const isReasonValid = useMemo(
    () => lateReasonSchema.safeParse({ reason }).success,
    [reason],
  )

  const canSubmitForm =
    canSubmit &&
    hasEmployeeProfileId &&
    !isResolvingEmployee &&
    Boolean(attendanceDate) &&
    isReasonValid

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault()

      if (!canSubmit || resolvedProfileId == null || !attendanceDate) return

      const parsed = lateReasonSchema.safeParse({ reason })
      if (!parsed.success) {
        setReasonError(parsed.error.flatten().fieldErrors.reason?.[0] ?? 'Reason is required')
        return
      }

      setReasonError(null)
      setSubmitError(null)
      setIsSubmitting(true)

      try {
        await attendanceService.submitLateReason({
          employee: resolvedProfileId,
          date: attendanceDate,
          reason: parsed.data.reason,
        })
        toast.success('Late reason submitted successfully')
        setReason('')
        onSuccess?.()
      } catch (err: unknown) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Failed to submit late reason'
        setSubmitError(message)
        toast.error(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [attendanceDate, canSubmit, onSuccess, reason, resolvedProfileId],
  )

  return {
    reason,
    setReason,
    reasonError,
    submitError,
    isSubmitting,
    isResolvingEmployee,
    canSubmitForm,
    hasEmployeeProfileId,
    handleSubmit,
  }
}
