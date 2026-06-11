// components/payroll/usePayrollDashboard.ts
'use client'

import { useEffect, useRef, useState } from 'react'
import { payrollService } from '@/services/payroll-service'
import type { PayrollDashboardData } from '@/types/payroll'

const EMPTY_DASHBOARD: PayrollDashboardData = {
  kpis: { totalPayroll: 0, totalDeductions: 0, netPayout: 0, employeeCount: 0 },
  trends: [],
}

export interface UsePayrollDashboardProps {
  month: number
  year: number
  reloadToken?: number
}

export interface UsePayrollDashboardReturn {
  dashboard: PayrollDashboardData
  isDashboardLoading: boolean
  dashboardHasError: boolean
}

export function usePayrollDashboard({
  month,
  year,
  reloadToken = 0,
}: UsePayrollDashboardProps): UsePayrollDashboardReturn {
  const [dashboard, setDashboard] = useState<PayrollDashboardData>(EMPTY_DASHBOARD)
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)
  const [dashboardHasError, setDashboardHasError] = useState(false)
  const fetchIdRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    const load = async () => {
      setIsDashboardLoading(true)
      setDashboardHasError(false)
      try {
        const result = await payrollService.getDashboard(month, year, controller.signal)
        if (fetchId !== fetchIdRef.current) return
        setDashboard(result)
      } catch {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setDashboard(EMPTY_DASHBOARD)
        setDashboardHasError(true)
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsDashboardLoading(false)
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [month, year, reloadToken])

  return { dashboard, isDashboardLoading, dashboardHasError }
}
