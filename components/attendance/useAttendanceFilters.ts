// components/attendance/useAttendanceFilters.ts
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { isValid } from 'date-fns'
import { formatApiDate, parseApiDate } from '@/lib/helpers/format-api-date'
import { isAttendanceRangeMode } from '@/types/attendance'
import type { AttendanceListParams } from '@/services/attendance-service'

const SEARCH_DEBOUNCE_MS = 300

function resolveDateParam(param: string): Date {
  const parsed = parseApiDate(param)
  return parsed && isValid(parsed) ? parsed : new Date()
}

function clampDateRange(start: Date, end: Date): { start: Date; end: Date } {
  if (end < start) return { start, end: start }
  return { start, end }
}

export interface UseAttendanceFiltersReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  startDate: Date
  endDate: Date
  isRangeMode: boolean
  shiftFilter: string
  setShiftFilter: (value: string) => void
  listParams: AttendanceListParams
  formatDisplayDate: (date: Date) => string
  formatDateRangeLabel: () => string
  navigatePeriod: (direction: -1 | 1) => void
  setDateRange: (start: Date, end: Date) => void
  setToday: () => void
  handleClearFilters: () => void
}

export function useAttendanceFilters(): UseAttendanceFiltersReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const legacyDateParam = searchParams.get('date')
  const startDateParam =
    searchParams.get('start_date') || legacyDateParam || formatApiDate(new Date())
  const endDateParam =
    searchParams.get('end_date') || legacyDateParam || formatApiDate(new Date())
  const rawShiftParam = searchParams.get('shift') || 'all'
  const urlSearchQuery = searchParams.get('search') || ''

  const shiftParam = useMemo(() => {
    if (rawShiftParam === 'all') return 'all'
    const shiftId = Number(rawShiftParam)
    return Number.isFinite(shiftId) ? rawShiftParam : 'all'
  }, [rawShiftParam])

  const startDate = useMemo(() => resolveDateParam(startDateParam), [startDateParam])
  const endDate = useMemo(() => resolveDateParam(endDateParam), [endDateParam])
  const isRangeMode = isAttendanceRangeMode(startDateParam, endDateParam)
  const [localSearch, setLocalSearch] = useState(urlSearchQuery)

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
      nextParams.delete('date')
      router.replace(`${pathname}?${nextParams.toString()}`)
    },
    [pathname, router, searchParams],
  )

  const listParams = useMemo<AttendanceListParams>(() => {
    const shiftId = shiftParam !== 'all' ? Number(shiftParam) : undefined
    return {
      start_date: startDateParam,
      end_date: endDateParam,
      ...(shiftId !== undefined && Number.isFinite(shiftId) ? { shift: shiftId } : {}),
      ...(urlSearchQuery ? { search: urlSearchQuery } : {}),
    }
  }, [startDateParam, endDateParam, shiftParam, urlSearchQuery])

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

  const formatDisplayDate = (date: Date): string =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const formatDateRangeLabel = (): string => {
    if (!isRangeMode) return formatDisplayDate(startDate)

    const startLabel = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    const endLabel = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    const dayCount =
      Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    return `${startLabel} – ${endLabel} (${dayCount} days)`
  }

  const setDateRange = (start: Date, end: Date): void => {
    if (!isValid(start) || !isValid(end)) return

    const clamped = clampDateRange(start, end)
    updateQueryParams({
      start_date: formatApiDate(clamped.start),
      end_date: formatApiDate(clamped.end),
    })
  }

  const setToday = (): void => {
    const today = new Date()
    setDateRange(today, today)
  }

  const navigatePeriod = (direction: -1 | 1): void => {
    const rangeDays = isRangeMode
      ? Math.max(
          1,
          Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        )
      : 1

    const nextStart = new Date(startDate)
    const nextEnd = new Date(endDate)
    nextStart.setDate(nextStart.getDate() + direction * rangeDays)
    nextEnd.setDate(nextEnd.getDate() + direction * rangeDays)
    setDateRange(nextStart, nextEnd)
  }

  const setShiftFilter = (value: string): void => {
    updateQueryParams({ shift: value === 'all' ? null : value })
  }

  const handleClearFilters = (): void => {
    setLocalSearch('')
    updateQueryParams({ search: null, shift: null })
  }

  return {
    searchQuery: localSearch,
    setSearchQuery: setLocalSearch,
    startDate,
    endDate,
    isRangeMode,
    shiftFilter: shiftParam,
    setShiftFilter,
    listParams,
    formatDisplayDate,
    formatDateRangeLabel,
    navigatePeriod,
    setDateRange,
    setToday,
    handleClearFilters,
  }
}
