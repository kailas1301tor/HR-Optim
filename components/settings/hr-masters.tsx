// components/settings/hr-masters.tsx
'use client'

import { ShiftsMaster } from './hr-masters/shifts-master'
import { LeaveRulesMaster } from './hr-masters/leave-rules-master'
import { ConnectedGenericMaster } from './hr-masters/connected-generic-master'
import { HolidaysMaster } from './hr-masters/holidays-master'
import { WorkingDaysMaster } from './hr-masters/working-days-master'
import { uiSectionHeader } from '@/lib/ui/design-system'
import {
  useEmployeeTypesMaster,
  useLeaveTypesMaster,
  useEmployeeDocTypesMaster,
  useCompanyDocTypesMaster,
  useNationalitiesMaster,
  useOnboardingDocTypesMaster,
  useOffboardingDocTypesMaster,
} from './hr-masters/useMasterCrudHooks'

export function HRMasters() {
  return (
    <div className="space-y-6 outline-none">
      <div className={uiSectionHeader}>
        <h2 className="text-lg font-semibold text-cloud">HR Management Masters</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Configure employee classification, policies, and compliance settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShiftsMaster />

        <ConnectedGenericMaster
          title="Employee Types"
          useMasterHook={useEmployeeTypesMaster}
          placeholder="e.g. FULL-TIME"
          label="Employee Type"
        />

        <ConnectedGenericMaster
          title="Leave Types"
          useMasterHook={useLeaveTypesMaster}
          placeholder="e.g. SICK LEAVE"
          label="Leave Type"
        />

        <LeaveRulesMaster />

        <ConnectedGenericMaster
          title="Employee Document Types"
          useMasterHook={useEmployeeDocTypesMaster}
          placeholder="e.g. PASSPORT"
          label="Document Type"
        />

        <ConnectedGenericMaster
          title="Company Document Types"
          useMasterHook={useCompanyDocTypesMaster}
          placeholder="e.g. TRADE LICENSE"
          label="Document Type"
        />

        <ConnectedGenericMaster
          title="Nationalities"
          useMasterHook={useNationalitiesMaster}
          placeholder="e.g. INDIAN"
          label="Nationality"
        />

        <ConnectedGenericMaster
          title="Onboarding Document Types"
          useMasterHook={useOnboardingDocTypesMaster}
          placeholder="e.g. OFFER LETTER"
          label="Document Type"
        />

        <ConnectedGenericMaster
          title="Offboarding Document Types"
          useMasterHook={useOffboardingDocTypesMaster}
          placeholder="e.g. RESIGNATION LETTER"
          label="Document Type"
        />

        <HolidaysMaster />
        <WorkingDaysMaster />
      </div>
    </div>
  )
}
