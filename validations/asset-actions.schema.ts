// validations/asset-actions.schema.ts
import { z } from 'zod'
import { FILE_UPLOAD_ERROR_MESSAGE, isAllowedUploadFile } from '@/lib/helpers/file-upload-validation'

export const assignAssetSchema = z.object({
  assign_to_employee: z.coerce.number().positive({ message: 'Please select an employee' }),
  remarks: z.string().max(500, { message: 'Remarks must not exceed 500 characters' }).optional().or(z.literal('')),
});

export const transferAssetSchema = z.object({
  transfer_to_department: z.coerce.number().positive({ message: 'Please select a department' }),
  remarks: z.string().max(500, { message: 'Remarks must not exceed 500 characters' }).optional().or(z.literal('')),
});

export const maintenanceSchema = z.object({
  service_type: z.coerce.number().positive({ message: 'Please select a service type' }),
  service_provider: z.coerce.number().positive({ message: 'Please select a service provider' }),
  estimated_cost: z.coerce.number().nonnegative({ message: 'Estimated cost must be a positive number' }),
});

export const returnAssetSchema = z.object({
  return_to_department: z.coerce.number().positive({ message: 'Please select a department' }),
  return_date: z.string().min(1, { message: 'Return date is required' }),
  service_cost: z.coerce.number().nonnegative({ message: 'Service cost must be a non-negative number' }).optional(),
});

export const disposeAssetSchema = z.object({
  disposal_date: z.string().min(1, { message: 'Disposal date is required' }),
  disposal_method: z.string().min(1, { message: 'Please select a disposal method' }),
  disposal_value: z.coerce.number().nonnegative({ message: 'Disposal value must be a non-negative number' }),
});

export const addAMCSchema = z.object({
  service_provider: z.coerce.number().positive({ message: 'Please select a service provider' }),
  contract_number: z.string().min(1, { message: 'Contract number is required' }).max(100),
  start_date: z.string().min(1, { message: 'Start date is required' }),
  end_date: z.string().min(1, { message: 'End date is required' }),
  amc_cost: z.coerce.number().nonnegative({ message: 'AMC cost must be a non-negative number' }),
  coverage_details: z.string().min(1, { message: 'Coverage details are required' }).max(1000),
}).refine(
  (data) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    return end > start;
  },
  {
    message: 'End date must be after start date',
    path: ['end_date'],
  }
);

export const uploadDocumentSchema = z.object({
  document_type: z.coerce.number().positive({ message: 'Please select a document type' }),
  file: z
    .any()
    .refine((file) => file instanceof File, { message: 'Please upload a file' })
    .refine((file) => isAllowedUploadFile(file), { message: FILE_UPLOAD_ERROR_MESSAGE }),
})

export type AssignAssetInput = z.infer<typeof assignAssetSchema>;
export type TransferAssetInput = z.infer<typeof transferAssetSchema>;
export type MaintenanceInput = z.infer<typeof maintenanceSchema>;
export type ReturnAssetInput = z.infer<typeof returnAssetSchema>;
export type DisposeAssetInput = z.infer<typeof disposeAssetSchema>;
export type AddAMCInput = z.infer<typeof addAMCSchema>;
export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
