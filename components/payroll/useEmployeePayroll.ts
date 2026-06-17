// components/payroll/useEmployeePayroll.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { employeeSelfService } from '@/services/employee-self-service'
import { invalidateClientFetch } from '@/lib/helpers/client-fetch-lifecycle'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import { mapBackendPayroll } from '@/lib/mappers/payroll-mapper'
import type { PayrollRecord } from '@/types/payroll'

export interface UseEmployeePayrollReturn {
  payrollHistory: PayrollRecord[]
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  reload: () => void
}

export function useEmployeePayroll(options: {
  employeeProfileId: number | null
  month: number
  year: number
  enabled: boolean
}): UseEmployeePayrollReturn {
  const { employeeProfileId, month, year, enabled } = options
  const [payrollHistory, setPayrollHistory] = useState<PayrollRecord[]>([])
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
      setPayrollHistory([])
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
        const raw = await employeeSelfService.getPayroll({
          employeeId: profileId,
          month,
          year,
          signal: controller.signal,
        })
        if (fetchId !== fetchIdRef.current) return
        const list = Array.isArray(raw) ? raw : []
        const mapped = list.map(mapBackendPayroll)
        mapped.sort((a, b) => {
          const dateA = a?.startDate ? new Date(a.startDate).getTime() : 0
          const dateB = b?.startDate ? new Date(b.startDate).getTime() : 0
          return dateB - dateA
        })
        setPayrollHistory(mapped)
      } catch (error: unknown) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setPayrollHistory([])
        setHasError(true)
        setErrorMessage(getApiErrorMessage(error, 'Failed to load payroll. Please try again.'))
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => invalidateClientFetch(fetchIdRef, controller)
  }, [employeeProfileId, enabled, month, year, reloadToken])

  return { payrollHistory, isLoading, hasError, errorMessage, reload }
}
