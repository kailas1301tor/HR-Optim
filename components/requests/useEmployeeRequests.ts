// components/requests/useEmployeeRequests.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { employeeSelfService } from '@/services/employee-self-service'
import { invalidateClientFetch } from '@/lib/helpers/client-fetch-lifecycle'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import {
  mapLeaveRequest,
  mapSalaryAdvanceRequest,
  mapLoanRequest,
  mapDocumentRequest,
} from '@/lib/mappers/request-mapper'
import { mapDashboardAllRequest } from '@/lib/mappers/employee-self-service-mapper'
import type { Request } from '@/types/request'

export type EmployeeRequestTab = 'all' | 'leave' | 'salary-advance' | 'loan' | 'document'

export interface UseEmployeeRequestsReturn {
  requests: Request[]
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  reload: () => void
}

export function useEmployeeRequests(options: {
  employeeProfileId: number | null
  activeTab: EmployeeRequestTab
  enabled: boolean
}): UseEmployeeRequestsReturn {
  const { employeeProfileId, activeTab, enabled } = options
  const [requests, setRequests] = useState<Request[]>([])
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
      setRequests([])
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
        const scopedParams = { employeeId: profileId, signal: controller.signal }

        if (activeTab === 'all') {
          const allItems = await employeeSelfService.getAllRequests(scopedParams)
          if (fetchId !== fetchIdRef.current) return
          const mapped = allItems.map(mapDashboardAllRequest)
          mapped.sort((a, b) => {
            const dateA = a?.submittedAt ? new Date(a.submittedAt).getTime() : 0
            const dateB = b?.submittedAt ? new Date(b.submittedAt).getTime() : 0
            return dateB - dateA
          })
          setRequests(mapped)
          return
        }

        if (activeTab === 'leave') {
          const res = await employeeSelfService.getLeaveRequests(scopedParams)
          if (fetchId !== fetchIdRef.current) return
          setRequests((Array.isArray(res) ? res : []).map(mapLeaveRequest))
          return
        }

        if (activeTab === 'salary-advance') {
          const res = await employeeSelfService.getSalaryAdvanceRequests(scopedParams)
          if (fetchId !== fetchIdRef.current) return
          setRequests((Array.isArray(res) ? res : []).map(mapSalaryAdvanceRequest))
          return
        }

        if (activeTab === 'loan') {
          const res = await employeeSelfService.getLoanRequests(scopedParams)
          if (fetchId !== fetchIdRef.current) return
          setRequests((Array.isArray(res) ? res : []).map(mapLoanRequest))
          return
        }

        if (activeTab === 'document') {
          const res = await employeeSelfService.getDocumentRequests(scopedParams)
          if (fetchId !== fetchIdRef.current) return
          setRequests((Array.isArray(res) ? res : []).map(mapDocumentRequest))
        }
      } catch (error: unknown) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setRequests([])
        setHasError(true)
        setErrorMessage(getApiErrorMessage(error, 'Failed to load requests. Please try again.'))
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => invalidateClientFetch(fetchIdRef, controller)
  }, [activeTab, employeeProfileId, enabled, reloadToken])

  return { requests, isLoading, hasError, errorMessage, reload }
}
