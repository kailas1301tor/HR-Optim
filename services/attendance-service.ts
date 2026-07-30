// services/attendance-service.ts
import { api } from '@/lib/api'
import {
  mapBackendStatusCounts,
  mapBackendTeamAttendanceRecord,
  mergeTeamAttendanceEmployees,
  type BackendAttendanceStatusCount,
  type BackendTeamAttendanceRecord,
} from '@/lib/mappers/attendance-mapper'
import { parseContentDispositionFilename } from '@/lib/helpers/download-blob'
import { cleanParams } from '@/lib/types'
import { parseApiDate } from '@/lib/helpers/format-api-date'
import {
  EMPTY_ATTENDANCE_STATUS_COUNTS,
  type AttendanceStatusCounts,
  type DepartmentAttendanceExportParams,
  type ManualPunchPayload,
  type ManualPunchResponse,
  type LateReasonPayload,
  type LateReasonResponse,
  type TeamAttendanceEmployee,
} from '@/types/attendance'
import type { ApiSimpleListResponse, ApiSingleResponse } from '@/lib/types'

export interface AttendanceListParams {
  start_date: string
  end_date: string
  shift?: number
  search?: string
  [key: string]: string | number | boolean | undefined | null
}

export interface AttendanceExportResult {
  blob: Blob
  filename: string
}

/** Daily dept export for the attendance sheet's selected start date (V14 Postman). */
export function buildDepartmentAttendanceExportParams(
  startDate: string,
): DepartmentAttendanceExportParams {
  return {
    export_format: 'excel',
    date: startDate,
  }
}

/** Monthly dept export — use month/year only, no date. */
export function buildMonthlyDepartmentAttendanceExportParams(
  date: string,
): DepartmentAttendanceExportParams {
  const parsed = parseApiDate(date) ?? new Date()
  return {
    export_format: 'excel',
    month: parsed.getMonth() + 1,
    year: parsed.getFullYear(),
  }
}

export const attendanceService = {
  async getList(
    params: AttendanceListParams,
    signal?: AbortSignal,
  ): Promise<TeamAttendanceEmployee[]> {
    const response = await api.get<ApiSimpleListResponse<BackendTeamAttendanceRecord>>(
      '/api/employee/attendance/',
      {
        params: cleanParams(params),
        signal,
      },
    )

    const mapped = (response.results?.data ?? []).map(mapBackendTeamAttendanceRecord)
    return mergeTeamAttendanceEmployees(mapped)
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

    const fallbackFilename =
      params.start_date === params.end_date
        ? `attendance_${params.start_date}.xlsx`
        : `attendance_${params.start_date}_to_${params.end_date}.xlsx`
    const filename = parseContentDispositionFilename(contentDisposition, fallbackFilename)

    return { blob, filename }
  },

  async exportDepartmentAttendance(
    params: DepartmentAttendanceExportParams,
    signal?: AbortSignal,
  ): Promise<AttendanceExportResult> {
    const { blob, contentDisposition } = await api.getBlob(
      '/api/employee/department-attendance/export/',
      {
        params: cleanParams(
          params as Record<string, string | number | boolean | undefined | null>,
        ),
        signal,
      },
    )
    const fallbackFilename = params.date
      ? `department_attendance_${params.date}.xlsx`
      : `department_attendance_${params.year ?? ''}_${String(params.month ?? '').padStart(2, '0')}.xlsx`
    return {
      blob,
      filename: parseContentDispositionFilename(contentDisposition, fallbackFilename),
    }
  },

  async manualPunch(
    payload: ManualPunchPayload,
    signal?: AbortSignal,
  ): Promise<ManualPunchResponse> {
    return await api.post<ManualPunchResponse>(
      '/api/employee/attendance/manual-punch/',
      payload,
      { signal },
    )
  },

  async submitLateReason(
    payload: LateReasonPayload,
    signal?: AbortSignal,
  ): Promise<LateReasonResponse> {
    return await api.post<LateReasonResponse>(
      '/api/employee/attendance/late-reason/',
      payload,
      { signal },
    )
  },
}
