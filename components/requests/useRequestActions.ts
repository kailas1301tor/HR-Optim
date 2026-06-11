// components/requests/useRequestActions.ts
'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  employeeRequestService,
  type RequestActionType,
} from '@/services/employee-request-service'
import type { Request } from './requests-constants'

export interface UseRequestActionsReturn {
  approveTarget: Request | null
  rejectTarget: Request | null
  isRejectDialogOpen: boolean
  isSubmitting: boolean
  rejectReason: string
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
  const [rejectReason, setRejectReason] = useState('')

  const handleApprove = useCallback((request: Request) => {
    setApproveTarget(request)
    setRejectTarget(null)
    setRejectReason('')
    setIsRejectDialogOpen(false)
  }, [])

  const handleOpenReject = useCallback((request: Request) => {
    setRejectTarget(request)
    setApproveTarget(null)
    setRejectReason('')
    setIsRejectDialogOpen(true)
  }, [])

  const handleCloseApprove = useCallback(() => {
    setApproveTarget(null)
  }, [])

  const handleCloseReject = useCallback(() => {
    setIsRejectDialogOpen(false)
    setRejectReason('')
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
    const reason = rejectReason.trim()
    if (!reason) {
      toast.error('Please provide a rejection reason')
      return
    }

    setIsSubmitting(true)
    try {
      await employeeRequestService.rejectRequest(
        rejectTarget.type as RequestActionType,
        rejectTarget.backendId,
        reason
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
    setRejectReason,
    handleApprove,
    handleOpenReject,
    handleCloseApprove,
    handleCloseReject,
    handleConfirmApprove,
    handleConfirmReject,
  }
}
