// lib/mappers/employee-self-service-mapper.ts
import { formatPersonName, formatTitleLabel } from '@/lib/helpers/format-display-text'
import { normalizeAttendanceStatus } from '@/lib/mappers/attendance-mapper'
import type {
  BackendEmployeeAttendanceData,
  EmployeeAttendanceData,
  EmployeeAttendanceSummary,
} from '@/types/attendance'
import type { BackendDashboardEmployeeDocument, EmployeeDocument } from '@/types/document'
import type { DashboardAllRequestItem, Request, RequestType } from '@/types/request'

function mapRequestTypeFromLabel(label: string): RequestType {
  const normalized = label.trim().toLowerCase()
  if (normalized.includes('leave')) return 'leave'
  if (normalized.includes('loan')) return 'loan'
  if (normalized.includes('document')) return 'document'
  if (normalized.includes('advance') || normalized.includes('salary')) return 'salary-advance'
  return 'salary-advance'
}

function mapApiStatus(status: string): Request['status'] {
  const normalized = status.toLowerCase()
  if (normalized === 'approved') return 'approved'
  if (normalized === 'rejected') return 'rejected'
  return 'pending'
}

function buildMinimalTimeline(status: Request['status'], createdAt: string): Request['timeline'] {
  const submittedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  if (status === 'approved') {
    return [
      { step: 'Submitted', status: 'completed', date: submittedDate },
      { step: 'Approved', status: 'completed' },
    ]
  }

  if (status === 'rejected') {
    return [
      { step: 'Submitted', status: 'completed', date: submittedDate },
      { step: 'Rejected', status: 'completed' },
    ]
  }

  return [
    { step: 'Submitted', status: 'completed', date: submittedDate },
    { step: 'Under Review', status: 'current' },
    { step: 'Decision', status: 'pending' },
  ]
}

export function mapEmployeeAttendanceData(data: BackendEmployeeAttendanceData): EmployeeAttendanceData {
  const summary: EmployeeAttendanceSummary = {
    present: data.summary?.Present ?? 0,
    late: 0,
    absent: data.summary?.Absent ?? 0,
    leave: data.summary?.['On Leave'] ?? 0,
    weekend: data.summary?.Weekend ?? 0,
    holiday: data.summary?.Holiday ?? 0,
  }

  const days = (data.days ?? []).map((day) => ({
    date: day.date ?? '',
    dayOfWeek: day.day_of_week ?? '',
    status: normalizeAttendanceStatus(day.status ?? 'Absent'),
    excusedReason: day.excused_reason ?? '',
    timeIn: day.time_in ?? null,
    timeOut: day.time_out ?? null,
    workHours: day.work_hours ?? '',
    breakHours: day.break_hours ?? '',
    totalHours: day.total_hours ?? '',
    timings: (day.timings ?? []).map((t) => ({ in: t.in ?? null, out: t.out ?? null })),
    isBiometric: day.is_biometric ?? false,
  }))

  return { summary, days }
}

export function mapDashboardEmployeeDocument(doc: BackendDashboardEmployeeDocument): EmployeeDocument {
  const documentType = doc.document_type ?? ''
  const documentTypeName =
    typeof documentType === 'string' && documentType.trim()
      ? documentType.trim()
      : undefined

  return {
    id: doc.id,
    employee: doc.employee ?? '',
    employee_name:
      typeof doc.employee === 'string' ? formatPersonName(doc.employee) : undefined,
    document_type: documentType,
    document_type_name: documentTypeName ? formatTitleLabel(documentTypeName) : documentTypeName,
    document_number: doc.document_number ?? '',
    expiry_date: doc.expiry_date ?? '',
    status: formatTitleLabel(doc.status ?? 'Unknown'),
    file_url: doc.file_url ?? doc.file ?? '',
    file: doc.file,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
    is_active: doc.is_active,
  }
}

export function mapDashboardAllRequest(item: DashboardAllRequestItem): Request {
  const type = mapRequestTypeFromLabel(item.request_type)
  const status = mapApiStatus(item.status)

  return {
    id: `${type}-${item.id}`,
    backendId: item.id,
    displayId: `REQ-${item.id}`,
    type,
    title: formatTitleLabel(item.request_type),
    description: formatTitleLabel(item.request_type),
    requester: {
      id: 'self',
      name: 'You',
      initials: 'ME',
      department: '',
    },
    submittedAt: item.created_at,
    status,
    timeline: buildMinimalTimeline(status, item.created_at),
  }
}
