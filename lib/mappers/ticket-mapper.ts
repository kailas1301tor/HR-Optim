// lib/mappers/ticket-mapper.ts
import {
  isTicketAttachmentImage,
  ticketAttachmentNameFromUrl,
} from '@/lib/helpers/ticket-attachment'
import type {
  BackendTicket,
  BackendTicketAttachment,
  TicketAttachment,
  TicketPriority,
  TicketRecord,
  TicketStatus,
} from '@/types/ticket'

function normalizeTicketStatus(value: string | undefined): TicketStatus {
  const normalized = (value ?? 'pending').trim().toLowerCase().replace(/\s+/g, '_')
  if (normalized === 'approved') return 'approved'
  if (normalized === 'rejected' || normalized === 'cancelled') return 'rejected'
  if (normalized === 'resolved') return 'resolved'
  if (normalized === 'closed') return 'closed'
  if (normalized === 'in_progress') return 'in_progress'
  return 'pending'
}

function normalizePriority(value: string | undefined): TicketPriority {
  const normalized = (value ?? 'Medium').trim()
  if (normalized === 'High' || normalized === 'Low') return normalized
  return 'Medium'
}

function mapAttachment(
  raw: BackendTicketAttachment | string,
  index: number,
): TicketAttachment | null {
  if (typeof raw === 'string') {
    const url = raw.trim()
    if (!url) return null
    return {
      id: index,
      url,
      name: ticketAttachmentNameFromUrl(url),
      isImage: isTicketAttachmentImage(url),
    }
  }

  const url = (raw.file ?? raw.url ?? '').trim()
  if (!url) return null

  return {
    id: raw.id ?? index,
    url,
    name: raw.name?.trim() || ticketAttachmentNameFromUrl(url),
    isImage: isTicketAttachmentImage(url),
  }
}

function mapAttachments(attachments: BackendTicket['attachments']): TicketAttachment[] {
  if (!attachments?.length) return []
  return attachments
    .map((item, index) => mapAttachment(item, index))
    .filter((item): item is TicketAttachment => item !== null)
}

export function mapBackendTicket(record: BackendTicket): TicketRecord {
  const attachments = mapAttachments(record.attachments)

  return {
    id: record.id,
    title: record.title?.trim() || 'Untitled',
    description: record.description?.trim() || '',
    priority: normalizePriority(record.priority),
    status: normalizeTicketStatus(record.status),
    attachments,
    attachmentCount: attachments.length,
    createdAt: record.created_at ?? '',
    updatedAt: record.updated_at ?? '',
  }
}
