// lib/mappers/reports-mapper.ts
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
  ReportChartItem,
  RequestsReportData,
} from '@/types/reports'

export const REPORT_CHART_COLORS = [
  '#7c3aed',
  '#a855f7',
  '#14b8a6',
  '#a3e635',
  '#f59e0b',
  '#64748b',
  '#ec4899',
  '#06b6d4',
]

function parseAmount(value: number | string | undefined | null): number {
  if (value === undefined || value === null || value === '') return 0
  const parsed = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function assignChartColors<T extends { name: string; value: number }>(
  items: T[],
): ReportChartItem[] {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  return items.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: REPORT_CHART_COLORS[index % REPORT_CHART_COLORS.length],
    percentage: total > 0 ? Math.round((item.value / total) * 1000) / 10 : 0,
  }))
}

export function formatGrowthLabel(percentage: number): string {
  const sign = percentage > 0 ? '+' : ''
  return `${sign}${percentage.toFixed(1)}%`
}

function formatShortDate(date: string): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function mapEmployeesReport(data: BackendEmployeesReport): EmployeesReportData {
  const deptItems = (data.department_distribution ?? []).map((item) => ({
    name: item.department__name ?? 'Unknown',
    value: item.count ?? 0,
  }))

  return {
    summary: {
      total: data.summary?.total ?? 0,
      lastMonthTotal: data.summary?.last_month_total ?? 0,
      growthPercentage: data.summary?.growth_percentage ?? 0,
    },
    departmentDistribution: assignChartColors(deptItems),
    hireTrend: (data.trend ?? []).map((item) => ({
      label: item.month ?? '',
      value: item.new_hires ?? 0,
    })),
  }
}

export function mapPayrollReport(data: BackendPayrollReport): PayrollReportData {
  return {
    summary: {
      currentGross: parseAmount(data.summary?.current_gross),
      currentNet: parseAmount(data.summary?.current_net),
      lastMonthGross: parseAmount(data.summary?.last_month_gross),
      growthPercentage: data.summary?.growth_percentage ?? 0,
    },
    trend: (data.trend ?? []).map((item) => ({
      label: item.month ?? '',
      gross: parseAmount(item.gross),
      net: parseAmount(item.net),
    })),
  }
}

export function mapAttendanceReport(data: BackendAttendanceReport): AttendanceReportData {
  return {
    summary: {
      currentRate: data.summary?.current_rate ?? 0,
      lastMonthRate: data.summary?.last_month_rate ?? 0,
      growthPercentage: data.summary?.growth_percentage ?? 0,
    },
    trend: (data.trend ?? []).map((item) => ({
      label: item.date ? formatShortDate(item.date) : '',
      date: item.date ?? '',
      present: item.present ?? 0,
    })),
  }
}

export function mapAssetsReport(data: BackendAssetsReport): AssetsReportData {
  const statusItems = (data.status_distribution ?? []).map((item) => ({
    name: item.status ?? 'Unknown',
    value: item.count ?? 0,
  }))

  const categoryItems = (data.category_distribution ?? []).map((item) => ({
    name: item.asset_category__name ?? 'Unknown',
    value: item.count ?? 0,
  }))

  return {
    summary: {
      total: data.summary?.total ?? 0,
      assigned: data.summary?.assigned ?? 0,
      available: data.summary?.available ?? 0,
    },
    statusDistribution: assignChartColors(statusItems),
    categoryDistribution: assignChartColors(categoryItems),
  }
}

export function mapRequestsReport(data: BackendRequestsReport): RequestsReportData {
  return {
    summary: {
      currentMonthTotal: data.summary?.current_month_total ?? 0,
      lastMonthTotal: data.summary?.last_month_total ?? 0,
      growthPercentage: data.summary?.growth_percentage ?? 0,
    },
    distribution: (data.distribution ?? []).map((item) => ({
      type: item.type ?? 'Unknown',
      pending: item.pending ?? 0,
      approved: item.approved ?? 0,
      rejected: item.rejected ?? 0,
      total: item.total ?? 0,
    })),
  }
}
