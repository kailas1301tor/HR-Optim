// services/employee-request-service.ts
import { api } from '@/lib/api'
import { cleanParams } from '@/lib/types'
import type { ApiListResponse, ApiSingleResponse } from '@/lib/types'
export interface RequestChoiceItem {
  id: string
  name: string
}

export interface RequestListParams {
  status?: string
  employee_id?: number
  page?: number
  page_size?: number
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

interface PaginatedResult<T> {
  data: T[]
  total_count: number
  total_pages: number
  current_page: number
}

interface SoftDeletableRecord {
  deleted?: boolean
  is_active?: boolean
}

function filterActiveRecords<T extends SoftDeletableRecord>(data: T[]): T[] {
  return data.filter((record) => record.deleted !== true && record.is_active !== false)
}

async function fetchPaginatedList<T extends SoftDeletableRecord>(
  endpoint: string,
  params: RequestListParams,
  signal?: AbortSignal
): Promise<PaginatedResult<T>> {
  try {
    const response = await api.get<ApiListResponse<T>>(endpoint, {
      params: cleanParams(params as Record<string, string | number | boolean | undefined | null>),
      signal,
    })
    const activeData = filterActiveRecords(response.results?.data ?? [])
    const apiTotal = response.results?.total_count ?? activeData.length
    const removedCount = (response.results?.data?.length ?? 0) - activeData.length
    return {
      data: activeData,
      total_count: Math.max(0, apiTotal - removedCount),
      total_pages: response.results?.total_pages ?? 1,
      current_page: response.results?.current_page ?? 1,
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error
    console.warn(`🔴 Network error fetching ${endpoint}.`, error)
    return { data: [], total_count: 0, total_pages: 1, current_page: 1 }
  }
}

export const employeeRequestService = {
  async getLeaveRequests(params: RequestListParams, signal?: AbortSignal) {
    return fetchPaginatedList<LeaveRequestRecord>(
      '/api/employee/leave-requests/',
      params,
      signal
    )
  },

  async getSalaryAdvanceRequests(params: RequestListParams, signal?: AbortSignal) {
    return fetchPaginatedList<SalaryAdvanceRequestRecord>(
      '/api/employee/salary-advance-requests/',
      params,
      signal
    )
  },

  async getLoanRequests(params: RequestListParams, signal?: AbortSignal) {
    return fetchPaginatedList<LoanRequestRecord>(
      '/api/employee/loan-application-requests/',
      params,
      signal
    )
  },

  async getDocumentRequests(params: RequestListParams, signal?: AbortSignal) {
    return fetchPaginatedList<DocumentRequestRecord>(
      '/api/employee/document-requests/',
      params,
      signal
    )
  },

  async getRequestChoices(signal?: AbortSignal): Promise<RequestChoices> {
    try {
      const response = await api.get<ApiSingleResponse<RequestChoices>>(
        '/api/employee/request-choices/',
        { signal }
      )
      return response.results?.data ?? {
        session_choices: [],
        request_status_choices: [],
        document_request_type_choices: [],
      }
    } catch (error) {
      console.warn('🔴 Network error fetching request choices.', error)
      return {
        session_choices: [],
        request_status_choices: [],
        document_request_type_choices: [],
      }
    }
  },

  async calculateLeaveDays(
    payload: LeaveCalculatePayload,
    signal?: AbortSignal
  ): Promise<number> {
    const response = await api.post<ApiSingleResponse<{ number_of_days: number | string }>>(
      '/api/employee/leave-calculate/',
      payload,
      { signal }
    )
    const raw = response.results?.data?.number_of_days
    if (raw === undefined || raw === null) return 0
    const parsed = typeof raw === 'string' ? parseFloat(raw) : raw
    return Number.isFinite(parsed) ? parsed : 0
  },

  async createLeaveRequest(
    payload: CreateLeaveRequestPayload,
    signal?: AbortSignal
  ): Promise<LeaveRequestRecord> {
    const response = await api.post<ApiSingleResponse<LeaveRequestRecord>>(
      '/api/employee/leave-requests/',
      payload,
      { signal }
    )
    if (!response.results?.data) {
      throw new Error('Leave request created but no data returned')
    }
    return response.results.data
  },

  async createSalaryAdvanceRequest(
    payload: CreateSalaryAdvancePayload,
    signal?: AbortSignal
  ): Promise<SalaryAdvanceRequestRecord> {
    const response = await api.post<ApiSingleResponse<SalaryAdvanceRequestRecord>>(
      '/api/employee/salary-advance-requests/',
      payload,
      { signal }
    )
    if (!response.results?.data) {
      throw new Error('Salary advance request created but no data returned')
    }
    return response.results.data
  },

  async createLoanRequest(
    payload: CreateLoanPayload,
    signal?: AbortSignal
  ): Promise<LoanRequestRecord> {
    const response = await api.post<ApiSingleResponse<LoanRequestRecord>>(
      '/api/employee/loan-application-requests/',
      payload,
      { signal }
    )
    if (!response.results?.data) {
      throw new Error('Loan request created but no data returned')
    }
    return response.results.data
  },

  async createDocumentRequest(
    payload: CreateDocumentPayload,
    signal?: AbortSignal
  ): Promise<DocumentRequestRecord> {
    const response = await api.post<ApiSingleResponse<DocumentRequestRecord>>(
      '/api/employee/document-requests/',
      payload,
      { signal }
    )
    if (!response.results?.data) {
      throw new Error('Document request created but no data returned')
    }
    return response.results.data
  },
}
