// components/attendance/useAttendanceFilters.ts
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { formatApiDate, parseApiDate } from '@/lib/helpers/format-api-date'
import type { AttendanceListParams } from '@/services/attendance-service'

const SEARCH_DEBOUNCE_MS = 300

export interface UseAttendanceFiltersReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedDate: Date
  shiftFilter: string
  setShiftFilter: (value: string) => void
  listParams: AttendanceListParams
  formatDisplayDate: (date: Date) => string
  navigateDate: (days: number) => void
  setSelectedDate: (date: Date) => void
  handleClearFilters: () => void
}

export function useAttendanceFilters(): UseAttendanceFiltersReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const dateParam = searchParams.get('date') || formatApiDate(new Date())
  const rawShiftParam = searchParams.get('shift') || 'all'
  const urlSearchQuery = searchParams.get('search') || ''

  const shiftParam = useMemo(() => {
    if (rawShiftParam === 'all') return 'all'
    const shiftId = Number(rawShiftParam)
    return Number.isFinite(shiftId) ? rawShiftParam : 'all'
  }, [rawShiftParam])

  const selectedDate = useMemo(() => parseApiDate(dateParam) ?? new Date(), [dateParam])
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
      router.replace(`${pathname}?${nextParams.toString()}`)
    },
    [pathname, router, searchParams],
  )

  const listParams = useMemo<AttendanceListParams>(() => {
    const shiftId = shiftParam !== 'all' ? Number(shiftParam) : undefined
    return {
      date: dateParam,
      ...(shiftId !== undefined && Number.isFinite(shiftId) ? { shift: shiftId } : {}),
      ...(urlSearchQuery ? { search: urlSearchQuery } : {}),
    }
  }, [dateParam, shiftParam, urlSearchQuery])

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
    listParams,
    formatDisplayDate,
    navigateDate,
    setSelectedDate,
    handleClearFilters,
  }
}
