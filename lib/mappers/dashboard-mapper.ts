// lib/mappers/dashboard-mapper.ts
import type {
  BackendMainDashboard,
  DashboardAttendanceDay,
  DashboardDepartmentItem,
  DashboardDocumentExpiryItem,
  DashboardKpiItem,
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

  const documentExpiry: DashboardDocumentExpiryItem[] = (data.document_expiry_timeline ?? []).map(
    (item, index) => ({
      id: item.id ?? index,
      name: item.name ?? 'Document',
      owner: item.owner ?? '—',
      idNumber: item.id_number ?? '—',
      expiryDate: item.expiry_date ?? '',
      daysLeft: item.days_left ?? 0,
      status: item.status ?? 'Unknown',
      type: item.type ?? 'Document',
    }),
  )

  const attendanceOverview: DashboardAttendanceDay[] = (data.attendance_overview ?? []).map(
    (item) => ({
      date: item.date ?? '',
      dayOfWeek: item.day_of_week ?? '',
      presentCount: item.present_count ?? 0,
    }),
  )

  return {
    kpis: mapKpis(data.cards),
    departmentDistribution,
    documentExpiry,
    attendanceOverview,
  }
}
