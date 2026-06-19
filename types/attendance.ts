// types/attendance.ts

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave' | 'weekend' | 'holiday'

export interface AttendanceTiming {
  in: string | null
  out: string | null
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  initials: string
  department: string
  shiftName: string
  date: string
  timeIn: string | null
  timeOut: string | null
  status: AttendanceStatus
  workHours: string | null
  breakHours: string | null
  totalHours: string | null
  timings: AttendanceTiming[]
  role?: string
  email?: string
  phoneNumber?: string | null
}

export interface AttendanceStatusCounts {
  present: number
  late: number
  absent: number
  leave: number
  weekend: number
}

export const EMPTY_ATTENDANCE_STATUS_COUNTS: AttendanceStatusCounts = {
  present: 0,
  late: 0,
  absent: 0,
  leave: 0,
  weekend: 0,
}

export interface BackendEmployeeAttendanceDay {
  date?: string
  day_of_week?: string
  status?: string
}

export interface BackendEmployeeAttendanceSummary {
  Present?: number
  Absent?: number
  'On Leave'?: number
  Holiday?: number
  Weekend?: number
}

export interface BackendEmployeeAttendanceData {
  summary?: BackendEmployeeAttendanceSummary
  days?: BackendEmployeeAttendanceDay[]
}

export interface EmployeeAttendanceSummary extends AttendanceStatusCounts {
  holiday: number
}

export interface EmployeeAttendanceDay {
  date: string
  dayOfWeek: string
  status: AttendanceStatus
}

export interface EmployeeAttendanceData {
  summary: EmployeeAttendanceSummary
  days: EmployeeAttendanceDay[]
}

/** V14: send `date` OR `month`+`year` — not both (backend returns 500 when combined). */
export interface DepartmentAttendanceExportParams {
  export_format?: string
  date?: string
  month?: number
  year?: number
}

export type ManualPunchType = 'in' | 'out'

export interface ManualPunchPayload {
  punch_type: ManualPunchType
  latitude: string
  longitude: string
}

export interface ManualPunchResponse {
  message: string
  results?: {
    data?: unknown
  }
}
