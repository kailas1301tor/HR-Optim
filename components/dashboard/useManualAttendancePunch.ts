// components/dashboard/useManualAttendancePunch.ts
'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { usePermissions } from '@/components/auth/permissions-provider'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import { getCurrentCoordinates } from '@/lib/helpers/geolocation'
import { attendanceService } from '@/services/attendance-service'
import type { ManualPunchType } from '@/types/attendance'

export interface UseManualAttendancePunchReturn {
  isVisible: boolean
  isPunchIn: boolean
  isPunching: boolean
  locationError: string | null
  checkoutConfirmOpen: boolean
  setCheckoutConfirmOpen: (open: boolean) => void
  handleSlideComplete: () => void
  handleCheckoutConfirm: () => Promise<void>
  handleFallbackPunch: () => void
  clearLocationError: () => void
}

export function useManualAttendancePunch(): UseManualAttendancePunchReturn {
  const {
    isLoading,
    employeeProfileId,
    isManualAttendanceEnabled,
    isPunchIn,
    reloadPermissions,
  } = usePermissions()

  const [isPunching, setIsPunching] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [checkoutConfirmOpen, setCheckoutConfirmOpen] = useState(false)

  const isVisible =
    !isLoading && isManualAttendanceEnabled && employeeProfileId !== null

  const executePunch = useCallback(
    async (punchType: ManualPunchType) => {
      setIsPunching(true)
      setLocationError(null)

      try {
        const { latitude, longitude } = await getCurrentCoordinates()
        await attendanceService.manualPunch({
          punch_type: punchType,
          latitude,
          longitude,
        })

        toast.success(
          punchType === 'in' ? 'Checked in successfully' : 'Checked out successfully',
        )
        reloadPermissions()
      } catch (error: unknown) {
        const message = getApiErrorMessage(
          error,
          punchType === 'in'
            ? 'Failed to check in. Please try again.'
            : 'Failed to check out. Please try again.',
        )
        setLocationError(message)
        toast.error(message)
      } finally {
        setIsPunching(false)
      }
    },
    [reloadPermissions],
  )

  const handleSlideComplete = useCallback(() => {
    if (isPunching) return

    if (isPunchIn) {
      setCheckoutConfirmOpen(true)
      return
    }

    void executePunch('in')
  }, [executePunch, isPunchIn, isPunching])

  const handleCheckoutConfirm = useCallback(async () => {
    setCheckoutConfirmOpen(false)
    await executePunch('out')
  }, [executePunch])

  const handleFallbackPunch = useCallback(() => {
    if (isPunching) return

    if (isPunchIn) {
      setCheckoutConfirmOpen(true)
      return
    }

    void executePunch('in')
  }, [executePunch, isPunchIn, isPunching])

  const clearLocationError = useCallback(() => {
    setLocationError(null)
  }, [])

  return {
    isVisible,
    isPunchIn,
    isPunching,
    locationError,
    checkoutConfirmOpen,
    setCheckoutConfirmOpen,
    handleSlideComplete,
    handleCheckoutConfirm,
    handleFallbackPunch,
    clearLocationError,
  }
}
