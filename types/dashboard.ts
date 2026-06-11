// types/dashboard.ts

export interface BackendDashboardCardMetric {
  value?: number
  trend_percentage?: number
  attendance_rate?: number
  utilization?: number
}

export interface BackendMainDashboardCards {
  total_employees?: BackendDashboardCardMetric
  present_today?: BackendDashboardCardMetric
  documents_expiring?: BackendDashboardCardMetric
  assets_tracked?: BackendDashboardCardMetric
}

export interface BackendDepartmentDistribution {
  department__name?: string
  name?: string
  count?: number
  percentage?: number
}

export interface BackendDocumentExpiryItem {
  id?: number
  name?: string
  owner?: string
  id_number?: string
  expiry_date?: string
  days_left?: number
  status?: string
  type?: string
}

export interface BackendAttendanceOverviewDay {
  date?: string
  day_of_week?: string
  present_count?: number
}

export interface BackendMainDashboard {
  cards?: BackendMainDashboardCards
  department_distribution?: BackendDepartmentDistribution[]
  document_expiry_timeline?: BackendDocumentExpiryItem[]
  attendance_overview?: BackendAttendanceOverviewDay[]
}

export interface DashboardKpiItem {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  color: 'violet' | 'lime' | 'teal' | 'amber'
}

export interface DashboardDepartmentItem {
  name: string
  count: number
  percentage: number
}

export interface DashboardDocumentExpiryItem {
  id: number
  name: string
  owner: string
  idNumber: string
  expiryDate: string
  daysLeft: number
  status: string
  type: string
}

export interface DashboardAttendanceDay {
  date: string
  dayOfWeek: string
  presentCount: number
}

export interface MainDashboardData {
  kpis: DashboardKpiItem[]
  departmentDistribution: DashboardDepartmentItem[]
  documentExpiry: DashboardDocumentExpiryItem[]
  attendanceOverview: DashboardAttendanceDay[]
}
