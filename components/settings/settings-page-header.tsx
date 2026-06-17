// components/settings/settings-page-header.tsx
'use client'

import { CommonPageHeader } from '@/components/common'
import { usePermissions } from '@/components/auth/permissions-provider'

export function SettingsPageHeader(): React.JSX.Element {
  const { isLoading, canView } = usePermissions()
  const canViewMasters = !isLoading && canView('settings')

  if (canViewMasters) {
    return (
      <CommonPageHeader
        title="Masters & Configuration"
        subtitle="Manage system masters and configuration settings"
      />
    )
  }

  return (
    <CommonPageHeader
      title="Settings"
      subtitle="Manage your account security and notification preferences"
    />
  )
}
