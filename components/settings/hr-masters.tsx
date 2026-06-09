// components/settings/hr-masters.tsx
'use client'

import { ShiftsMaster } from './hr-masters/shifts-master'
import { GenericMasterCard } from './hr-masters/generic-master-card'
import { uiSectionHeader } from '@/lib/ui/design-system'
import { useHrShiftsAndTypes } from './useHrShiftsAndTypes'
import { useHrLeaveAndDocTypes } from './useHrLeaveAndDocTypes'
import { useHrNationalities } from './useHrNationalities'
import { useHrOnboardingOffboarding } from './useHrOnboardingOffboarding'

export function HRMasters() {
  const {
    shifts,
    shiftsLoading,
    employeeTypes,
    employeeTypesLoading,
    loadShifts,
    handleEmployeeTypeSave,
    handleEmployeeTypeDelete,
  } = useHrShiftsAndTypes()

  const {
    leaveTypes,
    leaveTypesLoading,
    employeeDocTypes,
    employeeDocTypesLoading,
    companyDocTypes,
    companyDocTypesLoading,
    handleLeaveTypeSave,
    handleLeaveTypeDelete,
    handleEmployeeDocTypeSave,
    handleEmployeeDocTypeDelete,
    handleCompanyDocTypeSave,
    handleCompanyDocTypeDelete,
  } = useHrLeaveAndDocTypes()

  const {
    nationalities,
    nationalitiesLoading,
    handleNationalitySave,
    handleNationalityDelete,
  } = useHrNationalities()

  const {
    onboardingDocTypes,
    onboardingDocTypesLoading,
    offboardingDocTypes,
    offboardingDocTypesLoading,
    handleOnboardingDocTypeSave,
    handleOnboardingDocTypeDelete,
    handleOffboardingDocTypeSave,
    handleOffboardingDocTypeDelete,
  } = useHrOnboardingOffboarding()

  return (
    <div className="space-y-6 outline-none">
      <div className={uiSectionHeader}>
        <h2 className="text-lg font-semibold text-cloud">HR Management Masters</h2>
        <p className="text-xs text-muted-foreground mt-1">Configure employee classification, policies, and compliance settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShiftsMaster shifts={shifts} isLoading={shiftsLoading} onRefresh={loadShifts} />

        <GenericMasterCard
          title="Employee Types"
          items={employeeTypes}
          isLoading={employeeTypesLoading}
          onSave={handleEmployeeTypeSave}
          onDelete={handleEmployeeTypeDelete}
          placeholder="e.g. FULL-TIME"
          label="Employee Type"
        />

        <GenericMasterCard
          title="Leave Types"
          items={leaveTypes}
          isLoading={leaveTypesLoading}
          onSave={handleLeaveTypeSave}
          onDelete={handleLeaveTypeDelete}
          placeholder="e.g. SICK LEAVE"
          label="Leave Type"
        />

        <GenericMasterCard
          title="Employee Document Types"
          items={employeeDocTypes}
          isLoading={employeeDocTypesLoading}
          onSave={handleEmployeeDocTypeSave}
          onDelete={handleEmployeeDocTypeDelete}
          placeholder="e.g. PASSPORT"
          label="Document Type"
        />

        <GenericMasterCard
          title="Company Document Types"
          items={companyDocTypes}
          isLoading={companyDocTypesLoading}
          onSave={handleCompanyDocTypeSave}
          onDelete={handleCompanyDocTypeDelete}
          placeholder="e.g. TRADE LICENSE"
          label="Document Type"
        />

        <GenericMasterCard
          title="Nationalities"
          items={nationalities}
          isLoading={nationalitiesLoading}
          onSave={handleNationalitySave}
          onDelete={handleNationalityDelete}
          placeholder="e.g. INDIAN"
          label="Nationality"
        />

        <GenericMasterCard
          title="Onboarding Document Types"
          items={onboardingDocTypes}
          isLoading={onboardingDocTypesLoading}
          onSave={handleOnboardingDocTypeSave}
          onDelete={handleOnboardingDocTypeDelete}
          placeholder="e.g. OFFER LETTER"
          label="Document Type"
        />

        <GenericMasterCard
          title="Offboarding Document Types"
          items={offboardingDocTypes}
          isLoading={offboardingDocTypesLoading}
          onSave={handleOffboardingDocTypeSave}
          onDelete={handleOffboardingDocTypeDelete}
          placeholder="e.g. RESIGNATION LETTER"
          label="Document Type"
        />
      </div>
    </div>
  )
}
