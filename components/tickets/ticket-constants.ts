// components/tickets/ticket-constants.ts
import type { StatusBadgeVariant } from '@/lib/ui/design-system'
import type { TicketPriority, TicketStatus } from '@/types/ticket'

export const TICKET_PRIORITIES: TicketPriority[] = ['High', 'Medium', 'Low']

export const TICKET_PRIORITY_VARIANT: Record<TicketPriority, StatusBadgeVariant> = {
  High: 'rejected',
  Medium: 'expiring',
  Low: 'valid',
}

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  approved: 'Approved',
  resolved: 'Resolved',
  closed: 'Closed',
  rejected: 'Rejected',
}

export const TICKET_STATUS_VARIANT: Record<TicketStatus, StatusBadgeVariant> = {
  pending: 'pending',
  in_progress: 'in_use',
  approved: 'approved',
  resolved: 'approved',
  closed: 'inactive',
  rejected: 'rejected',
}
