// components/requests/useRequestActions.ts
'use client'

import { useMemo, useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  employeeRequestService,
  type RequestActionType,
} from '@/services/employee-request-service'
import { rejectReasonSchema } from '@/validations/request-action.schema'
import type { Request } from './requests-constants'

export interface UseRequestActionsReturn {
  approveTarget: Request | null
  rejectTarget: Request | null
  isRejectDialogOpen: boolean
  isSubmitting: boolean
  rejectReason: string
  rejectReasonError: string | null
  isRejectReasonValid: boolean
  setRejectReason: (reason: string) => void
  handleApprove: (request: Request) => void
  handleOpenReject: (request: Request) => void
  handleCloseApprove: () => void
  handleCloseReject: () => void
  handleConfirmApprove: () => Promise<void>
  handleConfirmReject: () => Promise<void>
}

export function useRequestActions(onSuccess: () => void): UseRequestActionsReturn {
  const [approveTarget, setApproveTarget] = useState<Request | null>(null)
  const [rejectTarget, setRejectTarget] = useState<Request | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rejectReason, setRejectReasonState] = useState('')
  const [rejectReasonError, setRejectReasonError] = useState<string | null>(null)

  const isRejectReasonValid = useMemo(
    () => rejectReasonSchema.safeParse({ reason: rejectReason }).success,
    [rejectReason],
  )

  const setRejectReason = useCallback((reason: string): void => {
    setRejectReasonState(reason)
    if (rejectReasonError) setRejectReasonError(null)
  }, [rejectReasonError])

  const handleApprove = useCallback((request: Request) => {
    setApproveTarget(request)
    setRejectTarget(null)
    setRejectReasonState('')
    setRejectReasonError(null)
    setIsRejectDialogOpen(false)
  }, [])

  const handleOpenReject = useCallback((request: Request) => {
    setRejectTarget(request)
    setApproveTarget(null)
    setRejectReasonState('')
    setRejectReasonError(null)
    setIsRejectDialogOpen(true)
  }, [])

  const handleCloseApprove = useCallback(() => {
    setApproveTarget(null)
  }, [])

  const handleCloseReject = useCallback(() => {
    setIsRejectDialogOpen(false)
    setRejectReasonState('')
    setRejectReasonError(null)
    setRejectTarget(null)
  }, [])

  const handleConfirmApprove = useCallback(async () => {
    if (!approveTarget) return

    setIsSubmitting(true)
    try {
      await employeeRequestService.approveRequest(
        approveTarget.type as RequestActionType,
        approveTarget.backendId
      )
      toast.success('Request approved successfully')
      setApproveTarget(null)
      onSuccess()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to approve request'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [approveTarget, onSuccess])

  const handleConfirmReject = useCallback(async () => {
    if (!rejectTarget) return

    const parsed = rejectReasonSchema.safeParse({ reason: rejectReason })
    if (!parsed.success) {
      setRejectReasonError(parsed.error.flatten().fieldErrors.reason?.[0] ?? 'Invalid rejection reason')
      return
    }

    setRejectReasonError(null)
    setIsSubmitting(true)
    try {
      await employeeRequestService.rejectRequest(
        rejectTarget.type as RequestActionType,
        rejectTarget.backendId,
        parsed.data.reason
      )
      toast.success('Request rejected')
      handleCloseReject()
      onSuccess()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to reject request'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [rejectTarget, rejectReason, handleCloseReject, onSuccess])

  return {
    approveTarget,
    rejectTarget,
    isRejectDialogOpen,
    isSubmitting,
    rejectReason,
    rejectReasonError,
    isRejectReasonValid,
    setRejectReason,
    handleApprove,
    handleOpenReject,
    handleCloseApprove,
    handleCloseReject,
    handleConfirmApprove,
    handleConfirmReject,
  }
}
