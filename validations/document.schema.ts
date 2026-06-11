// validations/document.schema.ts
import { z } from 'zod'
import { FILE_UPLOAD_ERROR_MESSAGE, isAllowedUploadFile } from '@/lib/helpers/file-upload-validation'

const uploadFileSchema = z
  .any()
  .refine((val) => val instanceof File, 'Document file is required')
  .refine((val) => isAllowedUploadFile(val), FILE_UPLOAD_ERROR_MESSAGE)

export const employeeDocumentUploadSchema = z.object({
  employee: z.string().min(1, 'Employee is required'),
  document_type: z.string().min(1, 'Document type is required'),
  document_number: z.string().min(1, 'Document number is required').max(50).trim(),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  file: uploadFileSchema,
})

export const companyDocumentUploadSchema = z.object({
  company_document_type: z.string().min(1, 'Document type is required'),
  branch: z.string().min(1, 'Branch is required'),
  issue_date: z.string().min(1, 'Issue date is required'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  file: uploadFileSchema,
})

export type EmployeeDocumentUploadInput = z.infer<typeof employeeDocumentUploadSchema>;
export type CompanyDocumentUploadInput = z.infer<typeof companyDocumentUploadSchema>;
