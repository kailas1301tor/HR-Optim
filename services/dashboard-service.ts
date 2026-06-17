// services/dashboard-service.ts
import { api } from '@/lib/api'
import { mapBackendMainDashboard } from '@/lib/mappers/dashboard-mapper'
import type { ApiSingleResponse } from '@/lib/types'
import type { BackendMainDashboard, MainDashboardData } from '@/types/dashboard'

export const dashboardService = {
  async getMainDashboard(signal?: AbortSignal): Promise<MainDashboardData> {
    const response = await api.get<ApiSingleResponse<BackendMainDashboard>>(
      '/api/employee/main-dashboard/',
      { signal },
    )
    const data = response.results?.data ?? {}
    return mapBackendMainDashboard(data)
  },
}
