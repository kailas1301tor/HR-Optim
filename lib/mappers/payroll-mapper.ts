// lib/mappers/payroll-mapper.ts
import { initialsFromName } from '@/lib/cookies'
import type { WPSStatus } from '@/components/payroll/payroll-constants'
import type {
  BackendPayroll,
  BackendPayrollAdjustment,
  BackendPayrollDashboard,
  PayrollDashboardData,
  PayrollRecord,
  PayrollTrendPoint,
} from '@/types/payroll'

function parseAmount(value: string | number | undefined | null): number {
  if (value === undefined || value === null || value === '') return 0
  const parsed = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function isOvertimeAdjustment(adjustment: BackendPayrollAdjustment): boolean {
  const text = `${adjustment.pay_rule ?? ''} ${adjustment.description ?? ''}`.toLowerCase()
  return text.includes('overtime')
}

function sumAdjustmentsByType(
  adjustments: BackendPayrollAdjustment[] | undefined,
  type: 'Allowance' | 'Deduction',
): number {
  return (adjustments ?? [])
    .filter((item) => item.adjustment_type?.toLowerCase() === type.toLowerCase())
    .reduce((sum, item) => sum + parseAmount(item.amount), 0)
}

function sumOvertimeFromAdjustments(adjustments: BackendPayrollAdjustment[] | undefined): number {
  return (adjustments ?? [])
    .filter((item) => item.adjustment_type?.toLowerCase() === 'allowance' && isOvertimeAdjustment(item))
    .reduce((sum, item) => sum + parseAmount(item.amount), 0)
}

function resolveAllowances(record: BackendPayroll): number {
  const adjustments = record.adjustments ?? []
  const overtime = sumOvertimeFromAdjustments(adjustments)
  const totalAllowances = sumAdjustmentsByType(adjustments, 'Allowance')

  if (totalAllowances > 0) {
    return Math.max(0, totalAllowances - overtime)
  }

  const gross = parseAmount(record.gross_salary)
  const basic = parseAmount(record.basic_salary ?? record.base_salary)
  if (gross > basic) return gross - basic

  return parseAmount(record.total_allowances ?? record.allowances)
}

function resolveOvertime(record: BackendPayroll): number {
  const fromAdjustments = sumOvertimeFromAdjustments(record.adjustments)
  if (fromAdjustments > 0) return fromAdjustments
  return parseAmount(record.total_overtime ?? record.overtime)
}

function resolveDeductions(record: BackendPayroll): number {
  const fromAdjustments = sumAdjustmentsByType(record.adjustments, 'Deduction')
  if (fromAdjustments > 0) return fromAdjustments
  return parseAmount(record.total_deductions ?? record.deductions)
}

function resolveEmployeeName(record: BackendPayroll): string {
  if (typeof record.employee === 'string' && record.employee.trim()) {
    return record.employee.trim()
  }
  return (
    record.employee_name?.trim() ||
    record.full_name?.trim() ||
    'Unknown employee'
  )
}

function resolveEmployeeId(record: BackendPayroll): string {
  return (
    record.employee_id?.trim() ||
    record.employee_code?.trim() ||
    (typeof record.employee === 'number' ? String(record.employee) : '—')
  )
}

export function mapPayrollStatusToWps(status: string | undefined): WPSStatus {
  const normalized = (status ?? '').trim().toLowerCase()
  if (normalized.includes('fail')) return 'failed'
  if (
    normalized.includes('final') ||
    (normalized.includes('process') && !normalized.includes('processing')) ||
    normalized.includes('paid') ||
    normalized === 'completed'
  ) {
    return 'processed'
  }
  if (normalized.includes('processing') || normalized.includes('pending') || normalized.includes('draft')) {
    return 'pending'
  }
  return 'pending'
}

export function getPayrollStatusLabel(status: string | undefined): string {
  const trimmed = status?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : 'Processing'
}

export function canFinalizePayroll(status: string | undefined): boolean {
  const normalized = (status ?? '').trim().toLowerCase()
  return normalized.includes('processing') || normalized.includes('draft')
}

export function mapBackendPayrollDashboard(data: BackendPayrollDashboard): PayrollDashboardData {
  const cards = data.cards ?? {}
  const trends: PayrollTrendPoint[] = (data.trends ?? []).map((item) => ({
    month: item.month ?? '',
    base: parseAmount(item.base),
    allowances: parseAmount(item.allowances),
    overtime: parseAmount(item.overtime),
  }))

  return {
    kpis: {
      totalPayroll: parseAmount(cards.total_payroll),
      totalDeductions: parseAmount(cards.total_deductions),
      netPayout: parseAmount(cards.net_payout),
      employeeCount: cards.employees ?? 0,
    },
    trends,
  }
}

export function mapBackendPayroll(record: BackendPayroll): PayrollRecord {
  const employeeName = resolveEmployeeName(record)
  const employeeId = resolveEmployeeId(record)
  const department =
    record.department_name?.trim() ||
    record.department?.trim() ||
    employeeId

  const status = getPayrollStatusLabel(record.status)
  const baseSalary = parseAmount(record.basic_salary ?? record.base_salary)
  const allowances = resolveAllowances(record)
  const overtime = resolveOvertime(record)
  const deductions = resolveDeductions(record)

  return {
    id: record.id,
    employeeId,
    employeeName,
    initials: initialsFromName(employeeName),
    department,
    baseSalary,
    allowances,
    overtime,
    deductions,
    netSalary: parseAmount(record.net_salary ?? record.net_pay),
    grossSalary: parseAmount(record.gross_salary),
    status,
    wpsStatus: mapPayrollStatusToWps(status),
    canFinalize: canFinalizePayroll(status),
    startDate: record.start_date ?? '',
    endDate: record.end_date ?? '',
  }
}
