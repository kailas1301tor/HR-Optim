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

export interface BackendEmployeeDashboardCards {
  documents_expiring?: BackendDashboardCardMetric
  assets_assigned?: BackendDashboardCardMetric
  pending_requests?: BackendDashboardCardMetric
}

export interface BackendEmployeePendingRequest {
  id?: number
  type?: string
  request_date?: string
  status?: string
  details?: string
}

export interface BackendEmployeeDashboard {
  cards?: BackendEmployeeDashboardCards
  attendance_overview?: BackendAttendanceOverviewDay[]
  document_expiry_timeline?: BackendDocumentExpiryItem[]
  pending_approval_list?: BackendEmployeePendingRequest[]
}

export interface EmployeePendingRequestItem {
  /** Composite key — backend ids are scoped per request table, not globally unique */
  id: string
  type: string
  submittedDate: string
  status: string
  details: string
}

export interface EmployeeDashboardData {
  kpis: DashboardKpiItem[]
  attendanceOverview: DashboardAttendanceDay[]
  documentExpiry: DashboardDocumentExpiryItem[]
  pendingRequests: EmployeePendingRequestItem[]
}
