// components/requests/useRequestStatusCounts.ts
'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { fetchStatusCountForType } from '@/services/employee-request-service'
import { statusConfig } from './requests-constants'
import type { RequestStatus, RequestType, StatusCounts } from '@/types/request'
import { EMPTY_STATUS_COUNTS } from '@/types/request'

const STATUS_KEYS: RequestStatus[] = ['pending', 'approved', 'rejected']

async function fetchCountForStatus(
  status: RequestStatus,
  types: RequestType[],
  employeeId: number | null,
  signal: AbortSignal
): Promise<number> {
  const params = {
    status: statusConfig[status].apiValue,
    page_size: 1,
    page: 1,
    ...(employeeId !== null ? { employee_id: employeeId } : {}),
  }

  const counts = await Promise.all(
    types.map((type) => fetchStatusCountForType(type, params, signal))
  )
  return counts.reduce((sum, count) => sum + count, 0)
}

interface UseRequestStatusCountsOptions {
  typesToFetch: RequestType[]
  employeeFilter: number | null
  reloadToken: number
}

export interface UseRequestStatusCountsReturn {
  statusCounts: StatusCounts
  isCountsLoading: boolean
  countsHasError: boolean
}

export function useRequestStatusCounts({
  typesToFetch,
  employeeFilter,
  reloadToken,
}: UseRequestStatusCountsOptions): UseRequestStatusCountsReturn {
  const [statusCounts, setStatusCounts] = useState<StatusCounts>(EMPTY_STATUS_COUNTS)
  const [isCountsLoading, setIsCountsLoading] = useState(true)
  const [countsHasError, setCountsHasError] = useState(false)
  const fetchIdRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    async function loadCounts(): Promise<void> {
      setIsCountsLoading(true)
      setCountsHasError(false)
      try {
        const counts = await Promise.all(
          STATUS_KEYS.map(async (status) => ({
            status,
            count: await fetchCountForStatus(status, typesToFetch, employeeFilter, controller.signal),
          }))
        )
        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return
        const next: StatusCounts = { pending: 0, approved: 0, rejected: 0 }
        counts.forEach(({ status, count }) => {
          next[status] = count
        })
        setStatusCounts(next)
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        setCountsHasError(true)
        setStatusCounts(EMPTY_STATUS_COUNTS)
        toast.error('Failed to load request counts')
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsCountsLoading(false)
        }
      }
    }

    void loadCounts()
    return () => controller.abort()
  }, [typesToFetch, employeeFilter, reloadToken])

  return { statusCounts, isCountsLoading, countsHasError }
}
