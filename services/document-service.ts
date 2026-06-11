// services/document-service.ts
import { api } from '@/lib/api'
import { cleanParams } from '@/lib/types'
import type { DropdownItem } from '@/lib/types'
import {
  EMPTY_DOCUMENT_STATUS_COUNTS,
  type CompanyDocument,
  type DocumentStatusCounts,
  type EmployeeDocument,
} from '@/types/document'
import type { ApiSimpleListResponse, ApiSingleResponse } from '@/lib/types'

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
    const response = await api.get<{ results: { data: EmployeeDocumentDropdowns } }>(
      '/api/employee/dropdowns/',
      { signal }
    )
    return response.results?.data ?? { employee_document_types: [] }
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
    return response.results?.data ?? { company_document_types: [], branches: [] }
  },
}
