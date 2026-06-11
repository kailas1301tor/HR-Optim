// services/maintenance-shop-service.ts
import { api } from '@/lib/api';

export interface MaintenanceShop {
  id: number;
  name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface MaintenanceShopListResponse {
  message: string;
  results: {
    data: MaintenanceShop[];
  };
}

interface SingleMaintenanceShopResponse {
  message: string;
  results: {
    data: MaintenanceShop;
  };
}

export const maintenanceShopService = {
  /** Fetch all maintenance shops from the API. Handles network failures gracefully. */
  async getMaintenanceShops(signal?: AbortSignal): Promise<MaintenanceShop[]> {
    const response = await api.get<MaintenanceShopListResponse>('/api/master/maintenance-shops/', { signal })
    return response.results?.data ?? []
  },

  /** Create a new maintenance shop. */
  async createMaintenanceShop(name: string): Promise<MaintenanceShop> {
    const response = await api.post<SingleMaintenanceShopResponse>('/api/master/maintenance-shops/', { name });
    return response.results.data;
  },

  /** Update an existing maintenance shop. */
  async updateMaintenanceShop(id: number, name: string): Promise<MaintenanceShop> {
    const response = await api.put<SingleMaintenanceShopResponse>('/api/master/maintenance-shops/', { id, name });
    return response.results.data;
  },

  /** Delete a maintenance shop by ID. */
  async deleteMaintenanceShop(id: number): Promise<void> {
    await api.delete('/api/master/maintenance-shops/', { params: { id } });
  },
};
