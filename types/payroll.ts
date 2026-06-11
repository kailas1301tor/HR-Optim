// types/payroll.ts
import type { WPSStatus } from '@/components/payroll/payroll-constants'

export interface BackendPayrollAdjustment {
  id: number
  pay_rule?: string | null
  adjustment_type: string
  description?: string | null
  amount: string
  reason?: string | null
  is_system_generated?: boolean
  payroll?: number
}

export interface BackendPayroll {
  id: number
  /** API returns employee display name as a string */
  employee?: number | string
  employee_id?: string
  employee_code?: string
  employee_name?: string
  full_name?: string
  department?: string
  department_name?: string
  basic_salary?: string | number
  base_salary?: string | number
  gross_salary?: string | number
  total_allowances?: string | number
  allowances?: string | number
  overtime?: string | number
  total_overtime?: string | number
  total_deductions?: string | number
  deductions?: string | number
  net_salary?: string | number
  net_pay?: string | number
  status?: string
  month?: number
  year?: number
  start_date?: string
  end_date?: string
  adjustments?: BackendPayrollAdjustment[]
}

export interface PayrollRecord {
  id: number
  employeeId: string
  employeeName: string
  initials: string
  department: string
  baseSalary: number
  allowances: number
  overtime: number
  deductions: number
  netSalary: number
  grossSalary: number
  status: string
  wpsStatus: WPSStatus
  canFinalize: boolean
  startDate: string
  endDate: string
}

export type PayrollStatusFilter = 'all' | 'processing' | 'finalized'

export const PAYROLL_LIST_PAGE_SIZE = 100
export const PAYROLL_TABLE_PAGE_SIZE = 20

export interface PayrollListParams {
  status?: string
  employee_id?: number
  month?: number
  year?: number
  page?: number
  page_size?: number
  [key: string]: string | number | boolean | undefined | null
}

export interface PayrollListResult {
  data: PayrollRecord[]
  total_count: number
  total_pages: number
  current_page: number
}

export interface GeneratePayrollPayload {
  month: number
  year: number
  start_date: string
  end_date: string
}

export interface AddPayrollAdjustmentPayload {
  payroll: number
  adjustment_type: string
  description: string
  amount: string
  reason: string
}

export interface FinalizePayrollPayload {
  payroll_ids: number[]
}

export type PayrollAdjustmentType = 'Allowance' | 'Deduction'

export interface BackendPayrollDashboardCards {
  total_payroll?: string | number
  total_deductions?: string | number
  net_payout?: string | number
  employees?: number
}

export interface BackendPayrollTrendMonth {
  month?: string
  base?: string | number
  allowances?: string | number
  overtime?: string | number
}

export interface BackendPayrollDashboard {
  cards?: BackendPayrollDashboardCards
  trends?: BackendPayrollTrendMonth[]
}

export interface PayrollDashboardKpis {
  totalPayroll: number
  totalDeductions: number
  netPayout: number
  employeeCount: number
}

export interface PayrollTrendPoint {
  month: string
  base: number
  allowances: number
  overtime: number
}

export interface PayrollDashboardData {
  kpis: PayrollDashboardKpis
  trends: PayrollTrendPoint[]
}

export interface PayrollExportParams {
  employee_id?: number | string
  status?: string
  month?: number
  year?: number
  start_date?: string
  end_date?: string
  export_format?: string
  [key: string]: string | number | boolean | undefined | null
}
