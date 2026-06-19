// services/leave-type-service.ts
import { api } from '@/lib/api';

export interface LeaveType {
  id: number;
  name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  is_document_required?: boolean;
}

interface LeaveTypeListResponse {
  message: string;
  results: {
    data: LeaveType[];
  };
}

interface SingleLeaveTypeResponse {
  message: string;
  results: {
    data: LeaveType;
  };
}

export const leaveTypeService = {
  /** Fetch all leave types from the API. */
  async getLeaveTypes(signal?: AbortSignal): Promise<LeaveType[]> {
    const response = await api.get<LeaveTypeListResponse>('/api/master/leave-types/', { signal });
    return response.results?.data ?? [];
  },

  /** Create a new leave type. */
  async createLeaveType(name: string): Promise<LeaveType> {
    const response = await api.post<SingleLeaveTypeResponse>('/api/master/leave-types/', { name });
    return response.results.data;
  },

  /** Update an existing leave type. */
  async updateLeaveType(id: number, name: string): Promise<LeaveType> {
    const response = await api.put<SingleLeaveTypeResponse>('/api/master/leave-types/', { id, name });
    return response.results.data;
  },

  /** Delete a leave type by ID. */
  async deleteLeaveType(id: number): Promise<void> {
    await api.delete('/api/master/leave-types/', { params: { id } });
  },
};
