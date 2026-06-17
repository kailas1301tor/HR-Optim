// components/payroll/usePayrollList.ts
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PayPeriod } from '@/lib/helpers/payroll-period'
import { payrollService } from '@/services/payroll-service'
import type { PayrollListParams, PayrollRecord } from '@/types/payroll'
import { PAYROLL_LIST_PAGE_SIZE, PAYROLL_TABLE_PAGE_SIZE } from '@/types/payroll'

export interface UsePayrollListProps {
  listParams: PayrollListParams
  payPeriod: PayPeriod
  searchQuery: string
  page: number
  reloadToken?: number
}

export interface UsePayrollListReturn {
  records: PayrollRecord[]
  filteredRecords: PayrollRecord[]
  paginatedRecords: PayrollRecord[]
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  totalCount: number
  totalPages: number
  currentPage: number
  selectedIds: Set<number>
  toggleSelected: (id: number) => void
  toggleSelectAll: () => void
  clearSelection: () => void
  isAllSelected: boolean
  hasSelectableRows: boolean
  reload: () => void
}

async function fetchAllPayrollPages(
  params: PayrollListParams,
  signal: AbortSignal,
): Promise<PayrollRecord[]> {
  const first = await payrollService.listPayrolls(
    { ...params, page: 1, page_size: PAYROLL_LIST_PAGE_SIZE },
    signal,
  )

  let all = first.data
  if (first.total_pages <= 1) return all

  const pageFetches = Array.from({ length: first.total_pages - 1 }, (_, index) =>
    payrollService.listPayrolls(
      { ...params, page: index + 2, page_size: PAYROLL_LIST_PAGE_SIZE },
      signal,
    ),
  )
  const pages = await Promise.all(pageFetches)
  pages.forEach((result) => {
    all = all.concat(result.data)
  })
  return all
}

function matchesPayPeriod(record: PayrollRecord, payPeriod: PayPeriod): boolean {
  return record.startDate === payPeriod.start_date && record.endDate === payPeriod.end_date
}

export function usePayrollList({
  listParams,
  payPeriod,
  searchQuery,
  page,
  reloadToken = 0,
}: UsePayrollListProps): UsePayrollListReturn {
  const [records, setRecords] = useState<PayrollRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [internalReloadToken, setInternalReloadToken] = useState(0)

  const fetchIdRef = useRef(0)

  const reload = useCallback(() => {
    setInternalReloadToken((token) => token + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    const load = async () => {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage(null)

      try {
        const allRecords = await fetchAllPayrollPages(listParams, controller.signal)
        if (fetchId !== fetchIdRef.current) return
        setRecords(allRecords)
      } catch (error: unknown) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setRecords([])
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load payroll')
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [listParams, reloadToken, internalReloadToken])

  useEffect(() => {
    setSelectedIds(new Set())
  }, [
    payPeriod.start_date,
    payPeriod.end_date,
    listParams.employee_id,
    listParams.status,
    page,
    searchQuery,
  ])

  const periodRecords = useMemo(
    () => records.filter((record) => matchesPayPeriod(record, payPeriod)),
    [records, payPeriod],
  )

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return periodRecords
    return periodRecords.filter(
      (record) =>
        record.employeeName.toLowerCase().includes(query) ||
        record.employeeId.toLowerCase().includes(query) ||
        record.department.toLowerCase().includes(query),
    )
  }, [periodRecords, searchQuery])

  const totalCount = filteredRecords.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAYROLL_TABLE_PAGE_SIZE))

  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * PAYROLL_TABLE_PAGE_SIZE
    return filteredRecords.slice(start, start + PAYROLL_TABLE_PAGE_SIZE)
  }, [filteredRecords, page])

  const selectableIds = useMemo(
    () => paginatedRecords.filter((record) => record.canFinalize).map((record) => record.id),
    [paginatedRecords],
  )

  const hasSelectableRows = selectableIds.length > 0

  const isAllSelected =
    hasSelectableRows && selectableIds.every((id) => selectedIds.has(id))

  const toggleSelected = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (selectableIds.every((id) => prev.has(id))) {
        return new Set()
      }
      return new Set(selectableIds)
    })
  }, [selectableIds])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  return {
    records,
    filteredRecords,
    paginatedRecords,
    isLoading,
    hasError,
    errorMessage,
    totalCount,
    totalPages,
    currentPage: page,
    selectedIds,
    toggleSelected,
    toggleSelectAll,
    clearSelection,
    isAllSelected,
    hasSelectableRows,
    reload,
  }
}
