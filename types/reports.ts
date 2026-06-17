// types/reports.ts

export interface ReportGrowthSummary {
  growthPercentage: number
}

export interface ReportChartItem {
  name: string
  value: number
  color: string
  percentage?: number
}

export interface ReportTrendPoint {
  label: string
  value: number
}

export interface ReportPayrollTrendPoint {
  label: string
  gross: number
  net: number
}

export interface ReportAttendanceTrendPoint {
  label: string
  date: string
  present: number
}

export interface ReportRequestDistributionItem {
  type: string
  pending: number
  approved: number
  rejected: number
  total: number
}

export interface EmployeesReportData {
  summary: {
    total: number
    lastMonthTotal: number
    growthPercentage: number
  }
  departmentDistribution: ReportChartItem[]
  hireTrend: ReportTrendPoint[]
}

export interface PayrollReportData {
  summary: {
    currentGross: number
    currentNet: number
    lastMonthGross: number
    growthPercentage: number
  }
  trend: ReportPayrollTrendPoint[]
}

export interface AttendanceReportData {
  summary: {
    currentRate: number
    lastMonthRate: number
    growthPercentage: number
  }
  trend: ReportAttendanceTrendPoint[]
}

export interface AssetsReportData {
  summary: {
    total: number
    assigned: number
    available: number
  }
  statusDistribution: ReportChartItem[]
  categoryDistribution: ReportChartItem[]
}

export interface RequestsReportData {
  summary: {
    currentMonthTotal: number
    lastMonthTotal: number
    growthPercentage: number
  }
  distribution: ReportRequestDistributionItem[]
}

export interface ReportsData {
  employees: EmployeesReportData
  payroll: PayrollReportData
  attendance: AttendanceReportData
  assets: AssetsReportData
  requests: RequestsReportData
}

export interface BackendEmployeesReportSummary {
  total?: number
  last_month_total?: number
  growth_percentage?: number
}

export interface BackendDepartmentDistributionItem {
  department__name?: string
  count?: number
}

export interface BackendEmployeeHireTrendItem {
  month?: string
  new_hires?: number
}

export interface BackendEmployeesReport {
  summary?: BackendEmployeesReportSummary
  department_distribution?: BackendDepartmentDistributionItem[]
  trend?: BackendEmployeeHireTrendItem[]
}

export interface BackendPayrollReportSummary {
  current_gross?: number | string
  current_net?: number | string
  last_month_gross?: number | string
  growth_percentage?: number
}

export interface BackendPayrollTrendItem {
  month?: string
  gross?: number | string
  net?: number | string
}

export interface BackendPayrollReport {
  summary?: BackendPayrollReportSummary
  trend?: BackendPayrollTrendItem[]
}

export interface BackendAttendanceReportSummary {
  current_rate?: number
  last_month_rate?: number
  growth_percentage?: number
}

export interface BackendAttendanceTrendItem {
  date?: string
  present?: number
}

export interface BackendAttendanceReport {
  summary?: BackendAttendanceReportSummary
  trend?: BackendAttendanceTrendItem[]
}

export interface BackendAssetsReportSummary {
  total?: number
  assigned?: number
  available?: number
}

export interface BackendStatusDistributionItem {
  status?: string
  count?: number
}

export interface BackendCategoryDistributionItem {
  asset_category__name?: string
  count?: number
}

export interface BackendAssetsReport {
  summary?: BackendAssetsReportSummary
  status_distribution?: BackendStatusDistributionItem[]
  category_distribution?: BackendCategoryDistributionItem[]
}

export interface BackendRequestsReportSummary {
  current_month_total?: number
  last_month_total?: number
  growth_percentage?: number
}

export interface BackendRequestDistributionItem {
  type?: string
  pending?: number
  approved?: number
  rejected?: number
  total?: number
}

export interface BackendRequestsReport {
  summary?: BackendRequestsReportSummary
  distribution?: BackendRequestDistributionItem[]
}

export const EMPTY_REPORTS_DATA: ReportsData = {
  employees: {
    summary: { total: 0, lastMonthTotal: 0, growthPercentage: 0 },
    departmentDistribution: [],
    hireTrend: [],
  },
  payroll: {
    summary: { currentGross: 0, currentNet: 0, lastMonthGross: 0, growthPercentage: 0 },
    trend: [],
  },
  attendance: {
    summary: { currentRate: 0, lastMonthRate: 0, growthPercentage: 0 },
    trend: [],
  },
  assets: {
    summary: { total: 0, assigned: 0, available: 0 },
    statusDistribution: [],
    categoryDistribution: [],
  },
  requests: {
    summary: { currentMonthTotal: 0, lastMonthTotal: 0, growthPercentage: 0 },
    distribution: [],
  },
}
