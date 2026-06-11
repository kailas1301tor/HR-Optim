// services/shift-service.ts
import { api } from '@/lib/api'
import type { BackendShift, FrontendShift } from '@/types/settings'

export type { BackendShift, FrontendShift } from '@/types/settings'

interface ShiftListResponse {
  message: string;
  results: {
    data: BackendShift[];
  };
}

interface SingleShiftResponse {
  message: string;
  results: {
    data: BackendShift;
  };
}

/** Strip seconds from "HH:MM:SS" → "HH:MM" */
function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : timeStr;
}

function mapBackendToFrontend(shift: BackendShift): FrontendShift {
  return {
    id: shift.id,
    name: shift.name,
    startTime: formatTime(shift.start_time),
    endTime: formatTime(shift.end_time),
    standardWorkHours: parseFloat(shift.standard_work_hours) || 0,
  };
}

export const shiftService = {
  /** Fetch all shifts from the API. */
  async getShifts(signal?: AbortSignal): Promise<FrontendShift[]> {
    const response = await api.get<ShiftListResponse>('/api/master/shifts/', { signal });
    return (response.results?.data ?? []).map(mapBackendToFrontend);
  },

  /** Create a new shift. */
  async createShift(payload: {
    name: string;
    start_time: string;
    end_time: string;
    standard_work_hours: string;
  }): Promise<FrontendShift> {
    const response = await api.post<SingleShiftResponse>('/api/master/shifts/', payload);
    return mapBackendToFrontend(response.results.data);
  },

  /** Update an existing shift. */
  async updateShift(payload: {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    standard_work_hours: string;
  }): Promise<FrontendShift> {
    const response = await api.put<SingleShiftResponse>('/api/master/shifts/', payload);
    return mapBackendToFrontend(response.results.data);
  },

  /** Delete a shift by ID. */
  async deleteShift(id: number): Promise<void> {
    await api.delete('/api/master/shifts/', { params: { id } });
  },
};
