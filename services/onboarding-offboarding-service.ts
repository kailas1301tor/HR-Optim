// services/onboarding-offboarding-service.ts
import { api } from '@/lib/api'
import { cleanParams } from '@/lib/types'
import type { Employee } from '@/types/employee'

export interface MasterDocType {
  id: number
  name: string
  is_active?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface EmployeeDocument {
  id: number
  document_type: string
  file_url: string
  file?: string
  created_at?: string
  updated_at?: string
  is_active?: boolean
  deleted?: boolean
  employee: number
}

export interface MasterDocTypeListResponse {
  message: string
  results: {
    data: MasterDocType[]
  }
}

export interface MasterDocTypeResponse {
  message: string
  results: {
    data: MasterDocType
  }
}

export interface EmployeeListResponse {
  message: string
  results: {
    total_count: number
    total_pages: number
    current_page: number
    item_per_page: number
    data: Employee[]
  }
}

export interface EmployeeDocumentsResponse {
  message: string
  results: {
    total_count: number
    total_pages: number
    current_page: number
    item_per_page: number
    data: EmployeeDocument[]
  }
}

export interface SingleDocumentResponse {
  message: string
  results: {
    data: EmployeeDocument
  }
}

export const onboardingOffboardingService = {
  async getOnboardingDocTypes(signal?: AbortSignal): Promise<MasterDocType[]> {
    const response = await api.get<MasterDocTypeListResponse>(
      '/api/master/onboarding-document-types/',
      { signal }
    )
    return response.results?.data ?? []
  },

  async createOnboardingDocType(name: string): Promise<MasterDocType> {
    const response = await api.post<MasterDocTypeResponse>(
      '/api/master/onboarding-document-types/',
      { name }
    )
    return response.results.data
  },

  async updateOnboardingDocType(id: number, name: string): Promise<MasterDocType> {
    const response = await api.put<MasterDocTypeResponse>(
      '/api/master/onboarding-document-types/',
      { id, name }
    )
    return response.results.data
  },

  async deleteOnboardingDocType(id: number): Promise<void> {
    await api.delete('/api/master/onboarding-document-types/', { params: { id } })
  },

  async getOffboardingDocTypes(signal?: AbortSignal): Promise<MasterDocType[]> {
    const response = await api.get<MasterDocTypeListResponse>(
      '/api/master/offboarding-document-types/',
      { signal }
    )
    return response.results?.data ?? []
  },

  async createOffboardingDocType(name: string): Promise<MasterDocType> {
    const response = await api.post<MasterDocTypeResponse>(
      '/api/master/offboarding-document-types/',
      { name }
    )
    return response.results.data
  },

  async updateOffboardingDocType(id: number, name: string): Promise<MasterDocType> {
    const response = await api.put<MasterDocTypeResponse>(
      '/api/master/offboarding-document-types/',
      { id, name }
    )
    return response.results.data
  },

  async deleteOffboardingDocType(id: number): Promise<void> {
    await api.delete('/api/master/offboarding-document-types/', { params: { id } })
  },

  async getOnboardingEmployees(
    params: {
      page?: number
      page_size?: number
      search?: string
      department?: number | string
      status?: string
    },
    signal?: AbortSignal
  ): Promise<{
    data: Employee[]
    total_count: number
    total_pages: number
    current_page: number
  }> {
    const response = await api.get<EmployeeListResponse>('/api/employee/onboarding-employees/', {
      params: cleanParams(params),
      signal,
    })
    return {
      data: response.results?.data ?? [],
      total_count: response.results?.total_count ?? 0,
      total_pages: response.results?.total_pages ?? 1,
      current_page: response.results?.current_page ?? 1,
    }
  },

  async getOffboardingEmployees(
    params: {
      page?: number
      page_size?: number
      search?: string
      department?: number | string
      status?: string
    },
    signal?: AbortSignal
  ): Promise<{
    data: Employee[]
    total_count: number
    total_pages: number
    current_page: number
  }> {
    const response = await api.get<EmployeeListResponse>('/api/employee/offboarding-employees/', {
      params: cleanParams(params),
      signal,
    })
    return {
      data: response.results?.data ?? [],
      total_count: response.results?.total_count ?? 0,
      total_pages: response.results?.total_pages ?? 1,
      current_page: response.results?.current_page ?? 1,
    }
  },

  async getOnboardingDocuments(employeeId: number, signal?: AbortSignal): Promise<EmployeeDocument[]> {
    const response = await api.get<EmployeeDocumentsResponse>('/api/employee/onboarding-documents/', {
      params: { employee_id: employeeId },
      signal,
    })
    return response.results?.data ?? []
  },

  async getOffboardingDocuments(employeeId: number, signal?: AbortSignal): Promise<EmployeeDocument[]> {
    const response = await api.get<EmployeeDocumentsResponse>('/api/employee/offboarding-documents/', {
      params: { employee_id: employeeId },
      signal,
    })
    return response.results?.data ?? []
  },

  async uploadOnboardingDocument(formData: FormData): Promise<EmployeeDocument> {
    const response = await api.post<SingleDocumentResponse>(
      '/api/employee/onboarding-documents/',
      formData
    )
    return response.results.data
  },

  async uploadOffboardingDocument(formData: FormData): Promise<EmployeeDocument> {
    const response = await api.post<SingleDocumentResponse>(
      '/api/employee/offboarding-documents/',
      formData
    )
    return response.results.data
  },
}
