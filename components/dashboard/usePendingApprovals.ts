// components/dashboard/usePendingApprovals.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchRequestsByType, fetchStatusCountForType } from '@/services/employee-request-service'
import {
  mapDocumentRequest,
  mapLeaveRequest,
  mapLoanRequest,
  mapSalaryAdvanceRequest,
} from '@/lib/mappers/request-mapper'
import { statusConfig } from '@/components/requests/requests-constants'
import type { Request, RequestType } from '@/types/request'
import { REQUEST_TYPES } from '@/types/request'

const PENDING_PREVIEW_LIMIT = 5
const PER_TYPE_FETCH_LIMIT = 5

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

export interface UsePendingApprovalsReturn {
  items: Request[]
  pendingCount: number
  isLoading: boolean
  hasError: boolean
  reload: () => void
}

export function usePendingApprovals(): UsePendingApprovalsReturn {
  const [items, setItems] = useState<Request[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    const load = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        const pendingParams = {
          status: statusConfig.pending.apiValue,
          page: 1,
          page_size: PER_TYPE_FETCH_LIMIT,
        }

        const [counts, batches] = await Promise.all([
          Promise.all(
            REQUEST_TYPES.map((type) =>
              fetchStatusCountForType(type, { ...pendingParams, page_size: 1 }, controller.signal),
            ),
          ),
          Promise.all(
            REQUEST_TYPES.map(async (type) => {
              const result = await fetchRequestsByType(type, pendingParams, controller.signal)
              return result.data.map((record) => ({
                createdAt: (record as { created_at: string }).created_at,
                request: mapRecordToRequest(type, record),
              }))
            }),
          ),
        ])

        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return

        const totalPending = counts.reduce((sum, count) => sum + count, 0)
        const preview = batches
          .flat()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, PENDING_PREVIEW_LIMIT)
          .map((entry) => entry.request)

        setPendingCount(totalPending)
        setItems(preview)
      } catch {
        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return
        setItems([])
        setPendingCount(0)
        setHasError(true)
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [reloadToken])

  return { items, pendingCount, isLoading, hasError, reload }
}
