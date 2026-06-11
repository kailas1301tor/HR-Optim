// services/ticket-service.ts
import { api } from '@/lib/api'
import { mapBackendTicket } from '@/lib/mappers/ticket-mapper'
import type { ApiSimpleListResponse, ApiSingleResponse } from '@/lib/types'
import type {
  BackendTicket,
  CreateTicketInput,
  TicketRecord,
  UpdateTicketInput,
} from '@/types/ticket'

function buildTicketFormData(input: CreateTicketInput | UpdateTicketInput): FormData {
  const formData = new FormData()
  if (input.title !== undefined) formData.append('title', input.title)
  if (input.description !== undefined) formData.append('description', input.description)
  if (input.priority !== undefined) formData.append('priority', input.priority)
  input.files?.forEach((file) => {
    formData.append('uploaded_attachments', file)
  })
  return formData
}

export const ticketService = {
  async listTickets(signal?: AbortSignal): Promise<TicketRecord[]> {
    const response = await api.get<ApiSimpleListResponse<BackendTicket>>('/api/tickets/', { signal })
    return (response.results?.data ?? []).map(mapBackendTicket)
  },

  async getTicket(id: number, signal?: AbortSignal): Promise<TicketRecord> {
    const response = await api.get<ApiSingleResponse<BackendTicket>>(`/api/tickets/${id}/`, { signal })
    const data = response.results?.data
    if (!data) throw new Error('Ticket not found')
    return mapBackendTicket(data)
  },

  async createTicket(input: CreateTicketInput): Promise<TicketRecord> {
    const response = await api.post<ApiSingleResponse<BackendTicket>>(
      '/api/tickets/',
      buildTicketFormData(input),
    )
    const data = response.results?.data
    if (!data) throw new Error('Failed to create ticket')
    return mapBackendTicket(data)
  },

  async updateTicket(id: number, input: UpdateTicketInput): Promise<TicketRecord> {
    const response = await api.patch<ApiSingleResponse<BackendTicket>>(
      `/api/tickets/${id}/`,
      buildTicketFormData(input),
    )
    const data = response.results?.data
    if (!data) throw new Error('Failed to update ticket')
    return mapBackendTicket(data)
  },

  async deleteTicket(id: number): Promise<void> {
    await api.delete(`/api/tickets/${id}/`)
  },
}
