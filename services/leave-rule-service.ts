// services/leave-rule-service.ts
import { api } from '@/lib/api'
import type { ApiSimpleListResponse, ApiSingleResponse } from '@/lib/types'

export interface LeaveRule {
  id: number
  leave_type: number
  max_days: string
  is_carry_forward: boolean
  carry_forward_limit: string | null
  accrual_rate: string
  accrual_frequency: string
  is_paid_leave: boolean
  description: string | null
}

export interface ConfigureLeaveRulePayload {
  id?: number
  leave_type: number
  max_days: number
  is_carry_forward: boolean
  carry_forward_limit: number
  accrual_rate: number
  accrual_frequency: string
  is_paid_leave: boolean
  description: string
}

export const leaveRuleService = {
  async getLeaveRules(signal?: AbortSignal): Promise<LeaveRule[]> {
    const response = await api.get<ApiSimpleListResponse<LeaveRule>>(
      '/api/master/leave-rules/',
      { signal },
    )
    return response.results?.data ?? []
  },

  async configureLeaveRule(payload: ConfigureLeaveRulePayload): Promise<LeaveRule> {
    const response = await api.post<ApiSingleResponse<LeaveRule>>(
      '/api/master/leave-rules/',
      payload,
    )
    return response.results.data
  },
}
