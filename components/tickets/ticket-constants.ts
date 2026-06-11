// components/tickets/ticket-constants.ts
import type { StatusBadgeVariant } from '@/lib/ui/design-system'
import type { TicketPriority } from '@/types/ticket'

export const TICKET_PRIORITIES: TicketPriority[] = ['High', 'Medium', 'Low']

export const TICKET_PRIORITY_VARIANT: Record<TicketPriority, StatusBadgeVariant> = {
  High: 'rejected',
  Medium: 'expiring',
  Low: 'valid',
}
