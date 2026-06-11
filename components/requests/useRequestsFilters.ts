// components/requests/useRequestsFilters.ts
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type {
  RequestListParams,
  RequestStatusFilter,
  RequestTypeFilter,
} from '@/types/request'
import { getTypesToFetch, REQUEST_PAGE_SIZE, REQUEST_TYPES, type RequestType } from '@/types/request'
import { uiStatusToApiFilter } from '@/lib/mappers/request-mapper'

const SEARCH_DEBOUNCE_MS = 300

export interface UseRequestsFiltersReturn {
  searchQuery: string
  localSearch: string
  setLocalSearch: (query: string) => void
  statusFilter: RequestStatusFilter
  typeFilter: RequestTypeFilter
  employeeFilter: number | null
  pageParam: number
  typesToFetch: ReturnType<typeof getTypesToFetch>
  isSearchClientScoped: boolean
  listParams: RequestListParams
  updateQueryParams: (updates: Record<string, string | null>) => void
  setStatusFilter: (status: RequestStatusFilter) => void
  setTypeFilter: (type: RequestTypeFilter) => void
  setEmployeeFilter: (employeeId: number | null) => void
  handleClearFilters: () => void
}

export function useRequestsFilters(): UseRequestsFiltersReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const rawStatus = searchParams.get('status')
  const statusFilter: RequestStatusFilter =
    rawStatus === 'all' || rawStatus === 'pending' || rawStatus === 'approved' || rawStatus === 'rejected'
      ? rawStatus
      : 'pending'
  const rawType = searchParams.get('type')
  const typeFilter: RequestTypeFilter =
    rawType && REQUEST_TYPES.includes(rawType as RequestType)
      ? (rawType as RequestType)
      : 'all'
  const searchQuery = searchParams.get('search') || ''
  const employeeIdParam = searchParams.get('employee_id')
  const parsedEmployeeId = employeeIdParam ? Number(employeeIdParam) : NaN
  const employeeFilter =
    employeeIdParam && !Number.isNaN(parsedEmployeeId) && parsedEmployeeId > 0
      ? parsedEmployeeId
      : null
  const pageParam = Math.max(1, Number(searchParams.get('page')) || 1)

  const [localSearch, setLocalSearch] = useState(searchQuery)

  const typesToFetch = useMemo(() => getTypesToFetch(typeFilter), [typeFilter])

  const listParams = useMemo<RequestListParams>(() => {
    const params: RequestListParams = {
      page: pageParam,
      page_size: REQUEST_PAGE_SIZE,
    }
    const apiStatus = uiStatusToApiFilter(statusFilter)
    if (apiStatus) params.status = apiStatus
    if (employeeFilter !== null) params.employee_id = employeeFilter
    return params
  }, [pageParam, statusFilter, employeeFilter])

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const nextParams = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all') {
          nextParams.delete(key)
        } else {
          nextParams.set(key, value)
        }
      })
      router.replace(`${pathname}?${nextParams.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const setStatusFilter = useCallback(
    (status: RequestStatusFilter) => {
      updateQueryParams({
        status: status === 'pending' ? null : status,
        page: '1',
      })
    },
    [updateQueryParams]
  )

  const setTypeFilter = useCallback(
    (type: RequestTypeFilter) => {
      updateQueryParams({ type: type === 'all' ? null : type, page: '1' })
    },
    [updateQueryParams]
  )

  const setEmployeeFilter = useCallback(
    (employeeId: number | null) => {
      updateQueryParams({
        employee_id: employeeId !== null ? String(employeeId) : null,
        page: '1',
      })
    },
    [updateQueryParams]
  )

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        updateQueryParams({ search: localSearch || null, page: '1' })
      }
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handler)
  }, [localSearch, searchQuery, updateQueryParams])

  const handleClearFilters = useCallback(() => {
    setLocalSearch('')
    updateQueryParams({ search: null, type: null, employee_id: null, status: null, page: null })
  }, [updateQueryParams])

  return {
    searchQuery,
    localSearch,
    setLocalSearch,
    statusFilter,
    typeFilter,
    employeeFilter,
    pageParam,
    typesToFetch,
    isSearchClientScoped: true,
    listParams,
    updateQueryParams,
    setStatusFilter,
    setTypeFilter,
    setEmployeeFilter,
    handleClearFilters,
  }
}
