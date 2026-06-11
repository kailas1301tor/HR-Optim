import { AppShell } from '@/components/layout/app-shell'
import { ReportsDashboard } from '@/components/reports/reports-dashboard'

export default function ReportsPage() {
  return (
    <AppShell>
      <ReportsDashboard />
    </AppShell>
  )
}

export const metadata = {
  title: 'Reports & Analytics',
  description: 'Generate insights and export data across all modules',
}
