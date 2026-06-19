// app/notifications/page.tsx
import { AppShell } from '@/components/layout/app-shell'
import { CommonPageHeader } from '@/components/common'
import { NotificationsList } from '@/components/notifications/notifications-list'

export default function NotificationsPage(): React.JSX.Element {
  return (
    <AppShell>
      <div className="space-y-6">
        <CommonPageHeader
          title="Notifications"
          subtitle="View and manage system alerts and transactional updates"
        />
        <div className="w-full">
          <NotificationsList />
        </div>
      </div>
    </AppShell>
  )
}

export const metadata = {
  title: 'Notifications',
  description: 'View your recent transactional and system event updates',
}
