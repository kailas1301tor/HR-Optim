// components/dashboard/useEmployeeDashboard.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  invalidateClientFetch,
  shouldFinalizeClientFetch,
} from '@/lib/helpers/client-fetch-lifecycle'
import { employeeSelfService } from '@/services/employee-self-service'
import type { EmployeeDashboardData } from '@/types/dashboard'

const EMPTY_EMPLOYEE_DASHBOARD: EmployeeDashboardData = {
  kpis: [],
  attendanceOverview: [],
  documentExpiry: [],
  pendingRequests: [],
}

export interface UseEmployeeDashboardReturn {
  data: EmployeeDashboardData
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  reload: () => void
}

export function useEmployeeDashboard(options: {
  employeeProfileId: number | null
  enabled: boolean
}): UseEmployeeDashboardReturn {
  const { employeeProfileId, enabled } = options
  const [data, setData] = useState<EmployeeDashboardData>(EMPTY_EMPLOYEE_DASHBOARD)
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
      setIsLoading(!enabled ? true : false)
      setHasError(false)
      setErrorMessage(null)
      setData(EMPTY_EMPLOYEE_DASHBOARD)
      return
    }

    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    const load = async () => {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage(null)

      try {
        const result = await employeeSelfService.getEmployeeDashboard(
          employeeProfileId,
          controller.signal,
        )
        if (fetchId !== fetchIdRef.current) return
        setData(result)
      } catch (error: unknown) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setData(EMPTY_EMPLOYEE_DASHBOARD)
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load dashboard')
      } finally {
        if (shouldFinalizeClientFetch({ signal: controller.signal, fetchId, fetchIdRef })) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => invalidateClientFetch(fetchIdRef, controller)
  }, [enabled, employeeProfileId, reloadToken])

  return { data, isLoading, hasError, errorMessage, reload }
}
