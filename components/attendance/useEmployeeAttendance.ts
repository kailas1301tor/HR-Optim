// components/attendance/useEmployeeAttendance.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { employeeSelfService } from '@/services/employee-self-service'
import { invalidateClientFetch } from '@/lib/helpers/client-fetch-lifecycle'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import type { EmployeeAttendanceData } from '@/types/attendance'

export const EMPTY_ATTENDANCE: EmployeeAttendanceData = {
  summary: { present: 0, late: 0, absent: 0, leave: 0, weekend: 0, holiday: 0 },
  days: [],
}

export interface UseEmployeeAttendanceReturn {
  data: EmployeeAttendanceData
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  reload: () => void
}

export function useEmployeeAttendance(options: {
  employeeProfileId: number | null
  month: number
  year: number
  enabled: boolean
}): UseEmployeeAttendanceReturn {
  const { employeeProfileId, month, year, enabled } = options
  const [data, setData] = useState<EmployeeAttendanceData>(EMPTY_ATTENDANCE)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  useEffect(() => {
    if (!enabled || !employeeProfileId) {
      setIsLoading(!enabled)
      setHasError(false)
      setErrorMessage(null)
      setData(EMPTY_ATTENDANCE)
      return
    }

    const profileId = employeeProfileId
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    const load = async () => {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage(null)

      try {
        const result = await employeeSelfService.getAttendance({
          employeeId: profileId,
          month,
          year,
          signal: controller.signal,
        })
        if (fetchId !== fetchIdRef.current) return
        setData(result)
      } catch (error: unknown) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setData(EMPTY_ATTENDANCE)
        setHasError(true)
        setErrorMessage(getApiErrorMessage(error, 'Failed to load attendance. Please try again.'))
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => invalidateClientFetch(fetchIdRef, controller)
  }, [employeeProfileId, enabled, month, year, reloadToken])

  return { data, isLoading, hasError, errorMessage, reload }
}
