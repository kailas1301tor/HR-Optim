// validations/asset.schema.ts
import { z } from 'zod'
import { LIMIT_SHORT_NAME } from './field-limits'

export const assetSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Asset name is required').max(LIMIT_SHORT_NAME).trim(),
  serial_number: z.string().max(LIMIT_SHORT_NAME).optional().or(z.literal('')),
  asset_type: z.coerce.number({ invalid_type_error: 'Asset type is required' }).min(1, 'Asset type is required'),
  asset_category: z.coerce.number({ invalid_type_error: 'Asset category is required' }).min(1, 'Asset category is required'),
  department: z.coerce.number({ invalid_type_error: 'Department is required' }).min(1, 'Department is required'),
  location: z.string().max(LIMIT_SHORT_NAME).optional().or(z.literal('')),
  sub_location: z.string().max(LIMIT_SHORT_NAME).optional().or(z.literal('')),
  purchase_cost: z.string().optional().or(z.literal('')),
  purchase_date: z.string().optional().or(z.literal('')),
  warranty_period: z.string().optional().or(z.literal('')),
  service_due_date: z.string().optional().or(z.literal('')),
  status: z.coerce.number({ invalid_type_error: 'Status is required' }).min(1, 'Status is required'),
})

export type AssetInput = z.infer<typeof assetSchema>
