// components/settings/company-settings.tsx
'use client'

import { uiSectionHeader } from '@/lib/ui/design-system'
import { DepartmentSettingsCard } from './department-settings-card'
import { BranchSettingsCard } from './branch-settings-card'
import { DesignationSettingsCard } from './designation-settings-card'

export function CompanySettings() {
  return (
    <div className="space-y-6 outline-none">
      <div className={uiSectionHeader}>
        <h2 className="text-lg font-semibold text-cloud">Company Structure Masters</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Define departments, branches, and designations organizational hierarchy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentSettingsCard />
        <BranchSettingsCard />
      </div>

      <DesignationSettingsCard />
    </div>
  )
}
