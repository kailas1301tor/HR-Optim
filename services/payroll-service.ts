// services/payroll-service.ts
import { api } from '@/lib/api'
import { mapBackendPayroll, mapBackendPayrollDashboard } from '@/lib/mappers/payroll-mapper'
import { parseContentDispositionFilename } from '@/lib/helpers/download-blob'
import { cleanParams, type ApiListResponse, type ApiSingleResponse } from '@/lib/types'
import type {
  AddPayrollAdjustmentPayload,
  BackendPayroll,
  BackendPayrollDashboard,
  FinalizePayrollPayload,
  GeneratePayrollPayload,
  PayrollDashboardData,
  PayrollExportParams,
  PayrollListParams,
  PayrollListResult,
  PayrollRecord,
} from '@/types/payroll'

export interface PayrollExportResult {
  blob: Blob
  filename: string
}

function buildPayrollExportFilename(prefix: string, params: PayrollExportParams): string {
  if (params.start_date && params.end_date) {
    return `${prefix}_${params.start_date}_${params.end_date}.xlsx`
  }
  return `${prefix}_${params.year ?? ''}_${params.month ?? ''}.xlsx`
}

export const payrollService = {
  async listPayrolls(params: PayrollListParams, signal?: AbortSignal): Promise<PayrollListResult> {
    const response = await api.get<ApiListResponse<BackendPayroll>>('/api/employee/payroll/', {
      params: cleanParams(params),
      signal,
    })

    const results = response.results
    const data = (results?.data ?? []).map(mapBackendPayroll)

    return {
      data,
      total_count: results?.total_count ?? data.length,
      total_pages: results?.total_pages ?? 1,
      current_page: results?.current_page ?? 1,
    }
  },

  async generatePayroll(payload: GeneratePayrollPayload): Promise<PayrollRecord[]> {
    const response = await api.post<ApiListResponse<BackendPayroll>>(
      '/api/employee/payroll/generate/',
      payload,
    )
    return (response.results?.data ?? []).map(mapBackendPayroll)
  },

  async addAdjustment(payload: AddPayrollAdjustmentPayload): Promise<void> {
    await api.post('/api/employee/payroll/adjustments/', payload)
  },

  async deleteAdjustment(id: number): Promise<void> {
    await api.delete('/api/employee/payroll/adjustments/', { params: { id } })
  },

  async finalizePayroll(payload: FinalizePayrollPayload): Promise<void> {
    await api.post('/api/employee/payroll/finalize/', payload)
  },

  async getDashboard(
    month: number,
    year: number,
    signal?: AbortSignal,
  ): Promise<PayrollDashboardData> {
    const response = await api.get<ApiSingleResponse<BackendPayrollDashboard>>(
      '/api/employee/payroll/dashboard/',
      {
        params: cleanParams({ month, year }),
        signal,
      },
    )
    return mapBackendPayrollDashboard(response.results?.data ?? {})
  },

  async exportPayrollExcel(
    params: PayrollExportParams,
    signal?: AbortSignal,
  ): Promise<PayrollExportResult> {
    // Stage backend: `/api/employee/payroll/export/` (V14 Postman `generate/export` is not deployed).
    const { blob, contentDisposition } = await api.getBlob(
      '/api/employee/payroll/export/',
      {
        params: cleanParams({ export_format: 'excel', ...params }),
        signal,
      },
    )
    return {
      blob,
      filename: parseContentDispositionFilename(
        contentDisposition,
        buildPayrollExportFilename('payroll', params),
      ),
    }
  },

  async exportDepartmentSummary(
    params: PayrollExportParams,
    signal?: AbortSignal,
  ): Promise<PayrollExportResult> {
    const { blob, contentDisposition } = await api.getBlob(
      '/api/employee/payroll/department-summary/export/',
      {
        params: cleanParams({ export_format: 'excel', ...params }),
        signal,
      },
    )
    return {
      blob,
      filename: parseContentDispositionFilename(
        contentDisposition,
        buildPayrollExportFilename('payroll_department_summary', params),
      ),
    }
  },
}
