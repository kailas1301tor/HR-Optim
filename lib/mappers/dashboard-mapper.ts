// lib/mappers/dashboard-mapper.ts
import type {
  BackendEmployeeDashboard,
  BackendMainDashboard,
  DashboardAttendanceDay,
  DashboardDepartmentItem,
  DashboardDocumentExpiryItem,
  DashboardKpiItem,
  EmployeeDashboardData,
  MainDashboardData,
} from '@/types/dashboard'

function formatNumber(value: number): string {
  return value.toLocaleString()
}

function mapKpis(cards: BackendMainDashboard['cards']): DashboardKpiItem[] {
  const totalEmployees = cards?.total_employees?.value ?? 0
  const presentToday = cards?.present_today?.value ?? 0
  const documentsExpiring = cards?.documents_expiring?.value ?? 0
  const assetsTracked = cards?.assets_tracked?.value ?? 0

  return [
    {
      title: 'Total Employees',
      value: formatNumber(totalEmployees),
      change: cards?.total_employees?.trend_percentage,
      changeLabel: 'vs last month',
      color: 'violet',
    },
    {
      title: 'Present Today',
      value: formatNumber(presentToday),
      change: cards?.present_today?.attendance_rate,
      changeLabel: 'attendance rate',
      color: 'lime',
    },
    {
      title: 'Documents Expiring',
      value: formatNumber(documentsExpiring),
      change: cards?.documents_expiring?.trend_percentage,
      changeLabel: 'vs last week',
      color: 'amber',
    },
    {
      title: 'Assets Tracked',
      value: formatNumber(assetsTracked),
      change: cards?.assets_tracked?.utilization,
      changeLabel: 'utilization',
      color: 'teal',
    },
  ]
}

export function mapBackendMainDashboard(data: BackendMainDashboard): MainDashboardData {
  const departmentDistribution: DashboardDepartmentItem[] = (data.department_distribution ?? []).map(
    (item) => ({
      name: item.department__name ?? item.name ?? 'Unknown',
      count: item.count ?? 0,
      percentage: item.percentage ?? 0,
    }),
  )

  const documentExpiry = mapDocumentExpiryTimeline(data.document_expiry_timeline)

  const attendanceOverview = mapAttendanceOverview(data.attendance_overview)

  return {
    kpis: mapKpis(data.cards),
    departmentDistribution,
    documentExpiry,
    attendanceOverview,
  }
}

function mapDocumentExpiryTimeline(
  items: BackendMainDashboard['document_expiry_timeline'],
): DashboardDocumentExpiryItem[] {
  return (items ?? []).map((item, index) => ({
    id: item.id ?? index,
    name: item.name ?? 'Document',
    owner: item.owner ?? '—',
    idNumber: item.id_number ?? '—',
    expiryDate: item.expiry_date ?? '',
    daysLeft: item.days_left ?? 0,
    status: item.status ?? 'Unknown',
    type: item.type ?? 'Document',
  }))
}

function mapAttendanceOverview(
  items: BackendMainDashboard['attendance_overview'],
): DashboardAttendanceDay[] {
  return (items ?? []).map((item) => ({
    date: item.date ?? '',
    dayOfWeek: item.day_of_week ?? '',
    presentCount: item.present_count ?? 0,
  }))
}

function mapEmployeeKpis(cards: BackendEmployeeDashboard['cards']): DashboardKpiItem[] {
  const documentsExpiring = cards?.documents_expiring?.value ?? 0
  const assetsAssigned = cards?.assets_assigned?.value ?? 0
  const pendingRequests = cards?.pending_requests?.value ?? 0

  return [
    {
      title: 'Documents Expiring',
      value: formatNumber(documentsExpiring),
      color: 'amber',
    },
    {
      title: 'Assets Assigned',
      value: formatNumber(assetsAssigned),
      color: 'teal',
    },
    {
      title: 'Pending Requests',
      value: formatNumber(pendingRequests),
      color: 'violet',
    },
  ]
}

export function mapBackendEmployeeDashboard(data: BackendEmployeeDashboard): EmployeeDashboardData {
  const pendingRequests = (data.pending_approval_list ?? []).map((item, index) => {
    const type = item.type ?? 'Request'
    const rawId = item.id ?? index
    return {
      id: `${type}-${rawId}`,
      type,
      submittedDate: item.request_date ?? '',
      status: item.status ?? 'Unknown',
      details: item.details ?? '—',
    }
  })

  return {
    kpis: mapEmployeeKpis(data.cards),
    attendanceOverview: mapAttendanceOverview(data.attendance_overview),
    documentExpiry: mapDocumentExpiryTimeline(data.document_expiry_timeline),
    pendingRequests,
  }
}
