// services/vendor-service.ts
import { api } from '@/lib/api'
import type { BackendVendor, FrontendVendor } from '@/types/settings'

export type { BackendVendor, FrontendVendor } from '@/types/settings'

interface VendorListResponse {
  message: string;
  results: {
    data: BackendVendor[];
  };
}

interface SingleVendorResponse {
  message: string;
  results: {
    data: BackendVendor;
  };
}

function mapBackendToFrontend(vendor: BackendVendor): FrontendVendor {
  return {
    id: vendor.id,
    assetTypeId: vendor.asset_type,
    name: vendor.name,
    description: vendor.description || '',
  };
}

export const vendorService = {
  async getVendors(signal?: AbortSignal): Promise<FrontendVendor[]> {
    const response = await api.get<VendorListResponse>('/api/master/vendors/', { signal })
    return (response.results?.data ?? []).map(mapBackendToFrontend)
  },

  /** Create a new vendor. */
  async createVendor(payload: {
    assetTypeId: number;
    name: string;
    description: string;
  }): Promise<FrontendVendor> {
    const response = await api.post<SingleVendorResponse>('/api/master/vendors/', {
      asset_type: payload.assetTypeId,
      name: payload.name,
      description: payload.description,
    });
    return mapBackendToFrontend(response.results.data);
  },

  /** Update an existing vendor. */
  async updateVendor(payload: {
    id: number;
    assetTypeId: number;
    name: string;
    description: string;
  }): Promise<FrontendVendor> {
    const response = await api.put<SingleVendorResponse>('/api/master/vendors/', {
      id: payload.id,
      asset_type: payload.assetTypeId,
      name: payload.name,
      description: payload.description,
    });
    return mapBackendToFrontend(response.results.data);
  },

  /** Delete a vendor by ID. */
  async deleteVendor(id: number): Promise<void> {
    await api.delete('/api/master/vendors/', { params: { id } });
  },
};
