// types/ticket.ts

export type TicketPriority = 'High' | 'Medium' | 'Low'

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
