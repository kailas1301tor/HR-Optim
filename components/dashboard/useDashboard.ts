// components/dashboard/useDashboard.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { dashboardService } from '@/services/dashboard-service'
import type { MainDashboardData } from '@/types/dashboard'

const EMPTY_DASHBOARD: MainDashboardData = {
  kpis: [],
  departmentDistribution: [],
  documentExpiry: [],
  attendanceOverview: [],
}

export interface UseDashboardReturn {
  data: MainDashboardData
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  reload: () => void
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<MainDashboardData>(EMPTY_DASHBOARD)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
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
      setErrorMessage(null)

      try {
        const result = await dashboardService.getMainDashboard(controller.signal)
        if (fetchId !== fetchIdRef.current) return
        setData(result)
      } catch (error: unknown) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setData(EMPTY_DASHBOARD)
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load dashboard')
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [reloadToken])

  return { data, isLoading, hasError, errorMessage, reload }
}
