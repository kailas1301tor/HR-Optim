// services/holiday-service.ts
import { api } from '@/lib/api'
import type { CreateHolidayPayload, Holiday, UpdateHolidayPayload } from '@/types/settings'

interface HolidayListResponse {
  message: string
  results: {
    data: Holiday[]
  }
}

interface SingleHolidayResponse {
  message: string
  results: {
    data: Holiday
  }
}

export const holidayService = {
  async getHolidays(signal?: AbortSignal): Promise<Holiday[]> {
    const response = await api.get<HolidayListResponse>('/api/master/holidays/', { signal })
    return response.results?.data ?? []
  },

  async createHoliday(payload: CreateHolidayPayload): Promise<Holiday> {
    const response = await api.post<SingleHolidayResponse>('/api/master/holidays/', payload)
    return response.results.data
  },

  async updateHoliday(payload: UpdateHolidayPayload): Promise<Holiday> {
    const response = await api.put<SingleHolidayResponse>('/api/master/holidays/', payload)
    return response.results.data
  },

  async deleteHoliday(id: number): Promise<void> {
    await api.delete('/api/master/holidays/', { params: { id } })
  },
}
