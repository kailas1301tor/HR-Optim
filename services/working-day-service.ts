// services/working-day-service.ts
import { api } from '@/lib/api'
import type { UpdateWorkingDayPayload, WorkingDay } from '@/types/settings'

interface WorkingDayListResponse {
  message: string
  results: {
    data: WorkingDay[]
  }
}

interface SingleWorkingDayResponse {
  message: string
  results: {
    data: WorkingDay
  }
}

export const workingDayService = {
  async getWorkingDays(signal?: AbortSignal): Promise<WorkingDay[]> {
    const response = await api.get<WorkingDayListResponse>('/api/master/working-days/', { signal })
    return response.results?.data ?? []
  },

  async updateWorkingDay(payload: UpdateWorkingDayPayload): Promise<WorkingDay> {
    const response = await api.put<SingleWorkingDayResponse>('/api/master/working-days/', payload)
    return response.results.data
  },
}
