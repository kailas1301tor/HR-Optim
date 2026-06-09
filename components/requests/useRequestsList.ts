// components/requests/useRequestsList.ts
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { employeeRequestService } from '@/services/employee-request-service'
import { employeeService } from '@/services/employee-service'
import type { Employee } from '@/components/employees/employee-table'
import {
  mapLeaveRequest,
  mapSalaryAdvanceRequest,
  mapLoanRequest,
  mapDocumentRequest,
} from '@/lib/mappers/request-mapper'
import type { Request, RequestStatus, RequestStatusFilter } from './requests-constants'
import { statusConfig } from './requests-constants'

export type RequestTypeFilter = 'all' | 'leave' | 'document' | 'salary-advance' | 'loan'

export interface StatusCounts {
  pending: number
  approved: number
  rejected: number
}

export interface UseRequestsListReturn {
  filteredRequests: Request[]
  statusCounts: StatusCounts
  isLoading: boolean
  isCountsLoading: boolean
  searchQuery: string
  statusFilter: RequestStatusFilter
  typeFilter: RequestTypeFilter
  expandedRequest: string | null
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: RequestStatusFilter) => void
  setTypeFilter: (type: RequestTypeFilter) => void
  handleToggleExpand: (id: string) => void
  handleApprovePlaceholder: () => void
  handleRejectPlaceholder: () => void
  handleClearFilters: () => void
  reloadRequests: () => void
  reloadCounts: () => void
  employeeFilter: number | null
  employees: Employee[]
  isEmployeesLoading: boolean
  setEmployeeFilter: (employeeId: number | null) => void
}

const REQUEST_TYPES: RequestTypeFilter[] = ['leave', 'document', 'salary-advance', 'loan']
const STATUS_KEYS: RequestStatus[] = ['pending', 'approved', 'rejected']

function getTypesToFetch(typeFilter: RequestTypeFilter): RequestTypeFilter[] {
  if (typeFilter === 'all') return REQUEST_TYPES
  return [typeFilter]
}

function buildListParams(
  status: RequestStatus,
  employeeId: number | null,
  pageSize: number
): { status: string; page_size: number; employee_id?: number } {
  const params: { status: string; page_size: number; employee_id?: number } = {
    status: statusConfig[status].apiValue,
    page_size: pageSize,
  }
  if (employeeId !== null) params.employee_id = employeeId
  return params
}

async function fetchCountForStatus(
  status: RequestStatus,
  types: RequestTypeFilter[],
  employeeId: number | null,
  signal: AbortSignal
): Promise<number> {
  const params = buildListParams(status, employeeId, 1)

  const fetches = types.map((type) => {
    switch (type) {
      case 'leave':
        return employeeRequestService.getLeaveRequests(params, signal)
      case 'salary-advance':
        return employeeRequestService.getSalaryAdvanceRequests(params, signal)
      case 'loan':
        return employeeRequestService.getLoanRequests(params, signal)
      case 'document':
        return employeeRequestService.getDocumentRequests(params, signal)
      default:
        return Promise.resolve({ total_count: 0, data: [] })
    }
  })

  const results = await Promise.all(fetches)
  return results.reduce((sum, r) => sum + r.total_count, 0)
}

async function fetchRequestsForStatus(
  status: RequestStatusFilter,
  types: RequestTypeFilter[],
  employeeId: number | null,
  signal: AbortSignal
): Promise<Request[]> {
  if (status === 'all') {
    const batches = await Promise.all(
      STATUS_KEYS.map((s) => fetchRequestsForStatus(s, types, employeeId, signal))
    )
    const merged = batches.flat()
    const seen = new Set<string>()
    return merged.filter((r) => {
      if (seen.has(r.id)) return false
      seen.add(r.id)
      return true
    })
  }

  const params = buildListParams(status, employeeId, 100)

  type RawItem = { created_at: string; request: Request }

  const rawItems: RawItem[] = []

  const fetchers = types.map(async (type) => {
    switch (type) {
      case 'leave': {
        const res = await employeeRequestService.getLeaveRequests(params, signal)
        return res.data.map((r) => ({ created_at: r.created_at, request: mapLeaveRequest(r) }))
      }
      case 'salary-advance': {
        const res = await employeeRequestService.getSalaryAdvanceRequests(params, signal)
        return res.data.map((r) => ({ created_at: r.created_at, request: mapSalaryAdvanceRequest(r) }))
      }
      case 'loan': {
        const res = await employeeRequestService.getLoanRequests(params, signal)
        return res.data.map((r) => ({ created_at: r.created_at, request: mapLoanRequest(r) }))
      }
      case 'document': {
        const res = await employeeRequestService.getDocumentRequests(params, signal)
        return res.data.map((r) => ({ created_at: r.created_at, request: mapDocumentRequest(r) }))
      }
      default:
        return []
    }
  })

  const results = await Promise.all(fetchers)
  results.forEach((batch) => rawItems.push(...batch))

  return rawItems
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((item) => item.request)
}

export function useRequestsList(): UseRequestsListReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const rawStatus = searchParams.get('status')
  const statusFilter: RequestStatusFilter =
    rawStatus === 'all' || rawStatus === 'pending' || rawStatus === 'approved' || rawStatus === 'rejected'
      ? rawStatus
      : 'pending'
  const typeFilter = (searchParams.get('type') as RequestTypeFilter) || 'all'
  const searchQuery = searchParams.get('search') || ''
  const employeeIdParam = searchParams.get('employee_id')
  const parsedEmployeeId = employeeIdParam ? Number(employeeIdParam) : NaN
  const employeeFilter =
    employeeIdParam && !Number.isNaN(parsedEmployeeId) && parsedEmployeeId > 0
      ? parsedEmployeeId
      : null

  const [requests, setRequests] = useState<Request[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(true)
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isCountsLoading, setIsCountsLoading] = useState(true)
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const nextParams = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
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
    (status: RequestStatusFilter) =>
      updateQueryParams({ status: status === 'pending' ? null : status }),
    [updateQueryParams]
  )

  const setTypeFilter = useCallback(
    (type: RequestTypeFilter) => updateQueryParams({ type: type === 'all' ? null : type }),
    [updateQueryParams]
  )

  const setSearchQuery = useCallback(
    (query: string) => updateQueryParams({ search: query || null }),
    [updateQueryParams]
  )

  const setEmployeeFilter = useCallback(
    (employeeId: number | null) =>
      updateQueryParams({ employee_id: employeeId !== null ? String(employeeId) : null }),
    [updateQueryParams]
  )

  const typesToFetch = useMemo(() => getTypesToFetch(typeFilter), [typeFilter])

  useEffect(() => {
    const controller = new AbortController()

    async function loadEmployees(): Promise<void> {
      setIsEmployeesLoading(true)
      try {
        const response = await employeeService.getEmployees(
          { page_size: 100 },
          controller.signal
        )
        if (controller.signal.aborted) return
        setEmployees(response.data)
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        setEmployees([])
      } finally {
        if (!controller.signal.aborted) setIsEmployeesLoading(false)
      }
    }

    loadEmployees()
    return () => controller.abort()
  }, [])
  const [reloadToken, setReloadToken] = useState(0)

  const reloadCounts = useCallback(() => {
    setReloadToken((prev) => prev + 1)
  }, [])

  const reloadRequests = useCallback(() => {
    setReloadToken((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadCounts(): Promise<void> {
      setIsCountsLoading(true)
      try {
        const counts = await Promise.all(
          STATUS_KEYS.map(async (status) => ({
            status,
            count: await fetchCountForStatus(status, typesToFetch, employeeFilter, controller.signal),
          }))
        )
        if (controller.signal.aborted) return
        const next: StatusCounts = { pending: 0, approved: 0, rejected: 0 }
        counts.forEach(({ status, count }) => {
          next[status] = count
        })
        setStatusCounts(next)
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        toast.error('Failed to load request counts')
      } finally {
        if (!controller.signal.aborted) setIsCountsLoading(false)
      }
    }

    loadCounts()
    return () => controller.abort()
  }, [typesToFetch, employeeFilter, reloadToken])

  useEffect(() => {
    const controller = new AbortController()

    async function loadRequests(): Promise<void> {
      setIsLoading(true)
      try {
        const data = await fetchRequestsForStatus(
          statusFilter,
          typesToFetch,
          employeeFilter,
          controller.signal
        )
        if (controller.signal.aborted) return
        setRequests(data)
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        toast.error('Failed to load requests')
        setRequests([])
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadRequests()
    return () => controller.abort()
  }, [statusFilter, typesToFetch, employeeFilter, reloadToken])

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests
    const q = searchQuery.toLowerCase()
    return requests.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.requester.name.toLowerCase().includes(q)
    )
  }, [requests, searchQuery])

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedRequest((prev) => (prev === id ? null : id))
  }, [])

  const handleApprovePlaceholder = useCallback(() => {
    toast.info('Approval APIs are not available yet. Backend endpoints coming soon.')
  }, [])

  const handleRejectPlaceholder = useCallback(() => {
    toast.info('Rejection APIs are not available yet. Backend endpoints coming soon.')
  }, [])

  const handleClearFilters = useCallback(() => {
    updateQueryParams({ search: null, type: null, employee_id: null })
  }, [updateQueryParams])

  return {
    filteredRequests,
    statusCounts,
    isLoading,
    isCountsLoading,
    searchQuery,
    statusFilter,
    typeFilter,
    expandedRequest,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    handleToggleExpand,
    handleApprovePlaceholder,
    handleRejectPlaceholder,
    handleClearFilters,
    reloadRequests,
    reloadCounts,
    employeeFilter,
    employees,
    isEmployeesLoading,
    setEmployeeFilter,
  }
}
