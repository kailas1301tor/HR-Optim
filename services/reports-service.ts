// services/reports-service.ts
import { api } from '@/lib/api'
import {
  mapAssetsReport,
  mapAttendanceReport,
  mapEmployeesReport,
  mapPayrollReport,
  mapRequestsReport,
} from '@/lib/mappers/reports-mapper'
import type { ApiSingleResponse } from '@/lib/types'
import type {
  AssetsReportData,
  AttendanceReportData,
  BackendAssetsReport,
  BackendAttendanceReport,
  BackendEmployeesReport,
  BackendPayrollReport,
  BackendRequestsReport,
  EmployeesReportData,
  PayrollReportData,
  ReportsData,
  RequestsReportData,
} from '@/types/reports'

export const reportsService = {
  async getEmployeeReport(signal?: AbortSignal): Promise<EmployeesReportData> {
    const response = await api.get<ApiSingleResponse<BackendEmployeesReport>>(
      '/api/employee/reports/employees/',
      { signal },
    )
    return mapEmployeesReport(response.results?.data ?? {})
  },

  async getPayrollReport(signal?: AbortSignal): Promise<PayrollReportData> {
    const response = await api.get<ApiSingleResponse<BackendPayrollReport>>(
      '/api/employee/reports/payroll/',
      { signal },
    )
    return mapPayrollReport(response.results?.data ?? {})
  },

  async getAttendanceReport(signal?: AbortSignal): Promise<AttendanceReportData> {
    const response = await api.get<ApiSingleResponse<BackendAttendanceReport>>(
      '/api/employee/reports/attendance/',
      { signal },
    )
    return mapAttendanceReport(response.results?.data ?? {})
  },

  async getAssetsReport(signal?: AbortSignal): Promise<AssetsReportData> {
    const response = await api.get<ApiSingleResponse<BackendAssetsReport>>(
      '/api/employee/reports/assets/',
      { signal },
    )
    return mapAssetsReport(response.results?.data ?? {})
  },

  async getRequestsReport(signal?: AbortSignal): Promise<RequestsReportData> {
    const response = await api.get<ApiSingleResponse<BackendRequestsReport>>(
      '/api/employee/reports/requests/',
      { signal },
    )
    return mapRequestsReport(response.results?.data ?? {})
  },

  async getAllReports(signal?: AbortSignal): Promise<ReportsData> {
    const [employees, payroll, attendance, assets, requests] = await Promise.all([
      this.getEmployeeReport(signal),
      this.getPayrollReport(signal),
      this.getAttendanceReport(signal),
      this.getAssetsReport(signal),
      this.getRequestsReport(signal),
    ])

    return { employees, payroll, attendance, assets, requests }
  },
}
