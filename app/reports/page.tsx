import { AppShell } from '@/components/layout/app-shell'
import { ReportsList } from '@/components/reports/reports-list'

export default function ReportsPage() {
  return (
    <AppShell>
      <ReportsList />
    </AppShell>
  )
}

export const metadata = {
  title: 'Reports & Analytics',
  description: 'Generate insights and export data across all modules',
}
