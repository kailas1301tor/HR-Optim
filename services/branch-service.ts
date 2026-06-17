// services/branch-service.ts
import { api } from '@/lib/api'
import type { Branch } from '@/types/settings'

export type { Branch } from '@/types/settings'

export interface BranchListResponse {
  message: string
  results: {
    data: Branch[]
  }
}

export interface SingleBranchResponse {
  message: string
  results: {
    data: Branch
  }
}

export const branchService = {
  async getBranches(signal?: AbortSignal): Promise<Branch[]> {
    const response = await api.get<BranchListResponse>('/api/master/branches/', { signal })
    return response.results?.data ?? []
  },

  async createBranch(name: string, address: string): Promise<Branch> {
    const response = await api.post<SingleBranchResponse>('/api/master/branches/', {
      name,
      address,
    })
    return response.results.data
  },

  async updateBranch(id: number, name: string, address: string): Promise<Branch> {
    const response = await api.put<SingleBranchResponse>('/api/master/branches/', {
      id,
      name,
      address,
    })
    return response.results.data
  },

  async deleteBranch(id: number): Promise<void> {
    await api.delete('/api/master/branches/', { params: { id } })
  },
}
