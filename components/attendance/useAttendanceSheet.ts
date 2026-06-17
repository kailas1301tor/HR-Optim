// components/attendance/useAttendanceSheet.ts
'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { downloadBlob } from '@/lib/helpers/download-blob'
import {
  attendanceService,
  buildDepartmentAttendanceExportParams,
} from '@/services/attendance-service'
import { ApiError } from '@/lib/api'
import type { AttendanceRecord, AttendanceStatusCounts } from '@/types/attendance'
import { EMPTY_ATTENDANCE_STATUS_COUNTS } from '@/types/attendance'
import { useAttendanceFilters } from './useAttendanceFilters'
import { useAttendanceShifts } from './useAttendanceShifts'

export interface UseAttendanceSheetReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedDate: Date
  shiftFilter: string
  setShiftFilter: (value: string) => void
  records: AttendanceRecord[]
  statusCounts: AttendanceStatusCounts
  shifts: ReturnType<typeof useAttendanceShifts>['shifts']
  shiftsError: boolean
  reloadShifts: () => Promise<void>
  isLoading: boolean
  isExporting: boolean
  hasError: boolean
  formatDate: (date: Date) => string
  navigateDate: (days: number) => void
  setSelectedDate: (date: Date) => void
  handleExport: () => Promise<void>
  handleDeptExport: () => Promise<void>
  handleRetry: () => void
  handleClearFilters: () => void
}

export function useAttendanceSheet(): UseAttendanceSheetReturn {
  const {
    searchQuery,
    setSearchQuery,
    selectedDate,
    shiftFilter,
    setShiftFilter,
    listParams,
    formatDisplayDate,
    navigateDate,
    setSelectedDate,
    handleClearFilters,
  } = useAttendanceFilters()

  const { shifts, hasError: shiftsError, reload: reloadShifts } = useAttendanceShifts()

  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [statusCounts, setStatusCounts] = useState<AttendanceStatusCounts>(EMPTY_ATTENDANCE_STATUS_COUNTS)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    async function loadAttendance(): Promise<void> {
      setIsLoading(true)
      setHasError(false)

      try {
        const [list, counts] = await Promise.all([
          attendanceService.getList(listParams, controller.signal),
          attendanceService.getStatusCounts(listParams, controller.signal),
        ])

        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return

        setRecords(list)
        setStatusCounts(counts)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        setHasError(true)
        setRecords([])
        setStatusCounts(EMPTY_ATTENDANCE_STATUS_COUNTS)
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void loadAttendance()
    return () => controller.abort()
  }, [listParams, reloadToken])

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

  const handleDeptExport = async (): Promise<void> => {
    if (records.length === 0) return

    setIsExporting(true)
    try {
      const { blob, filename } = await attendanceService.exportDepartmentAttendance(
        buildDepartmentAttendanceExportParams(listParams.date),
      )
      downloadBlob(blob, filename)
      toast.success('Department attendance exported')
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to export department attendance'
      toast.error(message)
    } finally {
      setIsExporting(false)
    }
  }

  const handleRetry = (): void => {
    void reloadShifts()
    setReloadToken((prev) => prev + 1)
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedDate,
    shiftFilter,
    setShiftFilter,
    records,
    statusCounts,
    shifts,
    shiftsError,
    reloadShifts,
    isLoading,
    isExporting,
    hasError,
    formatDate: formatDisplayDate,
    navigateDate,
    setSelectedDate,
    handleExport,
    handleDeptExport,
    handleRetry,
    handleClearFilters,
  }
}
