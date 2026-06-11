// components/attendance/useAttendanceShifts.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { shiftService } from '@/services/shift-service'
import type { FrontendShift } from '@/types/settings'

let cachedShifts: FrontendShift[] | null = null
let inflightRequest: Promise<FrontendShift[]> | null = null

async function fetchShiftsCached(signal?: AbortSignal): Promise<FrontendShift[]> {
  if (cachedShifts) return cachedShifts

  if (!inflightRequest) {
    inflightRequest = shiftService
      .getShifts(signal)
      .then((data) => {
        cachedShifts = data
        return data
      })
      .finally(() => {
        inflightRequest = null
      })
  }

  return inflightRequest
}

export function invalidateAttendanceShifts(): void {
  cachedShifts = null
}

export interface UseAttendanceShiftsReturn {
  shifts: FrontendShift[]
  isLoading: boolean
  hasError: boolean
  reload: () => Promise<void>
}

export function useAttendanceShifts(): UseAttendanceShiftsReturn {
  const [shifts, setShifts] = useState<FrontendShift[]>(cachedShifts ?? [])
  const [isLoading, setIsLoading] = useState(!cachedShifts)
  const [hasError, setHasError] = useState(false)

  const reload = useCallback(async (signal?: AbortSignal) => {
    invalidateAttendanceShifts()
    setIsLoading(true)
    setHasError(false)
    try {
      const data = await fetchShiftsCached(signal)
      if (signal?.aborted) return
      setShifts(data)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setHasError(true)
      setShifts([])
    } finally {
      if (!signal?.aborted) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    reload(controller.signal)
    return () => controller.abort()
  }, [reload])

  return { shifts, isLoading, hasError, reload: () => reload() }
}
