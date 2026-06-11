// components/settings/hr-masters/useMasterCrudHooks.ts
import { createMasterCrudHook } from '@/lib/hooks/create-master-crud-hook'
import { invalidateDocumentCategories } from '@/components/documents/useDocumentCategories'
import { invalidateEmployeeDropdowns } from '@/components/employees/useEmployeeDropdowns'
import { employeeTypeService } from '@/services/employee-type-service'
import { leaveTypeService } from '@/services/leave-type-service'
import { employeeDocumentTypeService } from '@/services/employee-document-type-service'
import { companyDocumentTypeService } from '@/services/company-document-type-service'
import { nationalityService } from '@/services/nationality-service'
import { onboardingOffboardingService } from '@/services/onboarding-offboarding-service'

export const useEmployeeTypesMaster = createMasterCrudHook(
  {
    getAll: () => employeeTypeService.getEmployeeTypes(),
    create: (name) => employeeTypeService.createEmployeeType(name),
    update: (id, name) => employeeTypeService.updateEmployeeType(id, name),
    delete: (id) => employeeTypeService.deleteEmployeeType(id),
  },
  {
    entity: 'employee type',
    loadError: 'Failed to load employee types',
    saveError: 'Failed to save employee type',
    deleteError: 'Failed to delete employee type',
  },
  invalidateEmployeeDropdowns
)

export const useLeaveTypesMaster = createMasterCrudHook(
  {
    getAll: () => leaveTypeService.getLeaveTypes(),
    create: (name) => leaveTypeService.createLeaveType(name),
    update: (id, name) => leaveTypeService.updateLeaveType(id, name),
    delete: (id) => leaveTypeService.deleteLeaveType(id),
  },
  {
    entity: 'leave type',
    loadError: 'Failed to load leave types',
    saveError: 'Failed to save leave type',
    deleteError: 'Failed to delete leave type',
  },
  invalidateEmployeeDropdowns
)

export const useEmployeeDocTypesMaster = createMasterCrudHook(
  {
    getAll: () => employeeDocumentTypeService.getEmployeeDocTypes(),
    create: (name) => employeeDocumentTypeService.createEmployeeDocType(name),
    update: (id, name) => employeeDocumentTypeService.updateEmployeeDocType(id, name),
    delete: (id) => employeeDocumentTypeService.deleteEmployeeDocType(id),
  },
  {
    entity: 'employee document type',
    loadError: 'Failed to load employee document types',
    saveError: 'Failed to save employee document type',
    deleteError: 'Failed to delete employee document type',
  },
  () => invalidateDocumentCategories('employee')
)

export const useCompanyDocTypesMaster = createMasterCrudHook(
  {
    getAll: () => companyDocumentTypeService.getCompanyDocTypes(),
    create: (name) => companyDocumentTypeService.createCompanyDocType(name),
    update: (id, name) => companyDocumentTypeService.updateCompanyDocType(id, name),
    delete: (id) => companyDocumentTypeService.deleteCompanyDocType(id),
  },
  {
    entity: 'company document type',
    loadError: 'Failed to load company document types',
    saveError: 'Failed to save company document type',
    deleteError: 'Failed to delete company document type',
  },
  () => invalidateDocumentCategories('company')
)

export const useNationalitiesMaster = createMasterCrudHook(
  {
    getAll: () => nationalityService.getNationalities(),
    create: (name) => nationalityService.createNationality(name),
    update: (id, name) => nationalityService.updateNationality(id, name),
    delete: (id) => nationalityService.deleteNationality(id),
  },
  {
    entity: 'nationality',
    loadError: 'Failed to load nationalities',
    saveError: 'Failed to save nationality',
    deleteError: 'Failed to delete nationality',
  },
  invalidateEmployeeDropdowns
)

export const useOnboardingDocTypesMaster = createMasterCrudHook(
  {
    getAll: () => onboardingOffboardingService.getOnboardingDocTypes(),
    create: (name) => onboardingOffboardingService.createOnboardingDocType(name),
    update: (id, name) => onboardingOffboardingService.updateOnboardingDocType(id, name),
    delete: (id) => onboardingOffboardingService.deleteOnboardingDocType(id),
  },
  {
    entity: 'onboarding document type',
    loadError: 'Failed to load onboarding document types',
    saveError: 'Failed to save onboarding document type',
    deleteError: 'Failed to delete onboarding document type',
  },
  invalidateEmployeeDropdowns
)

export const useOffboardingDocTypesMaster = createMasterCrudHook(
  {
    getAll: () => onboardingOffboardingService.getOffboardingDocTypes(),
    create: (name) => onboardingOffboardingService.createOffboardingDocType(name),
    update: (id, name) => onboardingOffboardingService.updateOffboardingDocType(id, name),
    delete: (id) => onboardingOffboardingService.deleteOffboardingDocType(id),
  },
  {
    entity: 'offboarding document type',
    loadError: 'Failed to load offboarding document types',
    saveError: 'Failed to save offboarding document type',
    deleteError: 'Failed to delete offboarding document type',
  },
  invalidateEmployeeDropdowns
)
