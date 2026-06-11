// services/permission-service.ts
import { api } from '@/lib/api'

export interface BackendPermission {
  id: number
  name: string
}

export interface PermissionResponse {
  message: string
  results: {
    data: BackendPermission[]
  }
}

export const permissionService = {
  async getPermissions(signal?: AbortSignal): Promise<BackendPermission[]> {
    const response = await api.get<PermissionResponse>('/api/auth/permissions/', { signal })
    return response.results?.data ?? []
  },
}
