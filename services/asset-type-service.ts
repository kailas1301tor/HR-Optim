// services/asset-type-service.ts
import { api } from '@/lib/api';

export interface AssetType {
  id: number;
  name: string;
  is_active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AssetTypeListResponse {
  message: string;
  results: {
    data: AssetType[];
  };
}

interface SingleAssetTypeResponse {
  message: string;
  results: {
    data: AssetType;
  };
}

export const assetTypeService = {
  async getAssetTypes(signal?: AbortSignal): Promise<AssetType[]> {
    const response = await api.get<AssetTypeListResponse>('/api/master/asset-types/', { signal })
    return response.results?.data ?? []
  },

  /** Create a new asset type. */
  async createAssetType(name: string): Promise<AssetType> {
    const response = await api.post<SingleAssetTypeResponse>('/api/master/asset-types/', { name });
    return response.results.data;
  },

  /** Update an existing asset type. */
  async updateAssetType(id: number, name: string): Promise<AssetType> {
    const response = await api.put<SingleAssetTypeResponse>('/api/master/asset-types/', { id, name });
    return response.results.data;
  },

  /** Delete an asset type by ID. */
  async deleteAssetType(id: number): Promise<void> {
    await api.delete('/api/master/asset-types/', { params: { id } });
  },
};
