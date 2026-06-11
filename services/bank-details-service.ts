// services/bank-details-service.ts
import { api } from '@/lib/api'

export interface BankDetailsPayload {
  employee: number
  bank_name: string
  account_number: string
  ifsc: string
  branch: string
}

export interface BankDetailsRecord extends BankDetailsPayload {
  id: number
}

interface BankDetailsListResponse {
  message: string
  results: { data: BankDetailsRecord[] }
}

interface BankDetailsSingleResponse {
  message: string
  results: { data: BankDetailsRecord }
}

export const bankDetailsService = {
  async list(signal?: AbortSignal): Promise<BankDetailsRecord[]> {
    const response = await api.get<BankDetailsListResponse>('/api/employee/bank-details/', { signal })
    return response.results?.data ?? []
  },

  async create(payload: BankDetailsPayload): Promise<BankDetailsRecord> {
    const response = await api.post<BankDetailsSingleResponse>('/api/employee/bank-details/', payload)
    return response.results.data
  },

  async update(id: number, payload: BankDetailsPayload): Promise<BankDetailsRecord> {
    const response = await api.put<BankDetailsSingleResponse>('/api/employee/bank-details/', { id, ...payload })
    return response.results.data
  },

  async delete(id: number): Promise<void> {
    await api.delete('/api/employee/bank-details/', { params: { id } })
  },

  async upsertForEmployee(
    employeeId: number,
    input: Omit<BankDetailsPayload, 'employee'>,
    existingId?: number,
  ): Promise<BankDetailsRecord> {
    const payload: BankDetailsPayload = { employee: employeeId, ...input }
    if (existingId) {
      return this.update(existingId, payload)
    }
    return this.create(payload)
  },
}
