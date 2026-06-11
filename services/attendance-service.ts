// services/attendance-service.ts
import { api } from '@/lib/api'
import {
  mapBackendAttendanceRecord,
  mapBackendStatusCounts,
  type BackendAttendanceRecord,
  type BackendAttendanceStatusCount,
} from '@/lib/mappers/attendance-mapper'
import { parseContentDispositionFilename } from '@/lib/helpers/download-blob'
import { cleanParams } from '@/lib/types'
import {
  EMPTY_ATTENDANCE_STATUS_COUNTS,
  type AttendanceRecord,
  type AttendanceStatusCounts,
} from '@/types/attendance'
import type { ApiSimpleListResponse, ApiSingleResponse } from '@/lib/types'

export interface AttendanceListParams {
  date: string
  shift?: number
  search?: string
  [key: string]: string | number | boolean | undefined | null
}

export interface AttendanceExportResult {
  blob: Blob
  filename: string
}

export const attendanceService = {
  async getList(
    params: AttendanceListParams,
    signal?: AbortSignal,
  ): Promise<AttendanceRecord[]> {
    const response = await api.get<ApiSimpleListResponse<BackendAttendanceRecord>>(
      '/api/employee/attendance/',
      {
        params: cleanParams(params),
        signal,
      },
    )

    return (response.results?.data ?? []).map(mapBackendAttendanceRecord)
  },

  async getStatusCounts(
    params: AttendanceListParams,
    signal?: AbortSignal,
  ): Promise<AttendanceStatusCounts> {
    const response = await api.get<ApiSingleResponse<BackendAttendanceStatusCount>>(
      '/api/employee/attendance/status-count/',
      {
        params: cleanParams(params),
        signal,
      },
    )

    if (!response.results?.data) return EMPTY_ATTENDANCE_STATUS_COUNTS
    return mapBackendStatusCounts(response.results.data)
  },

  async exportExcel(
    params: AttendanceListParams,
    signal?: AbortSignal,
  ): Promise<AttendanceExportResult> {
    const { blob, contentDisposition } = await api.getBlob(
      '/api/employee/attendance/export/',
      {
        params: cleanParams(params),
        signal,
      },
    )

    const fallbackFilename = `attendance_${params.date}.xlsx`
    const filename = parseContentDispositionFilename(contentDisposition, fallbackFilename)

    return { blob, filename }
  },
}
