// app/settings/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { SettingsPanel } from '@/components/settings/settings-panel'
import { CommonPageSkeleton } from '@/components/common'

export default function SettingsPage() {
  return (
    <AppShell>
      <Suspense fallback={<CommonPageSkeleton />}>
        <SettingsPanel />
      </Suspense>
    </AppShell>
  )
}

export const metadata = {
  title: 'Settings',
  description: 'Manage your organization, users, and system preferences',
}
