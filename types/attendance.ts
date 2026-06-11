// types/attendance.ts

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave' | 'weekend'

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

/** V14: send `date` OR `month`+`year` — not both (backend returns 500 when combined). */
export interface DepartmentAttendanceExportParams {
  export_format?: string
  date?: string
  month?: number
  year?: number
}
