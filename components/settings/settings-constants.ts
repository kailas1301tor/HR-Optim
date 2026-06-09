// components/settings/settings-constants.ts
import type { WorkflowTemplate } from './workflow-templates'

export interface Role {
  name: string
  description: string
  permissions: string[]
}

export const LEFT_COLUMN_PERMISSIONS = [
  'VIEW DASHBOARD',
  'MANAGE EMPLOYEES',
  'MANAGE PAYROLL',
  'VIEW ALL ATTENDANCE',
  'MANAGE DOCUMENTS',
  'MANAGE SETTINGS',
  'VIEW REPORTS',
  'MANAGE OFFBOARDING',
]

export const RIGHT_COLUMN_PERMISSIONS = [
  'VIEW ADMIN DASHBOARD',
  'VIEW ALL EMPLOYEES',
  'MANAGE ATTENDANCE',
  'MANAGE ASSETS',
  'MANAGE MASTERS',
  'APPROVE REQUESTS',
  'MANAGE ONBOARDING',
]

export const SYSTEM_PERMISSIONS = [...LEFT_COLUMN_PERMISSIONS, ...RIGHT_COLUMN_PERMISSIONS]

export const INITIAL_DEPARTMENTS = [
  'COMPLIANCE',
  'FINANCE',
  'HR',
  'IT',
  'SALES & OPERATIONS',
]

export const INITIAL_BRANCHES = [
  'GOLD CENTER',
  'HEAD OFFICE',
]

export const INITIAL_DESIGNATIONS = [
  'CHIEF ACCOUNTANT PAYROLL',
  'COMPLIANCE OFFICER',
  'CREATIVE DIRECTOR',
  'CYBER HEAD',
  'HR COORDINATOR',
  'SALES COORDINATOR',
  'SALES OFFICER',
  'SENIOR SALES MANAGER',
]

export const INITIAL_ROLES: Role[] = [
  {
    name: 'Admin',
    description: 'Full system access',
    permissions: [...SYSTEM_PERMISSIONS],
  },
  {
    name: 'EMPLOYEE',
    description: 'Self-service access',
    permissions: ['VIEW DASHBOARD', 'VIEW ALL EMPLOYEES'],
  },
  {
    name: 'Finance',
    description: 'Finance approver for loan and salary advance requests before HR review',
    permissions: ['VIEW DASHBOARD', 'MANAGE PAYROLL', 'VIEW REPORTS'],
  },
  {
    name: 'Finance Manager',
    description: 'Finance approver for loan and salary advance requests before HR review',
    permissions: ['VIEW DASHBOARD', 'MANAGE PAYROLL', 'APPROVE REQUESTS', 'VIEW REPORTS'],
  },
  {
    name: 'HR MANAGER',
    description: 'HR module access',
    permissions: [
      'VIEW DASHBOARD',
      'VIEW ADMIN DASHBOARD',
      'MANAGE EMPLOYEES',
      'VIEW ALL EMPLOYEES',
      'MANAGE ATTENDANCE',
      'VIEW ALL ATTENDANCE',
      'MANAGE DOCUMENTS',
      'APPROVE REQUESTS',
      'MANAGE ONBOARDING',
      'MANAGE OFFBOARDING',
    ],
  },
  {
    name: 'Manager',
    description: 'Line manager with first-level leave approval access',
    permissions: ['VIEW DASHBOARD', 'VIEW ADMIN DASHBOARD', 'VIEW ALL EMPLOYEES', 'VIEW ALL ATTENDANCE', 'APPROVE REQUESTS'],
  },
]

export const INITIAL_LEAVE_TYPES = ['ANNUAL LEAVE', 'EMERGENCY LEAVE', 'MATERNITY LEAVE', 'SICK LEAVE', 'UNPAID LEAVE']


export const INITIAL_WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    name: 'OFFBOARDING',
    steps: ['Asset Handover', 'Exit Interview', 'Loan Settlement', 'Final Settlement', 'Visa Cancellation'],
  },
  {
    name: 'ONBOARDING',
    steps: ['IT Setup', 'HR Induction', 'Manager Welcome'],
  },
  {
    name: 'Offboarding',
    steps: ['Exit Interview', 'IT Handover'],
  },
  {
    name: 'Onboarding',
    steps: ['Document Collection', 'Email Creation'],
  },
]

export const INITIAL_ASSET_TYPES = ['LAPTOP', 'MOBILE PHONE', 'MONITOR']
export const INITIAL_ASSET_CATEGORIES = ['IT EQUIPMENT', 'OFFICE FURNITURE']
export const INITIAL_MAINTENANCE_SHOPS = ['LAPTOP REPAIR']
export const INITIAL_STATUS_LABELS = ['AVAILABLE', 'ASSIGNED', 'UNDER REPAIR']

export const INITIAL_ASSET_TYPES_OBJECTS = [
  { id: 1, name: 'LAPTOP' },
  { id: 2, name: 'MOBILE PHONE' },
  { id: 3, name: 'MONITOR' },
]

export const INITIAL_ASSET_CATEGORIES_OBJECTS = [
  { id: 1, name: 'IT EQUIPMENT' },
  { id: 2, name: 'OFFICE FURNITURE' },
]

export const INITIAL_MAINTENANCE_SHOPS_OBJECTS = [
  { id: 1, name: 'LAPTOP REPAIR' },
]

export const INITIAL_STATUS_LABELS_OBJECTS = [
  { id: 1, name: 'AVAILABLE' },
  { id: 2, name: 'ASSIGNED' },
  { id: 3, name: 'UNDER REPAIR' },
]

export const INITIAL_SERVICE_TYPES_OBJECTS = [
  { id: 1, name: 'REPAIR' },
  { id: 2, name: 'MAINTENANCE' },
  { id: 3, name: 'REPLACEMENT' },
]

export const INITIAL_VENDORS_OBJECTS = [
  { id: 1, name: 'DELL', assetTypeId: 1, description: 'HARDWARE VENDOR' },
  { id: 2, name: 'HP', assetTypeId: 1, description: 'HARDWARE VENDOR' },
]


export const INITIAL_NOTIFICATIONS = {
  emailAlerts: true,
  documentExpiry: true,
  leaveRequests: true,
  payrollUpdates: false,
  systemUpdates: true,
}
