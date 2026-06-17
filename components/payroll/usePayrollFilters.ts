// components/payroll/usePayrollFilters.ts
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  formatPayrollMonthLabel,
  getPayPeriodForMonth,
  shiftPayrollMonth,
} from '@/lib/helpers/payroll-period'
import { payrollStatusFilterConfig } from './payroll-constants'
import type { PayrollExportParams, PayrollListParams, PayrollStatusFilter } from '@/types/payroll'
import { PAYROLL_LIST_PAGE_SIZE } from '@/types/payroll'

const SEARCH_DEBOUNCE_MS = 300

const now = new Date()
const DEFAULT_MONTH = now.getMonth() + 1
const DEFAULT_YEAR = now.getFullYear()

const STATUS_KEYS: PayrollStatusFilter[] = ['all', 'processing', 'finalized']

function parseStatusFilter(raw: string | null): PayrollStatusFilter {
  if (raw && STATUS_KEYS.includes(raw as PayrollStatusFilter)) {
    return raw as PayrollStatusFilter
  }
  return 'all'
}

export interface UsePayrollFiltersReturn {
  month: number
  year: number
  page: number
  monthLabel: string
  searchQuery: string
  setSearchQuery: (query: string) => void
  employeeFilter: number | null
  setEmployeeFilter: (employeeId: number | null) => void
  statusFilter: PayrollStatusFilter
  setStatusFilter: (status: PayrollStatusFilter) => void
  listParams: PayrollListParams
  payPeriod: ReturnType<typeof getPayPeriodForMonth>
  navigateMonth: (delta: number) => void
  setPage: (page: number) => void
  exportParams: PayrollExportParams
}

export function usePayrollFilters(): UsePayrollFiltersReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const month = Number(searchParams.get('month')) || DEFAULT_MONTH
  const year = Number(searchParams.get('year')) || DEFAULT_YEAR
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const urlSearch = searchParams.get('search') || ''

  const rawEmployeeId = searchParams.get('employee_id')
  const employeeFilter =
    rawEmployeeId && !Number.isNaN(Number(rawEmployeeId)) ? Number(rawEmployeeId) : null

  const statusFilter = parseStatusFilter(searchParams.get('status'))

  const [searchQuery, setSearchQuery] = useState(urlSearch)

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
    [pathname, router, searchParams],
  )

  useEffect(() => {
    setSearchQuery(urlSearch)
  }, [urlSearch])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchQuery !== urlSearch) {
        updateQueryParams({ search: searchQuery || null })
      }
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [searchQuery, urlSearch, updateQueryParams])

  const navigateMonth = useCallback(
    (delta: number) => {
      const next = shiftPayrollMonth(month, year, delta)
      updateQueryParams({
        month: String(next.month),
        year: String(next.year),
        page: '1',
      })
    },
    [month, year, updateQueryParams],
  )

  const payPeriod = useMemo(() => getPayPeriodForMonth(month, year), [month, year])

  const setPage = useCallback(
    (nextPage: number) => {
      updateQueryParams({ page: nextPage <= 1 ? null : String(nextPage) })
    },
    [updateQueryParams],
  )

  const setEmployeeFilter = useCallback(
    (employeeId: number | null) => {
      updateQueryParams({
        employee_id: employeeId !== null ? String(employeeId) : null,
        page: '1',
      })
    },
    [updateQueryParams],
  )

  const setStatusFilter = useCallback(
    (status: PayrollStatusFilter) => {
      updateQueryParams({
        status: status === 'all' ? null : status,
        page: '1',
      })
    },
    [updateQueryParams],
  )

  const listParams = useMemo<PayrollListParams>(() => {
    const statusApiValue = payrollStatusFilterConfig[statusFilter].apiValue
    return {
      month,
      year,
      page_size: PAYROLL_LIST_PAGE_SIZE,
      ...(employeeFilter !== null ? { employee_id: employeeFilter } : {}),
      ...(statusApiValue ? { status: statusApiValue } : {}),
    }
  }, [employeeFilter, statusFilter, month, year])

  const exportParams = useMemo<PayrollExportParams>(
    () => ({
      month,
      year,
      start_date: payPeriod.start_date,
      end_date: payPeriod.end_date,
      ...(employeeFilter !== null ? { employee_id: employeeFilter } : {}),
      ...(payrollStatusFilterConfig[statusFilter].apiValue
        ? { status: payrollStatusFilterConfig[statusFilter].apiValue }
        : {}),
    }),
    [month, year, payPeriod.start_date, payPeriod.end_date, employeeFilter, statusFilter],
  )

  const monthLabel = useMemo(() => formatPayrollMonthLabel(month, year), [month, year])

  return {
    month,
    year,
    page,
    monthLabel,
    searchQuery,
    setSearchQuery,
    employeeFilter,
    setEmployeeFilter,
    statusFilter,
    setStatusFilter,
    listParams,
    payPeriod,
    navigateMonth,
    setPage,
    exportParams,
  }
}
