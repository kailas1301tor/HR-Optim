// services/department-service.ts
import { api } from '@/lib/api'
import type { Department } from '@/types/settings'

export type { Department } from '@/types/settings'

export interface DepartmentResponse {
  message: string
  results: {
    data: Department[]
  }
}

export interface SingleDepartmentResponse {
  message: string
  results: {
    data: Department
  }
}

export const departmentService = {
  async getDepartments(signal?: AbortSignal): Promise<Department[]> {
    const response = await api.get<DepartmentResponse>('/api/master/departments/', { signal })
    return response.results?.data ?? []
  },

  async createDepartment(name: string, description: string): Promise<Department> {
    const response = await api.post<SingleDepartmentResponse>('/api/master/departments/', {
      name,
      description,
    })
    return response.results.data
  },

  async updateDepartment(id: number, name: string, description: string): Promise<Department> {
    const response = await api.put<SingleDepartmentResponse>('/api/master/departments/', {
      id,
      name,
      description,
    })
    return response.results.data
  },

  async deleteDepartment(id: number): Promise<void> {
    await api.delete('/api/master/departments/', { params: { id } })
  },
}
