// app/settings/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { SettingsPanel } from '@/components/settings/settings-panel'
import { SettingsPageHeader } from '@/components/settings/settings-page-header'
import { SettingsSkeleton } from '@/components/settings/settings-skeleton'

export default function SettingsPage(): React.JSX.Element {
  return (
    <AppShell>
      <div className="space-y-6">
        <SettingsPageHeader />
        <Suspense fallback={<SettingsSkeleton showHeader={false} />}>
          <SettingsPanel />
        </Suspense>
      </div>
    </AppShell>
  )
}

export const metadata = {
  title: 'Settings',
  description: 'Manage your organization, users, and system preferences',
}
