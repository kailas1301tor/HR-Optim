// lib/helpers/payroll-period.ts
import { formatApiDate } from '@/lib/helpers/format-api-date'

export interface PayPeriod {
  month: number
  year: number
  start_date: string
  end_date: string
}

/** Pay period for the selected calendar month (1st through last day). */
export function getPayPeriodForMonth(month: number, year: number): PayPeriod {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)
  return {
    month,
    year,
    start_date: formatApiDate(startDate),
    end_date: formatApiDate(endDate),
  }
}

export function formatPayrollMonthLabel(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function shiftPayrollMonth(month: number, year: number, delta: number): { month: number; year: number } {
  const date = new Date(year, month - 1 + delta, 1)
  return { month: date.getMonth() + 1, year: date.getFullYear() }
}
