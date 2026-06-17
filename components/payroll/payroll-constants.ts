// components/payroll/payroll-constants.ts
export type { PayrollRecord } from '@/types/payroll'

/** Mock KPI summary — kept static per product decision (table uses live API). */
export const MOCK_PAYROLL_KPIS = {
  totalPayroll: 126_800,
  totalDeductions: 6_050,
  netPayout: 120_750,
  employeeCount: 5,
}

export const monthlyData = [
  { month: 'Jul', base: 420000, allowances: 85000, overtime: 32000 },
  { month: 'Aug', base: 425000, allowances: 86000, overtime: 28000 },
  { month: 'Sep', base: 430000, allowances: 87000, overtime: 35000 },
  { month: 'Oct', base: 428000, allowances: 88000, overtime: 30000 },
  { month: 'Nov', base: 435000, allowances: 89000, overtime: 38000 },
  { month: 'Dec', base: 440000, allowances: 90000, overtime: 42000 },
]

export const wpsStatusConfig = {
  processed: { label: 'Processed', className: 'bg-success-bg text-success-text' },
  pending: { label: 'Pending', className: 'bg-warning-bg text-warning-text' },
  failed: { label: 'Failed', className: 'bg-danger-bg text-danger-text' },
}
export type WPSStatus = 'processed' | 'pending' | 'failed'
export type WPSStatusConfig = typeof wpsStatusConfig

export type { PayrollStatusFilter } from '@/types/payroll'

export const payrollStatusFilterConfig = {
  all: { label: 'All statuses', apiValue: undefined as string | undefined },
  processing: { label: 'Processing', apiValue: 'Processing' },
  finalized: { label: 'Finalized', apiValue: 'Finalized' },
} as const
