// app/settings/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { SettingsPanel } from '@/components/settings/settings-panel'
import { CommonPageHeader } from '@/components/common'
import { SettingsSkeleton } from '@/components/settings/settings-skeleton'

export default function SettingsPage(): React.JSX.Element {
  return (
    <AppShell>
      <div className="space-y-6">
        <CommonPageHeader
          title="Masters & Configuration"
          subtitle="Manage system masters and configuration settings"
        />
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
