// services/asset-document-type-service.ts
import { api } from '@/lib/api'

export interface AssetDocumentType {
  id: number
  name: string
}

interface AssetDocumentTypeListResponse {
  message: string
  results: { data: AssetDocumentType[] }
}

interface SingleAssetDocumentTypeResponse {
  message: string
  results: { data: AssetDocumentType }
}

export const assetDocumentTypeService = {
  async getAll(signal?: AbortSignal): Promise<AssetDocumentType[]> {
    const response = await api.get<AssetDocumentTypeListResponse>(
      '/api/master/asset-document-types/',
      { signal },
    )
    return response.results?.data ?? []
  },

  async create(name: string): Promise<AssetDocumentType> {
    const response = await api.post<SingleAssetDocumentTypeResponse>(
      '/api/master/asset-document-types/',
      { name },
    )
    return response.results.data
  },

  async update(id: number, name: string): Promise<AssetDocumentType> {
    const response = await api.put<SingleAssetDocumentTypeResponse>(
      '/api/master/asset-document-types/',
      { id, name },
    )
    return response.results.data
  },

  async delete(id: number): Promise<void> {
    await api.delete('/api/master/asset-document-types/', { params: { id } })
  },
}
