// services/asset-status-service.ts
import { api } from '@/lib/api';

export interface AssetStatus {
  id: number;
  name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AssetStatusListResponse {
  message: string;
  results: {
    data: AssetStatus[];
  };
}

interface SingleAssetStatusResponse {
  message: string;
  results: {
    data: AssetStatus;
  };
}

export const assetStatusService = {
  /** Fetch all asset statuses from the API. Handles network failures gracefully. */
  async getAssetStatuses(signal?: AbortSignal): Promise<AssetStatus[]> {
    const response = await api.get<AssetStatusListResponse>('/api/master/asset-status/', { signal })
    return response.results?.data ?? []
  },

  /** Create a new asset status. */
  async createAssetStatus(name: string): Promise<AssetStatus> {
    const response = await api.post<SingleAssetStatusResponse>('/api/master/asset-status/', { name });
    return response.results.data;
  },

  /** Update an existing asset status. */
  async updateAssetStatus(id: number, name: string): Promise<AssetStatus> {
    const response = await api.put<SingleAssetStatusResponse>('/api/master/asset-status/', { id, name });
    return response.results.data;
  },

  /** Delete an asset status by ID. */
  async deleteAssetStatus(id: number): Promise<void> {
    await api.delete('/api/master/asset-status/', { params: { id } });
  },
};
