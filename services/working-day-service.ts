// services/working-day-service.ts
import { api } from '@/lib/api'
import {
  extractWorkingDayConfigs,
  mapBackendWorkingDayConfig,
  rowsToCreatePayload,
  rowsToUpdatePayload,
  toWorkingDaysViewModel,
} from '@/lib/mappers/working-day-mapper'
import type {
  BackendWorkingDayConfig,
  CreateWorkingDayConfigPayload,
  UpdateWorkingDayConfigPayload,
  WorkingDay,
  WorkingDaysViewModel,
} from '@/types/settings'

interface WorkingDayListResponse {
  message: string
  results: {
    data: unknown
  }
}

interface SingleWorkingDayResponse {
  message: string
  results: {
    data: unknown
  }
}

function resolveSavedConfig(data: unknown): BackendWorkingDayConfig | null {
  const configs = extractWorkingDayConfigs(data)
  if (configs.length > 0) return configs[0]

  return mapBackendWorkingDayConfig(data)
}

export const workingDayService = {
  async getWorkingDays(signal?: AbortSignal): Promise<WorkingDaysViewModel> {
    const response = await api.get<WorkingDayListResponse>('/api/master/working-days/', { signal })
    return toWorkingDaysViewModel(extractWorkingDayConfigs(response.results?.data))
  },

  async createWorkingDayConfig(
    payload: CreateWorkingDayConfigPayload,
  ): Promise<BackendWorkingDayConfig> {
    const response = await api.post<SingleWorkingDayResponse>('/api/master/working-days/', payload)
    const config = resolveSavedConfig(response.results?.data)
    if (!config) {
      throw new Error('Working day configuration was saved but the response could not be parsed.')
    }
    return config
  },

  async updateWorkingDayConfig(
    payload: UpdateWorkingDayConfigPayload,
  ): Promise<BackendWorkingDayConfig> {
    const response = await api.put<SingleWorkingDayResponse>('/api/master/working-days/', payload)
    const config = resolveSavedConfig(response.results?.data)
    if (!config) {
      throw new Error('Working day configuration was saved but the response could not be parsed.')
    }
    return config
  },

  async saveWorkingDays(
    configId: number | null,
    items: WorkingDay[],
  ): Promise<WorkingDaysViewModel> {
    const config = configId
      ? await this.updateWorkingDayConfig(rowsToUpdatePayload(configId, items))
      : await this.createWorkingDayConfig(rowsToCreatePayload(items))

    return toWorkingDaysViewModel([config])
  },
}
