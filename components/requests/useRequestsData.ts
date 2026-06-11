// components/requests/useRequestsData.ts
'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import { fetchRequestsByType } from '@/services/employee-request-service'
import {
  mapLeaveRequest,
  mapSalaryAdvanceRequest,
  mapLoanRequest,
  mapDocumentRequest,
} from '@/lib/mappers/request-mapper'
import { statusConfig } from './requests-constants'
import type { Request, RequestStatus, RequestStatusFilter, RequestType } from '@/types/request'
import { ALL_STATUS_FETCH_CAP, REQUEST_PAGE_SIZE } from '@/types/request'

const STATUS_KEYS: RequestStatus[] = ['pending', 'approved', 'rejected']

function mapRecordToRequest(type: RequestType, record: unknown): Request {
  switch (type) {
    case 'leave':
      return mapLeaveRequest(record as Parameters<typeof mapLeaveRequest>[0])
    case 'salary-advance':
      return mapSalaryAdvanceRequest(record as Parameters<typeof mapSalaryAdvanceRequest>[0])
    case 'loan':
      return mapLoanRequest(record as Parameters<typeof mapLoanRequest>[0])
    case 'document':
      return mapDocumentRequest(record as Parameters<typeof mapDocumentRequest>[0])
    default:
      throw new Error(`Unknown request type: ${type}`)
  }
}

interface FetchResult {
  requests: Request[]
  isListCapped: boolean
  usesServerPagination: boolean
  totalPages: number
}

async function fetchRequests(
  status: RequestStatusFilter,
  types: RequestType[],
  employeeId: number | null,
  page: number,
  signal: AbortSignal
): Promise<FetchResult> {
  const usesServerPagination = status !== 'all' && types.length === 1

  if (usesServerPagination) {
    const params = {
      status: statusConfig[status].apiValue,
      page,
      page_size: REQUEST_PAGE_SIZE,
      ...(employeeId !== null ? { employee_id: employeeId } : {}),
    }
    const res = await fetchRequestsByType(types[0], params, signal)
    const requests = res.data.map((record) => mapRecordToRequest(types[0], record))
    return {
      requests,
      isListCapped: res.total_count > res.data.length,
      usesServerPagination: true,
      totalPages: res.total_pages,
    }
  }

  let isListCapped = false
  type RawItem = { created_at: string; request: Request }
  const rawItems: RawItem[] = []

  const statusesToFetch: RequestStatus[] = status === 'all' ? STATUS_KEYS : [status]

  for (const statusKey of statusesToFetch) {
    const params = {
      status: statusConfig[statusKey].apiValue,
      page_size: ALL_STATUS_FETCH_CAP,
      page: 1,
      ...(employeeId !== null ? { employee_id: employeeId } : {}),
    }

    const batches = await Promise.all(
      types.map(async (type) => {
        const res = await fetchRequestsByType(type, params, signal)
        if (res.total_count > res.data.length) isListCapped = true
        return res.data.map((record) => ({
          created_at: (record as { created_at: string }).created_at,
          request: mapRecordToRequest(type, record),
        }))
      })
    )
    batches.forEach((batch) => rawItems.push(...batch))
  }

  const sorted = rawItems
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((item) => item.request)

  const seen = new Set<string>()
  const deduped = sorted.filter((r) => {
    if (seen.has(r.id)) return false
    seen.add(r.id)
    return true
  })

  return {
    requests: deduped,
    isListCapped,
    usesServerPagination: false,
    totalPages: 1,
  }
}

export interface UseRequestsDataOptions {
  statusFilter: RequestStatusFilter
  typesToFetch: RequestType[]
  employeeFilter: number | null
  pageParam: number
  searchQuery: string
  reloadToken: number
}

export interface UseRequestsDataReturn {
  paginatedRequests: Request[]
  isLoading: boolean
  hasError: boolean
  isListCapped: boolean
  totalPages: number
}

export function useRequestsData({
  statusFilter,
  typesToFetch,
  employeeFilter,
  pageParam,
  searchQuery,
  reloadToken,
}: UseRequestsDataOptions): UseRequestsDataReturn {
  const [requests, setRequests] = useState<Request[]>([])
  const [isListCapped, setIsListCapped] = useState(false)
  const [usesServerPagination, setUsesServerPagination] = useState(false)
  const [serverTotalPages, setServerTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const fetchIdRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    async function loadRequests(): Promise<void> {
      setIsLoading(true)
      setHasError(false)
      try {
        const result = await fetchRequests(
          statusFilter,
          typesToFetch,
          employeeFilter,
          pageParam,
          controller.signal
        )
        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return
        setRequests(result.requests)
        setIsListCapped(result.isListCapped)
        setUsesServerPagination(result.usesServerPagination)
        setServerTotalPages(result.totalPages)
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        setHasError(true)
        toast.error('Failed to load requests')
        setRequests([])
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void loadRequests()
    return () => controller.abort()
  }, [statusFilter, typesToFetch, employeeFilter, pageParam, reloadToken])

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

  const totalPages = useMemo(() => {
    if (usesServerPagination) return serverTotalPages
    return Math.max(1, Math.ceil(filteredRequests.length / REQUEST_PAGE_SIZE))
  }, [usesServerPagination, serverTotalPages, filteredRequests.length])

  const paginatedRequests = useMemo(() => {
    if (usesServerPagination) return filteredRequests
    const start = (pageParam - 1) * REQUEST_PAGE_SIZE
    return filteredRequests.slice(start, start + REQUEST_PAGE_SIZE)
  }, [usesServerPagination, filteredRequests, pageParam])

  return {
    paginatedRequests,
    isLoading,
    hasError,
    isListCapped,
    totalPages,
  }
}
