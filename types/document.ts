// types/document.ts

export type DocumentTab = 'employee' | 'company'

export type DocumentUiStatus = 'valid' | 'expiring' | 'expired'

export interface EmployeeDocument {
  id: number
  employee: string | number
  employee_name?: string
  document_type: string | number
  document_type_name?: string
  document_number: string
  expiry_date: string
  status: 'Valid' | 'Expiring' | 'Expired' | string
  file_url: string
  file?: string
  created_at?: string
  updated_at?: string
  is_active?: boolean
}

export interface CompanyDocument {
  id: number
  company_document_type: string | number
  company_document_type_name?: string
  branch: string | number
  branch_name?: string
  issue_date: string
  expiry_date: string
  status: 'Valid' | 'Expiring' | 'Expired' | string
  file_url: string
  file?: string
  document_number?: string
  created_at?: string
  updated_at?: string
  is_active?: boolean
}

export interface DocumentStatusCounts {
  valid: number
  expiring_soon: number
  expired: number
}

export const EMPTY_DOCUMENT_STATUS_COUNTS: DocumentStatusCounts = {
  valid: 0,
  expiring_soon: 0,
  expired: 0,
}
