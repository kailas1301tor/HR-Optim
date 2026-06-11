// types/request.ts

export type RequestType = 'leave' | 'document' | 'salary-advance' | 'loan'

export type RequestTypeFilter = 'all' | RequestType

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export type RequestStatusFilter = RequestStatus | 'all'

export interface Request {
  id: string
  backendId: number
  displayId: string
  type: RequestType
  title: string
  description: string
  requester: {
    id: string
    name: string
    initials: string
    department: string
    avatar?: string
  }
  submittedAt: string
  status: RequestStatus
  timeline: {
    step: string
    status: 'completed' | 'current' | 'pending'
    date?: string
  }[]
}

export interface StatusCounts {
  pending: number
  approved: number
  rejected: number
}

export const EMPTY_STATUS_COUNTS: StatusCounts = {
  pending: 0,
  approved: 0,
  rejected: 0,
}

export interface RequestListParams {
  status?: string
  employee_id?: number
  page?: number
  page_size?: number
}

export interface RequestChoiceItem {
  id: string
  name: string
}

export interface LeaveRequestRecord {
  id: number
  employee: string
  leave_type: string
  created_at: string
  updated_at: string
  is_active: boolean
  deleted: boolean
  start_session: string
  end_session: string
  number_of_days: string
  from_date: string
  to_date: string
  reason: string
  status: string
  rejected_reason: string | null
  approved_date: string | null
  rejected_date: string | null
}

export interface SalaryAdvanceRequestRecord {
  id: number
  employee: string
  created_at: string
  updated_at: string
  is_active: boolean
  deleted: boolean
  request_amount: string
  status: string
  tenure: number
  reason: string
  rejected_reason: string | null
  approved_date: string | null
  rejected_date: string | null
}

export interface LoanRequestRecord {
  id: number
  employee: string
  created_at: string
  updated_at: string
  is_active: boolean
  deleted: boolean
  request_amount: string
  status: string
  tenure: number
  reason: string
  interest_rate: string | null
  rejected_reason: string | null
  approved_date: string | null
  rejected_date: string | null
}

export interface DocumentRequestRecord {
  id: number
  employee: string
  file_url: string | null
  created_at: string
  updated_at: string
  is_active: boolean
  deleted: boolean
  document_type: string
  status: string
  purpose: string
  rejected_reason: string | null
  approved_date: string | null
  rejected_date: string | null
  file: string | null
}

export interface RequestChoices {
  session_choices: RequestChoiceItem[]
  request_status_choices: RequestChoiceItem[]
  document_request_type_choices: RequestChoiceItem[]
}

export interface LeaveCalculatePayload {
  from_date: string
  to_date: string
  start_session: string
  end_session: string
}

export interface CreateLeaveRequestPayload {
  employee: number
  leave_type: number
  start_session: string
  end_session: string
  number_of_days: number
  from_date: string
  to_date: string
  reason: string
}

export interface CreateSalaryAdvancePayload {
  employee: number
  request_amount: string
  tenure: number
  reason: string
}

export interface CreateLoanPayload {
  employee: number
  request_amount: string
  tenure: number
  reason: string
}

export interface CreateDocumentPayload {
  employee: number
  document_type: string
  purpose: string
}

export type RequestActionType = RequestType

export interface PaginatedRequestResult<T> {
  data: T[]
  total_count: number
  total_pages: number
  current_page: number
}

export const REQUEST_PAGE_SIZE = 20

export const ALL_STATUS_FETCH_CAP = 100

export const REQUEST_TYPES: RequestType[] = ['leave', 'document', 'salary-advance', 'loan']

export function getTypesToFetch(typeFilter: RequestTypeFilter): RequestType[] {
  if (typeFilter === 'all') return REQUEST_TYPES
  return [typeFilter]
}
