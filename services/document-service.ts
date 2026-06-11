// services/document-service.ts
import { api } from '@/lib/api'
import { parseContentDispositionFilename } from '@/lib/helpers/download-blob'
import { cleanParams } from '@/lib/types'
import type { DropdownItem } from '@/lib/types'
import {
  EMPTY_DOCUMENT_STATUS_COUNTS,
  type CompanyDocument,
  type DocumentStatusCounts,
  type EmployeeDocument,
} from '@/types/document'
import type { ApiSimpleListResponse, ApiSingleResponse } from '@/lib/types'
import { employeeDocumentTypeService } from '@/services/employee-document-type-service'
import { companyDocumentTypeService } from '@/services/company-document-type-service'

export type { CompanyDocument, DocumentStatusCounts, EmployeeDocument } from '@/types/document'

export interface EmployeeDocumentDropdowns {
  employee_document_types: DropdownItem[]
}

export interface CompanyDocumentDropdowns {
  company_document_types: DropdownItem[]
  branches: DropdownItem[]
}

interface DocumentListResponse<T> {
  message: string
  results: {
    data: T[]
    total_count?: number
  }
}

interface DocumentCountsResponse {
  message: string
  results: {
    data: DocumentStatusCounts
  }
}

export interface DocumentExportResult {
  blob: Blob
  filename: string
}

function filterActiveMasterTypes<T extends { deleted?: boolean; is_active?: boolean }>(
  items: T[]
): T[] {
  return items.filter((item) => item.deleted !== true && item.is_active !== false)
}

function toDropdownItems(items: Array<{ id: number; name: string }>): DropdownItem[] {
  return items.map(({ id, name }) => ({ id, name }))
}

export const employeeDocumentService = {
  async getStatusCounts(signal?: AbortSignal): Promise<DocumentStatusCounts> {
    const response = await api.get<DocumentCountsResponse>(
      '/api/employee/employee-documents/status-counts/',
      { signal }
    )
    return response.results?.data ?? EMPTY_DOCUMENT_STATUS_COUNTS
  },

  async getAll(
    params?: { search?: string; document_type?: string | number; status?: string },
    signal?: AbortSignal
  ): Promise<EmployeeDocument[]> {
    const response = await api.get<DocumentListResponse<EmployeeDocument>>(
      '/api/employee/employee-documents/',
      {
        params: params ? cleanParams(params) : undefined,
        signal,
      }
    )
    return response.results?.data ?? []
  },

  async upload(formData: FormData): Promise<EmployeeDocument> {
    const response = await api.post<{ results: { data: EmployeeDocument } }>(
      '/api/employee/employee-documents/',
      formData
    )
    if (!response.results?.data) {
      throw new Error('Invalid upload response from server')
    }
    return response.results.data
  },

  async delete(id: number): Promise<void> {
    await api.delete('/api/employee/employee-documents/', { params: { id } })
  },

  async getDropdowns(signal?: AbortSignal): Promise<EmployeeDocumentDropdowns> {
    const types = await employeeDocumentTypeService.getEmployeeDocTypes(signal)
    return {
      employee_document_types: toDropdownItems(filterActiveMasterTypes(types)),
    }
  },

  async exportExpiry(days = 30, signal?: AbortSignal): Promise<DocumentExportResult> {
    const { blob, contentDisposition } = await api.getBlob(
      '/api/employee/employee-documents/export/',
      {
        params: cleanParams({ export_format: 'excel', days }),
        signal,
      },
    )
    return {
      blob,
      filename: parseContentDispositionFilename(contentDisposition, `employee_documents_expiry_${days}d.xlsx`),
    }
  },
}

export const companyDocumentService = {
  async getStatusCounts(signal?: AbortSignal): Promise<DocumentStatusCounts> {
    const response = await api.get<DocumentCountsResponse>(
      '/api/company/company-documents/status-counts/',
      { signal }
    )
    return response.results?.data ?? EMPTY_DOCUMENT_STATUS_COUNTS
  },

  async getAll(
    params?: { search?: string; document_type?: string | number; status?: string },
    signal?: AbortSignal
  ): Promise<CompanyDocument[]> {
    const response = await api.get<DocumentListResponse<CompanyDocument>>(
      '/api/company/company-documents/',
      {
        params: params ? cleanParams(params) : undefined,
        signal,
      }
    )
    return response.results?.data ?? []
  },

  async upload(formData: FormData): Promise<CompanyDocument> {
    const response = await api.post<{ results: { data: CompanyDocument } }>(
      '/api/company/company-documents/',
      formData
    )
    if (!response.results?.data) {
      throw new Error('Invalid upload response from server')
    }
    return response.results.data
  },

  async delete(id: number): Promise<void> {
    await api.delete('/api/company/company-documents/', { params: { id } })
  },

  async getDropdowns(signal?: AbortSignal): Promise<CompanyDocumentDropdowns> {
    const response = await api.get<{ results: { data: CompanyDocumentDropdowns } }>(
      '/api/company/document-dropdowns/',
      { signal }
    )
    const data = response.results?.data ?? { company_document_types: [], branches: [] }

    if (data.company_document_types.length > 0) {
      return data
    }

    const types = await companyDocumentTypeService.getCompanyDocTypes(signal)
    return {
      ...data,
      company_document_types: toDropdownItems(filterActiveMasterTypes(types)),
    }
  },

  async exportExpiry(days = 30, signal?: AbortSignal): Promise<DocumentExportResult> {
    const { blob, contentDisposition } = await api.getBlob(
      '/api/company/company-documents/export/',
      {
        params: cleanParams({ export_format: 'excel', days }),
        signal,
      },
    )
    return {
      blob,
      filename: parseContentDispositionFilename(contentDisposition, `company_documents_expiry_${days}d.xlsx`),
    }
  },
}
