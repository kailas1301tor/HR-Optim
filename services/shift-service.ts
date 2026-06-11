// services/shift-service.ts
import { api } from '@/lib/api'
import type { BackendShift, FrontendShift, LateDeductionPolicy, ShiftPayload } from '@/types/settings'

export type { BackendShift, FrontendShift, LateDeductionPolicy } from '@/types/settings'

interface ShiftListResponse {
  message: string
  results: {
    data: BackendShift[]
  }
}

interface SingleShiftResponse {
  message: string
  results: {
    data: BackendShift
  }
}

/** Strip seconds from "HH:MM:SS" → "HH:MM" */
function formatTime(timeStr: string): string {
  if (!timeStr) return ''
  const parts = timeStr.split(':')
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeStr
}

function normalizePolicyTime(time: string): string {
  if (!time) return '09:00'
  const parts = time.split(':')
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`
  return time
}

function mapPolicyToBackend(policy: LateDeductionPolicy): LateDeductionPolicy {
  const time = policy.time.includes(':') && policy.time.split(':').length === 2
    ? `${policy.time}:00`
    : policy.time

  return {
    ...(policy.id != null ? { id: policy.id } : {}),
    name: policy.name.trim(),
    time,
    deduction_type: policy.deduction_type,
    value: policy.value.trim(),
  }
}

function mapBackendPolicy(policy: LateDeductionPolicy): LateDeductionPolicy {
  return {
    id: policy.id,
    name: policy.name,
    time: normalizePolicyTime(policy.time),
    deduction_type: policy.deduction_type,
    value: policy.value,
  }
}

function mapBackendToFrontend(shift: BackendShift): FrontendShift {
  return {
    id: shift.id,
    name: shift.name,
    startTime: formatTime(shift.start_time),
    endTime: formatTime(shift.end_time),
    standardWorkHours: parseFloat(shift.standard_work_hours) || 0,
    isLateDeductionRequired: shift.is_late_deduction_required ?? false,
    lateDeductionPolicies: (shift.late_deduction_policies ?? []).map(mapBackendPolicy),
  }
}

function buildShiftPayload(payload: ShiftPayload): ShiftPayload {
  return {
    name: payload.name,
    start_time: payload.start_time,
    end_time: payload.end_time,
    standard_work_hours: payload.standard_work_hours,
    is_late_deduction_required: payload.is_late_deduction_required,
    late_deduction_policies: payload.is_late_deduction_required
      ? payload.late_deduction_policies.map(mapPolicyToBackend)
      : [],
  }
}

export const shiftService = {
  async getShifts(signal?: AbortSignal): Promise<FrontendShift[]> {
    const response = await api.get<ShiftListResponse>('/api/master/shifts/', { signal })
    return (response.results?.data ?? []).map(mapBackendToFrontend)
  },

  async createShift(payload: ShiftPayload): Promise<FrontendShift> {
    const response = await api.post<SingleShiftResponse>(
      '/api/master/shifts/',
      buildShiftPayload(payload),
    )
    return mapBackendToFrontend(response.results.data)
  },

  async updateShift(payload: ShiftPayload & { id: number }): Promise<FrontendShift> {
    const response = await api.put<SingleShiftResponse>('/api/master/shifts/', {
      id: payload.id,
      ...buildShiftPayload(payload),
    })
    return mapBackendToFrontend(response.results.data)
  },

  async deleteShift(id: number): Promise<void> {
    await api.delete('/api/master/shifts/', { params: { id } })
  },
}
