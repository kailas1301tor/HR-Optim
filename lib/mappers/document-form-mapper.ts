// lib/mappers/document-form-mapper.ts
import type {
  CompanyDocumentUploadInput,
  EmployeeDocumentUploadInput,
} from '@/validations/document.schema'

export function employeeUploadToFormData(data: EmployeeDocumentUploadInput): FormData {
  const formData = new FormData()
  formData.append('employee', data.employee)
  formData.append('document_type', data.document_type)
  formData.append('document_number', data.document_number)
  formData.append('expiry_date', data.expiry_date)
  if (data.file instanceof File) {
    formData.append('file', data.file)
  }
  return formData
}

export function companyUploadToFormData(data: CompanyDocumentUploadInput): FormData {
  const formData = new FormData()
  formData.append('company_document_type', data.company_document_type)
  formData.append('branch', data.branch)
  formData.append('issue_date', data.issue_date)
  formData.append('expiry_date', data.expiry_date)
  if (data.file instanceof File) {
    formData.append('file', data.file)
  }
  return formData
}
