// components/reports/useReportsData.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { reportsService } from '@/services/reports-service'
import { EMPTY_REPORTS_DATA, type ReportsData } from '@/types/reports'

export interface UseReportsDataReturn {
  data: ReportsData
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  reload: () => void
}

export function useReportsData(options?: { enabled?: boolean }): UseReportsDataReturn {
  const enabled = options?.enabled ?? true
  const [data, setData] = useState<ReportsData>(EMPTY_REPORTS_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  useEffect(() => {
    if (!enabled) {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage(null)
      setData(EMPTY_REPORTS_DATA)
      return
    }

    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    const load = async () => {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage(null)

      try {
        const result = await reportsService.getAllReports(controller.signal)
        if (fetchId !== fetchIdRef.current) return
        setData(result)
      } catch (error: unknown) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setData(EMPTY_REPORTS_DATA)
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load reports')
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [enabled, reloadToken])

  return { data, isLoading, hasError, errorMessage, reload }
}
