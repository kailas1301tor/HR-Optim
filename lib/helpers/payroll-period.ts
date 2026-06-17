// lib/helpers/payroll-period.ts
import { formatApiDate } from '@/lib/helpers/format-api-date'

export interface PayPeriod {
  month: number
  year: number
  start_date: string
  end_date: string
}

/** Pay period ending on the 26th of the selected month (matches V12 Postman example). */
export function getPayPeriodForMonth(month: number, year: number): PayPeriod {
  const endDate = new Date(year, month - 1, 26)
  const startDate = new Date(year, month - 2, 26)
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
