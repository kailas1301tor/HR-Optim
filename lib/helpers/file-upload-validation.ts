// lib/helpers/file-upload-validation.ts

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export const ALLOWED_UPLOAD_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const

export function isAllowedUploadFile(file: unknown): file is File {
  if (!(file instanceof File)) return false
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) return false
  return ALLOWED_UPLOAD_MIME_TYPES.includes(file.type as (typeof ALLOWED_UPLOAD_MIME_TYPES)[number])
}

export const FILE_UPLOAD_ERROR_MESSAGE =
  'Upload a PDF or image (JPG, PNG, WEBP) up to 10MB'
