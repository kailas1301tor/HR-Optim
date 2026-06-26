// components/requests/useRequestStatusCounts.ts
'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { toast } from 'sonner'
import { fetchStatusCountForType } from '@/services/employee-request-service'
import { statusConfig } from './requests-constants'
import type { RequestStatus, RequestStatusFilter, RequestType, StatusCounts } from '@/types/request'
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
  statusFilter: RequestStatusFilter
  typesToFetch: RequestType[]
  employeeFilter: number | null
  reloadToken: number
  /** Counts already obtained from the data hook — skips redundant API calls */
  preloadedCounts?: Partial<Record<RequestStatus, number>>
  isDataLoading?: boolean
}

export interface UseRequestStatusCountsReturn {
  statusCounts: StatusCounts
  isCountsLoading: boolean
  countsHasError: boolean
}

export function useRequestStatusCounts({
  statusFilter,
  typesToFetch,
  employeeFilter,
  reloadToken,
  preloadedCounts,
  isDataLoading,
}: UseRequestStatusCountsOptions): UseRequestStatusCountsReturn {
  const [fetchedCounts, setFetchedCounts] = useState<StatusCounts>(EMPTY_STATUS_COUNTS)
  const [isOwnFetchLoading, setIsOwnFetchLoading] = useState(true)
  const [countsHasError, setCountsHasError] = useState(false)
  const fetchIdRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    // Reset counts on filter/reload change to avoid showing stale counts
    setFetchedCounts(EMPTY_STATUS_COUNTS)

    // Determine which statuses still need a network call
    // If statusFilter is 'all', all statuses are fetched by useRequestsData, so we fetch nothing.
    // Otherwise, we fetch statuses other than the active statusFilter.
    const statusesToFetch = statusFilter === 'all'
      ? []
      : STATUS_KEYS.filter((s) => s !== statusFilter)

    if (statusesToFetch.length === 0) {
      setIsOwnFetchLoading(false)
      setCountsHasError(false)
      return
    }

    async function loadCounts(): Promise<void> {
      setIsOwnFetchLoading(true)
      setCountsHasError(false)
      try {
        const fetched = await Promise.all(
          statusesToFetch.map(async (status) => ({
            status,
            count: await fetchCountForStatus(status, typesToFetch, employeeFilter, controller.signal),
          }))
        )
        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return
        
        setFetchedCounts((prev) => {
          const next = { ...prev }
          fetched.forEach(({ status, count }) => {
            next[status] = count
          })
          return next
        })
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        setCountsHasError(true)
        toast.error('Failed to load request counts')
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsOwnFetchLoading(false)
        }
      }
    }

    void loadCounts()
    return () => controller.abort()
  }, [typesToFetch, employeeFilter, reloadToken, statusFilter])

  const statusCounts = useMemo(() => {
    const next = { ...EMPTY_STATUS_COUNTS, ...fetchedCounts }
    for (const key of STATUS_KEYS) {
      if (preloadedCounts?.[key] !== undefined) {
        next[key] = preloadedCounts[key]!
      }
    }
    return next
  }, [fetchedCounts, preloadedCounts])

  const isCountsLoading = isOwnFetchLoading || !!isDataLoading

  return { statusCounts, isCountsLoading, countsHasError }
}
