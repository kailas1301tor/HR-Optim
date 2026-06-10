// components/attendance/useAttendanceSheet.ts
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { formatApiDate, parseApiDate } from '@/lib/helpers/format-api-date'
import { downloadBlob } from '@/lib/helpers/download-blob'
import { attendanceService } from '@/services/attendance-service'
import { shiftService, type FrontendShift } from '@/services/shift-service'
import {
  EMPTY_STATUS_COUNTS,
  type AttendanceRecord,
  type AttendanceStatusCounts,
} from './attendance-constants'

const SEARCH_DEBOUNCE_MS = 300

export interface UseAttendanceSheetReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedDate: Date
  shiftFilter: string
  setShiftFilter: (value: string) => void
  records: AttendanceRecord[]
  statusCounts: AttendanceStatusCounts
  shifts: FrontendShift[]
  isLoading: boolean
  isExporting: boolean
  hasError: boolean
  formatDate: (date: Date) => string
  navigateDate: (days: number) => void
  setSelectedDate: (date: Date) => void
  handleExport: () => Promise<void>
  handleRetry: () => void
  handleClearFilters: () => void
}

export function useAttendanceSheet(): UseAttendanceSheetReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const dateParam = searchParams.get('date') || formatApiDate(new Date())
  const shiftParam = searchParams.get('shift') || 'all'
  const urlSearchQuery = searchParams.get('search') || ''

  const selectedDate = useMemo(() => parseApiDate(dateParam) ?? new Date(), [dateParam])

  const [localSearch, setLocalSearch] = useState(urlSearchQuery)
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [statusCounts, setStatusCounts] = useState<AttendanceStatusCounts>(EMPTY_STATUS_COUNTS)
  const [shifts, setShifts] = useState<FrontendShift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

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

  const listParams = useMemo(
    () => ({
      date: dateParam,
      ...(shiftParam !== 'all' ? { shift: Number(shiftParam) } : {}),
      ...(urlSearchQuery ? { search: urlSearchQuery } : {}),
    }),
    [dateParam, shiftParam, urlSearchQuery],
  )

  useEffect(() => {
    setLocalSearch(urlSearchQuery)
  }, [urlSearchQuery])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== urlSearchQuery) {
        updateQueryParams({ search: localSearch || null })
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(handler)
  }, [localSearch, urlSearchQuery, updateQueryParams])

  useEffect(() => {
    const controller = new AbortController()

    async function loadShifts(): Promise<void> {
      try {
        const data = await shiftService.getShifts(controller.signal)
        if (!controller.signal.aborted) setShifts(data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        console.warn('Failed to load shifts for attendance filter:', err)
      }
    }

    loadShifts()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadAttendance(): Promise<void> {
      setIsLoading(true)
      setHasError(false)

      try {
        const [list, counts] = await Promise.all([
          attendanceService.getList(listParams, controller.signal),
          attendanceService.getStatusCounts(listParams, controller.signal),
        ])

        if (controller.signal.aborted) return

        setRecords(list)
        setStatusCounts(counts)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setHasError(true)
        setRecords([])
        setStatusCounts(EMPTY_STATUS_COUNTS)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadAttendance()
    return () => controller.abort()
  }, [listParams, reloadToken])

  const formatDate = (date: Date): string =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const setSelectedDate = (date: Date): void => {
    updateQueryParams({ date: formatApiDate(date) })
  }

  const navigateDate = (days: number): void => {
    const nextDate = new Date(selectedDate)
    nextDate.setDate(nextDate.getDate() + days)
    setSelectedDate(nextDate)
  }

  const setShiftFilter = (value: string): void => {
    updateQueryParams({ shift: value === 'all' ? null : value })
  }

  const handleExport = async (): Promise<void> => {
    setIsExporting(true)
    try {
      const { blob, filename } = await attendanceService.exportExcel(listParams)
      downloadBlob(blob, filename)
      toast.success('Attendance exported successfully')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to export attendance'
      toast.error(message)
    } finally {
      setIsExporting(false)
    }
  }

  const handleRetry = (): void => {
    setReloadToken((prev) => prev + 1)
  }

  const handleClearFilters = (): void => {
    setLocalSearch('')
    updateQueryParams({ search: null, shift: null })
  }

  return {
    searchQuery: localSearch,
    setSearchQuery: setLocalSearch,
    selectedDate,
    shiftFilter: shiftParam,
    setShiftFilter,
    records,
    statusCounts,
    shifts,
    isLoading,
    isExporting,
    hasError,
    formatDate,
    navigateDate,
    setSelectedDate,
    handleExport,
    handleRetry,
    handleClearFilters,
  }
}
