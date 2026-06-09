// validations/request.schema.ts
import * as z from 'zod'

const dateStringSchema = z
  .string()
  .min(1, { message: 'Date is required' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Invalid date format' })

export const leaveRequestSchema = z
  .object({
    leave_type: z.coerce.number().min(1, { message: 'Leave type is required' }),
    from_date: dateStringSchema,
    to_date: dateStringSchema,
    start_session: z.string().min(1, { message: 'Start session is required' }),
    end_session: z.string().min(1, { message: 'End session is required' }),
    number_of_days: z.coerce.number().min(0.5, { message: 'Calculate leave days first' }),
    reason: z.string().min(3, { message: 'Reason must be at least 3 characters' }).trim(),
  })
  .refine((data) => data.to_date >= data.from_date, {
    message: 'End date must be on or after start date',
    path: ['to_date'],
  })

export const salaryAdvanceRequestSchema = z.object({
  request_amount: z.coerce
    .number()
    .positive({ message: 'Amount must be greater than zero' }),
  tenure: z.coerce
    .number()
    .int({ message: 'Tenure must be a whole number' })
    .min(1, { message: 'Tenure must be at least 1 month' })
    .max(60, { message: 'Tenure cannot exceed 60 months' }),
  reason: z.string().min(3, { message: 'Reason must be at least 3 characters' }).trim(),
})

export const loanRequestSchema = salaryAdvanceRequestSchema

export const documentRequestSchema = z.object({
  document_type: z.string().min(1, { message: 'Document type is required' }),
  purpose: z.string().min(3, { message: 'Purpose must be at least 3 characters' }).trim(),
})

export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>
export type SalaryAdvanceRequestInput = z.infer<typeof salaryAdvanceRequestSchema>
export type LoanRequestInput = z.infer<typeof loanRequestSchema>
export type DocumentRequestInput = z.infer<typeof documentRequestSchema>
