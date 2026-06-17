// components/attendance/useAttendanceShifts.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createModuleCache } from '@/lib/hooks/create-module-cache'
import type { DropdownItem } from '@/lib/types'
import { employeeService } from '@/services/employee-service'

const attendanceShiftsCache = createModuleCache<DropdownItem[]>()

async function fetchShiftsCached(): Promise<DropdownItem[]> {
  return attendanceShiftsCache.fetch(() => employeeService.getShiftsFromDropdowns())
}

export function invalidateAttendanceShifts(): void {
  attendanceShiftsCache.invalidate()
}

export interface UseAttendanceShiftsReturn {
  shifts: DropdownItem[]
  isLoading: boolean
  hasError: boolean
  reload: () => Promise<void>
}

export function useAttendanceShifts(): UseAttendanceShiftsReturn {
  const [shifts, setShifts] = useState<DropdownItem[]>(attendanceShiftsCache.read() ?? [])
  const [isLoading, setIsLoading] = useState(!attendanceShiftsCache.read())
  const [hasError, setHasError] = useState(false)

  const reload = useCallback(async () => {
    invalidateAttendanceShifts()
    setIsLoading(true)
    setHasError(false)
    try {
      const data = await fetchShiftsCached()
      setShifts(data)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setHasError(true)
      setShifts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    const cached = attendanceShiftsCache.read()

    if (cached) {
      setShifts(cached)
      setIsLoading(false)
      return () => {
        active = false
      }
    }

    setIsLoading(true)
    setHasError(false)
    fetchShiftsCached()
      .then((data) => {
        if (active) setShifts(data)
      })
      .catch(() => {
        if (active) {
          setHasError(true)
          setShifts([])
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { shifts, isLoading, hasError, reload }
}
