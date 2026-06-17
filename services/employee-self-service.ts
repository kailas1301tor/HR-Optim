// services/employee-self-service.ts
import { api } from '@/lib/api'
import { mapBackendEmployeeDashboard } from '@/lib/mappers/dashboard-mapper'
import {
  mapDashboardEmployeeDocument,
  mapEmployeeAttendanceData,
} from '@/lib/mappers/employee-self-service-mapper'
import type { ApiListResponse, ApiSingleResponse } from '@/lib/types'
import type { BackendEmployeeDashboard, EmployeeDashboardData } from '@/types/dashboard'
import type {
  LeaveRequestRecord,
  SalaryAdvanceRequestRecord,
  LoanRequestRecord,
  DocumentRequestRecord,
  DashboardAllRequestItem,
  DashboardAllRequestsData,
} from '@/types/request'
import type { BackendDashboardEmployeeDocument, EmployeeDocument } from '@/types/document'
import type { BackendPayroll } from '@/types/payroll'
import type { BackendEmployeeAttendanceData, EmployeeAttendanceData } from '@/types/attendance'

export interface EmployeeScopedParams {
  employeeId: number
  signal?: AbortSignal
  status?: string
}

export interface EmployeeMonthParams extends EmployeeScopedParams {
  month: number
  year: number
}

function buildEmployeeParams(
  employeeId: number,
  extras?: { status?: string; month?: number; year?: number },
): Record<string, string | number> {
  const params: Record<string, string | number> = { employee_id: employeeId }
  if (extras?.status) params.status = extras.status
  if (extras?.month !== undefined) params.month = extras.month
  if (extras?.year !== undefined) params.year = extras.year
  return params
}

export const employeeSelfService = {
  async getEmployeeDashboard(employeeId: number, signal?: AbortSignal): Promise<EmployeeDashboardData> {
    const response = await api.get<ApiSingleResponse<BackendEmployeeDashboard>>(
      '/api/employee/employee-dashboard/',
      { params: { employee_id: employeeId }, signal },
    )
    return mapBackendEmployeeDashboard(response.results?.data ?? {})
  },

  async getLeaveRequests(
    { employeeId, signal, status }: EmployeeScopedParams,
  ): Promise<LeaveRequestRecord[]> {
    const response = await api.get<ApiListResponse<LeaveRequestRecord>>(
      '/api/employee/dashboard-leave-requests/',
      { params: buildEmployeeParams(employeeId, { status }), signal },
    )
    return response.results?.data ?? []
  },

  async getSalaryAdvanceRequests(
    { employeeId, signal, status }: EmployeeScopedParams,
  ): Promise<SalaryAdvanceRequestRecord[]> {
    const response = await api.get<ApiListResponse<SalaryAdvanceRequestRecord>>(
      '/api/employee/dashboard-salary-advance-requests/',
      { params: buildEmployeeParams(employeeId, { status }), signal },
    )
    return response.results?.data ?? []
  },

  async getLoanRequests(
    { employeeId, signal, status }: EmployeeScopedParams,
  ): Promise<LoanRequestRecord[]> {
    const response = await api.get<ApiListResponse<LoanRequestRecord>>(
      '/api/employee/dashboard-loan-application-requests/',
      { params: buildEmployeeParams(employeeId, { status }), signal },
    )
    return response.results?.data ?? []
  },

  async getDocumentRequests(
    { employeeId, signal, status }: EmployeeScopedParams,
  ): Promise<DocumentRequestRecord[]> {
    const response = await api.get<ApiListResponse<DocumentRequestRecord>>(
      '/api/employee/dashboard-document-requests/',
      { params: buildEmployeeParams(employeeId, { status }), signal },
    )
    return response.results?.data ?? []
  },

  async getAllRequests(
    { employeeId, signal, status }: EmployeeScopedParams,
  ): Promise<DashboardAllRequestItem[]> {
    const response = await api.get<ApiSingleResponse<DashboardAllRequestsData>>(
      '/api/employee/dashboard-all-requests/',
      { params: buildEmployeeParams(employeeId, { status }), signal },
    )
    return response.results?.data?.results ?? []
  },

  async getDocuments(
    { employeeId, signal }: EmployeeScopedParams,
  ): Promise<EmployeeDocument[]> {
    const response = await api.get<ApiListResponse<BackendDashboardEmployeeDocument>>(
      '/api/employee/dashboard/documents/',
      { params: { employee_id: employeeId }, signal },
    )
    return (response.results?.data ?? []).map(mapDashboardEmployeeDocument)
  },

  async getPayroll(
    { employeeId, month, year, signal }: EmployeeMonthParams,
  ): Promise<BackendPayroll[]> {
    const response = await api.get<ApiListResponse<BackendPayroll>>(
      '/api/employee/dashboard/payroll/',
      { params: buildEmployeeParams(employeeId, { month, year }), signal },
    )
    return response.results?.data ?? []
  },

  async getAttendance(
    { employeeId, month, year, signal }: EmployeeMonthParams,
  ): Promise<EmployeeAttendanceData> {
    const response = await api.get<ApiSingleResponse<BackendEmployeeAttendanceData>>(
      '/api/employee/employee-attendance/',
      { params: buildEmployeeParams(employeeId, { month, year }), signal },
    )
    return mapEmployeeAttendanceData(response.results?.data ?? {})
  },
}
