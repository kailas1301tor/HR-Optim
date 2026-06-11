// lib/mappers/document-mapper.ts
import type {
  CompanyDocument,
  DocumentTab,
  DocumentUiStatus,
  EmployeeDocument,
} from '@/types/document'

export function normalizeDocumentStatus(status: string): DocumentUiStatus {
  const statusLower = (status || '').toLowerCase()
  if (statusLower.includes('expired')) return 'expired'
  if (statusLower.includes('expiring') || statusLower.includes('soon')) return 'expiring'
  return 'valid'
}

export function uiStatusToApiFilter(status: string): string | undefined {
  if (!status || status === 'all') return undefined
  if (status === 'expiring') return 'expiring_soon'
  return status
}

export function getFileTypeFromUrl(url: string): 'pdf' | 'doc' | 'img' {
  if (!url) return 'pdf'
  const cleanUrl = url.split('?')[0]
  const ext = cleanUrl.split('.').pop()?.toLowerCase() || ''
  if (ext === 'pdf') return 'pdf'
  if (['doc', 'docx'].includes(ext)) return 'doc'
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'img'
  return 'pdf'
}

export function getDaysUntilExpiry(expiryDateStr: string): number {
  if (!expiryDateStr) return 0
  const expiry = new Date(expiryDateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  expiry.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function isEmployeeDocument(
  doc: EmployeeDocument | CompanyDocument
): doc is EmployeeDocument {
  return 'employee' in doc
}

export function getDocumentDisplayName(
  doc: EmployeeDocument | CompanyDocument,
  type: DocumentTab
): string {
  if (type === 'employee' && isEmployeeDocument(doc)) {
    return String(doc.document_type_name || doc.document_type)
  }
  if (!isEmployeeDocument(doc)) {
    return String(doc.company_document_type_name || doc.company_document_type)
  }
  return 'Document'
}

export function getDocumentSubtitle(
  doc: EmployeeDocument | CompanyDocument,
  type: DocumentTab
): string {
  if (type === 'employee' && isEmployeeDocument(doc)) {
    return String(doc.employee_name || doc.employee)
  }
  if (!isEmployeeDocument(doc)) {
    return String(doc.branch_name || doc.branch)
  }
  return ''
}

export function getDocumentNumber(doc: EmployeeDocument | CompanyDocument): string {
  if (isEmployeeDocument(doc)) {
    return doc.document_number
  }
  return doc.document_number || 'N/A'
}
