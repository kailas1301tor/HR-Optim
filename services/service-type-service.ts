// services/service-type-service.ts
import { api } from '@/lib/api';

export interface ServiceType {
  id: number;
  name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ServiceTypeListResponse {
  message: string;
  results: {
    data: ServiceType[];
  };
}

interface SingleServiceTypeResponse {
  message: string;
  results: {
    data: ServiceType;
  };
}

export const serviceTypeService = {
  /** Fetch all service types from the API. Handles network failures gracefully. */
  async getServiceTypes(signal?: AbortSignal): Promise<ServiceType[]> {
    const response = await api.get<ServiceTypeListResponse>('/api/master/service-types/', { signal })
    return response.results?.data ?? []
  },

  /** Create a new service type. */
  async createServiceType(name: string): Promise<ServiceType> {
    const response = await api.post<SingleServiceTypeResponse>('/api/master/service-types/', { name });
    return response.results.data;
  },

  /** Update an existing service type. */
  async updateServiceType(id: number, name: string): Promise<ServiceType> {
    const response = await api.put<SingleServiceTypeResponse>('/api/master/service-types/', { id, name });
    return response.results.data;
  },

  /** Delete a service type by ID. */
  async deleteServiceType(id: number): Promise<void> {
    await api.delete('/api/master/service-types/', { params: { id } });
  },
};
