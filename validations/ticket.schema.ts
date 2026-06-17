// validations/ticket.schema.ts
import { z } from 'zod'
import { LIMIT_DESCRIPTION, LIMIT_SHORT_NAME, requiredTrimmedString } from './field-limits'

export const createTicketSchema = z.object({
  title: requiredTrimmedString('Title', LIMIT_SHORT_NAME),
  description: requiredTrimmedString('Description', LIMIT_DESCRIPTION),
  priority: z.enum(['Low', 'Medium', 'High']),
})

export const updateTicketSchema = z.object({
  description: requiredTrimmedString('Description', LIMIT_DESCRIPTION),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
})

export type CreateTicketFormInput = z.infer<typeof createTicketSchema>
export type UpdateTicketFormInput = z.infer<typeof updateTicketSchema>
