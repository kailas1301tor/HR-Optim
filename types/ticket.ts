// types/ticket.ts

export type TicketPriority = 'High' | 'Medium' | 'Low'

export type TicketStatus =
  | 'pending'
  | 'in_progress'
  | 'approved'
  | 'resolved'
  | 'closed'
  | 'rejected'

export interface BackendTicketAttachment {
  id?: number
  file?: string
  url?: string
  name?: string
}

export interface BackendTicket {
  id: number
  title?: string
  description?: string
  priority?: string
  status?: string
  attachments?: BackendTicketAttachment[] | string[]
  created_at?: string
  updated_at?: string
}

export interface TicketAttachment {
  id: number
  url: string
  name: string
  isImage: boolean
}

export interface TicketRecord {
  id: number
  title: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  attachments: TicketAttachment[]
  attachmentCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateTicketInput {
  title: string
  description: string
  priority: TicketPriority
  files?: File[]
}

export interface UpdateTicketInput {
  title?: string
  description?: string
  priority?: TicketPriority
  files?: File[]
}
