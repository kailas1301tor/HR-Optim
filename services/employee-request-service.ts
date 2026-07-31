// services/employee-request-service.ts
import { api } from '@/lib/api'
import { cleanParams } from '@/lib/types'
import type { ApiListResponse, ApiSimpleListResponse, ApiSingleResponse } from '@/lib/types'
import { mapLeaveCalendarFromApi } from '@/lib/mappers/leave-calendar-mapper'
import type {
  CreateDocumentPayload,
  CreateLeaveRequestPayload,
  CreateLoanPayload,
  CreateSalaryAdvancePayload,
  CreateWfhRequestPayload,
  DocumentRequestRecord,
  LeaveBalanceRecord,
  LeaveCalculatePayload,
  LeaveCalendarViewModel,
  LeaveRequestRecord,
  LoanRequestRecord,
  PaginatedRequestResult,
  RequestActionType,
  RequestChoices,
  RequestListParams,
  RequestType,
  SalaryAdvanceRequestRecord,
  WfhRequestRecord,
} from '@/types/request'

export type {
  CreateDocumentPayload,
  CreateLeaveRequestPayload,
  CreateLoanPayload,
  CreateSalaryAdvancePayload,
  CreateWfhRequestPayload,
  DocumentRequestRecord,
  LeaveCalculatePayload,
  LeaveCalendarViewModel,
  LeaveRequestRecord,
  LoanRequestRecord,
  RequestActionType,
  RequestChoiceItem,
  RequestChoices,
  RequestListParams,
  SalaryAdvanceRequestRecord,
  WfhRequestRecord,
} from '@/types/request'

interface SoftDeletableRecord {
  deleted?: boolean
  is_active?: boolean
}

function filterActiveRecords<T extends SoftDeletableRecord>(data: T[]): T[] {
  return data.filter((record) => record.deleted !== true)
}

async function fetchPaginatedList<T extends SoftDeletableRecord>(
  endpoint: string,
  params: RequestListParams,
  signal?: AbortSignal
): Promise<PaginatedRequestResult<T>> {
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
}

const LIST_ENDPOINTS: Record<RequestType, string> = {
  leave: '/api/employee/leave-requests/',
  document: '/api/employee/document-requests/',
  'salary-advance': '/api/employee/salary-advance-requests/',
  loan: '/api/employee/loan-application-requests/',
  wfh: '/api/employee/wfh-requests/',
}

const APPROVE_ENDPOINTS: Record<RequestActionType, string> = {
  leave: '/api/employee/leave-request-approve/',
  document: '/api/employee/document-request-approve/',
  'salary-advance': '/api/employee/salary-advance-request-approve/',
  loan: '/api/employee/loan-application-request-approve/',
  wfh: '/api/employee/wfh-request-approve/',
}

const REJECT_ENDPOINTS: Record<RequestActionType, string> = {
  leave: '/api/employee/leave-request-reject/',
  document: '/api/employee/document-request-reject/',
  'salary-advance': '/api/employee/salary-advance-request-reject/',
  loan: '/api/employee/loan-application-request-reject/',
  wfh: '/api/employee/wfh-request-reject/',
}

export async function fetchRequestsByType(
  type: RequestType,
  params: RequestListParams,
  signal?: AbortSignal
): Promise<PaginatedRequestResult<LeaveRequestRecord | SalaryAdvanceRequestRecord | LoanRequestRecord | DocumentRequestRecord | WfhRequestRecord>> {
  switch (type) {
    case 'leave':
      return fetchPaginatedList<LeaveRequestRecord>(LIST_ENDPOINTS.leave, params, signal)
    case 'salary-advance':
      return fetchPaginatedList<SalaryAdvanceRequestRecord>(LIST_ENDPOINTS['salary-advance'], params, signal)
    case 'loan':
      return fetchPaginatedList<LoanRequestRecord>(LIST_ENDPOINTS.loan, params, signal)
    case 'document':
      return fetchPaginatedList<DocumentRequestRecord>(LIST_ENDPOINTS.document, params, signal)
    case 'wfh':
      return fetchPaginatedList<WfhRequestRecord>(LIST_ENDPOINTS.wfh, params, signal)
    default:
      return { data: [], total_count: 0, total_pages: 1, current_page: 1 }
  }
}

export async function fetchStatusCountForType(
  type: RequestType,
  params: RequestListParams,
  signal?: AbortSignal
): Promise<number> {
  const result = await fetchRequestsByType(type, { ...params, page_size: 1, page: 1 }, signal)
  return result.total_count
}

export const employeeRequestService = {
  async getLeaveRequests(params: RequestListParams, signal?: AbortSignal) {
    return fetchPaginatedList<LeaveRequestRecord>(LIST_ENDPOINTS.leave, params, signal)
  },

  async getSalaryAdvanceRequests(params: RequestListParams, signal?: AbortSignal) {
    return fetchPaginatedList<SalaryAdvanceRequestRecord>(
      LIST_ENDPOINTS['salary-advance'],
      params,
      signal
    )
  },

  async getLoanRequests(params: RequestListParams, signal?: AbortSignal) {
    return fetchPaginatedList<LoanRequestRecord>(LIST_ENDPOINTS.loan, params, signal)
  },

  async getDocumentRequests(params: RequestListParams, signal?: AbortSignal) {
    return fetchPaginatedList<DocumentRequestRecord>(LIST_ENDPOINTS.document, params, signal)
  },

  async getWfhRequests(params: RequestListParams, signal?: AbortSignal) {
    return fetchPaginatedList<WfhRequestRecord>(LIST_ENDPOINTS.wfh, params, signal)
  },

  async getRequestChoices(signal?: AbortSignal): Promise<RequestChoices> {
    const response = await api.get<ApiSingleResponse<RequestChoices>>(
      '/api/employee/request-choices/',
      { signal }
    )
    return (
      response.results?.data ?? {
        session_choices: [],
        request_status_choices: [],
        document_request_type_choices: [],
      }
    )
  },

  async getLeaveCalendar(employeeId: number, signal?: AbortSignal): Promise<LeaveCalendarViewModel> {
    const response = await api.get<ApiSingleResponse<unknown>>('/api/employee/leave-calendar/', {
      params: { employee_id: employeeId },
      signal,
    })
    return mapLeaveCalendarFromApi(response)
  },

  async getLeaveBalances(employeeId: number, signal?: AbortSignal): Promise<LeaveBalanceRecord[]> {
    const response = await api.get<ApiSimpleListResponse<{ leave_type: string; balance: number | string }>>(
      '/api/employee/leave-balances/',
      { params: { employee_id: employeeId }, signal }
    )
    return (response.results?.data ?? []).map((record) => {
      const parsed = typeof record.balance === 'string' ? parseFloat(record.balance) : record.balance
      return {
        leave_type: record.leave_type,
        balance: Number.isFinite(parsed) ? parsed : 0,
      }
    })
  },

  async approveRequest(
    type: RequestActionType,
    id: number,
    signal?: AbortSignal
  ): Promise<void> {
    await api.put(APPROVE_ENDPOINTS[type], { id }, { signal })
  },

  async rejectRequest(
    type: RequestActionType,
    id: number,
    rejectedReason: string,
    signal?: AbortSignal
  ): Promise<void> {
    await api.put(
      REJECT_ENDPOINTS[type],
      { id, rejected_reason: rejectedReason },
      { signal }
    )
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
    payload: CreateLeaveRequestPayload | FormData,
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

  async createWfhRequest(
    payload: CreateWfhRequestPayload,
    signal?: AbortSignal
  ): Promise<WfhRequestRecord> {
    const response = await api.post<ApiSingleResponse<WfhRequestRecord>>(
      '/api/employee/wfh-requests/',
      payload,
      { signal }
    )
    if (!response.results?.data) {
      throw new Error('Work from home request created but no data returned')
    }
    return response.results.data
  },
}
