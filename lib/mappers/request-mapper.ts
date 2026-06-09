// lib/mappers/request-mapper.ts
import { formatDistanceToNow } from 'date-fns'
import { initialsFromName } from '@/lib/cookies'
import type {
  DocumentRequestRecord,
  LeaveRequestRecord,
  LoanRequestRecord,
  SalaryAdvanceRequestRecord,
} from '@/services/employee-request-service'
import type { Request, RequestStatus, RequestType } from '@/components/requests/requests-constants'

function mapApiStatus(status: string): RequestStatus {
  const normalized = status.toLowerCase()
  if (normalized === 'approved') return 'approved'
  if (normalized === 'rejected') return 'rejected'
  return 'pending'
}

function buildTimeline(
  status: RequestStatus,
  createdAt: string,
  approvedDate: string | null,
  rejectedDate: string | null
): Request['timeline'] {
  const submittedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  if (status === 'approved') {
    return [
      { step: 'Submitted', status: 'completed', date: submittedDate },
      { step: 'Review', status: 'completed', date: approvedDate ?? undefined },
      { step: 'Approved', status: 'completed', date: approvedDate ?? undefined },
    ]
  }

  if (status === 'rejected') {
    return [
      { step: 'Submitted', status: 'completed', date: submittedDate },
      { step: 'Review', status: 'completed', date: rejectedDate ?? undefined },
      { step: 'Rejected', status: 'completed', date: rejectedDate ?? undefined },
    ]
  }

  return [
    { step: 'Submitted', status: 'completed', date: submittedDate },
    { step: 'Under Review', status: 'current' },
    { step: 'Decision', status: 'pending' },
  ]
}

function baseRequester(employeeName: string): Request['requester'] {
  return {
    id: employeeName,
    name: employeeName,
    initials: initialsFromName(employeeName),
    department: '',
  }
}

function formatDisplayId(backendId: number): string {
  return `REQ-${backendId}`
}

function formatSubmittedAt(createdAt: string): string {
  try {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true })
  } catch {
    return createdAt
  }
}

export function mapLeaveRequest(record: LeaveRequestRecord): Request {
  const status = mapApiStatus(record.status)
  return {
    id: `leave-${record.id}`,
    backendId: record.id,
    displayId: formatDisplayId(record.id),
    type: 'leave',
    title: `${record.leave_type} Request`,
    description: `${record.from_date} → ${record.to_date} (${record.number_of_days} days) — ${record.reason}`,
    requester: baseRequester(record.employee),
    submittedAt: formatSubmittedAt(record.created_at),
    status,
    priority: 'medium',
    timeline: buildTimeline(status, record.created_at, record.approved_date, record.rejected_date),
  }
}

export function mapSalaryAdvanceRequest(record: SalaryAdvanceRequestRecord): Request {
  const status = mapApiStatus(record.status)
  return {
    id: `salary-advance-${record.id}`,
    backendId: record.id,
    displayId: formatDisplayId(record.id),
    type: 'salary-advance',
    title: 'Salary Advance Request',
    description: `AED ${record.request_amount} over ${record.tenure} months — ${record.reason}`,
    requester: baseRequester(record.employee),
    submittedAt: formatSubmittedAt(record.created_at),
    status,
    priority: 'medium',
    timeline: buildTimeline(status, record.created_at, record.approved_date, record.rejected_date),
  }
}

export function mapLoanRequest(record: LoanRequestRecord): Request {
  const status = mapApiStatus(record.status)
  return {
    id: `loan-${record.id}`,
    backendId: record.id,
    displayId: formatDisplayId(record.id),
    type: 'loan',
    title: 'Loan Application',
    description: `AED ${record.request_amount} over ${record.tenure} months — ${record.reason}`,
    requester: baseRequester(record.employee),
    submittedAt: formatSubmittedAt(record.created_at),
    status,
    priority: 'medium',
    timeline: buildTimeline(status, record.created_at, record.approved_date, record.rejected_date),
  }
}

export function mapDocumentRequest(record: DocumentRequestRecord): Request {
  const status = mapApiStatus(record.status)
  return {
    id: `document-${record.id}`,
    backendId: record.id,
    displayId: formatDisplayId(record.id),
    type: 'document',
    title: 'Document Request',
    description: `${record.document_type} — ${record.purpose}`,
    requester: baseRequester(record.employee),
    submittedAt: formatSubmittedAt(record.created_at),
    status,
    priority: 'medium',
    timeline: buildTimeline(status, record.created_at, record.approved_date, record.rejected_date),
  }
}

export function mergeAndSortRequests(requests: Request[]): Request[] {
  return [...requests].sort((a, b) => {
    const aTime = a.submittedAt
    const bTime = b.submittedAt
    return aTime.localeCompare(bTime)
  })
}

export type { RequestType }
