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

interface ShiftDetailResponse {
  message: string
  results: {
    data: BackendShift | BackendShift[]
  }
}

function resolveBackendShift(
  data: BackendShift | BackendShift[] | null | undefined,
  id: number,
): BackendShift | null {
  if (data == null) return null
  if (Array.isArray(data)) {
    if (data.length === 0) return null
    return data.find((shift) => shift.id === id) ?? data[0] ?? null
  }
  return data
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

function parseBooleanFlag(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return normalized === 'true' || normalized === '1'
  }
  return false
}

function mapBackendPolicy(policy: LateDeductionPolicy): LateDeductionPolicy {
  return {
    id: policy.id,
    name: policy.name ?? '',
    time: normalizePolicyTime(policy.time ?? ''),
    deduction_type: policy.deduction_type ?? '',
    value: policy.value != null ? String(policy.value) : '',
  }
}

function mapBackendToFrontend(shift: BackendShift): FrontendShift {
  const lateDeductionPolicies = (shift.late_deduction_policies ?? []).map(mapBackendPolicy)
  const isLateDeductionRequired =
    shift.is_late_deduction_required != null
      ? parseBooleanFlag(shift.is_late_deduction_required)
      : lateDeductionPolicies.length > 0

  const standardHours = parseFloat(String(shift.standard_work_hours ?? ''))

  return {
    id: shift.id,
    name: shift.name ?? '',
    startTime: formatTime(shift.start_time ?? ''),
    endTime: formatTime(shift.end_time ?? ''),
    standardWorkHours: Number.isFinite(standardHours) ? standardHours : 0,
    isLateDeductionRequired,
    lateDeductionPolicies,
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

  async getShiftById(id: number, signal?: AbortSignal): Promise<FrontendShift | null> {
    const response = await api.get<ShiftDetailResponse>('/api/master/shifts/', {
      params: { id },
      signal,
    })
    const shift = resolveBackendShift(response.results?.data, id)
    if (!shift) return null
    return mapBackendToFrontend(shift)
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
