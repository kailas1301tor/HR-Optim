// services/assigned-assets-service.ts
import { api } from '@/lib/api'
import { cleanParams } from '@/lib/types'

export interface AssignedAssetRecord {
  id: number
  name?: string
  asset_tag?: string
  asset_type?: string
  status?: string
  assigned_date?: string
}

interface AssignedAssetsResponse {
  message: string
  results: { data: AssignedAssetRecord[] }
}

export const assignedAssetsService = {
  async getByEmployee(employeeId: number, signal?: AbortSignal): Promise<AssignedAssetRecord[]> {
    const response = await api.get<AssignedAssetsResponse>('/api/employee/assigned-assets/', {
      params: cleanParams({ employee_id: employeeId }),
      signal,
    })
    return response.results?.data ?? []
  },
}
