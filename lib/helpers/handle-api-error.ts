// lib/helpers/handle-api-error.ts
import { ApiError } from '@/lib/api'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'

export interface HandleApiErrorResult {
  message: string
  fieldErrors: Record<string, string>
}

export function handleApiError(error: unknown, fallback: string): HandleApiErrorResult {
  const message = getApiErrorMessage(error, fallback)
  const fieldErrors: Record<string, string> = {}

  if (error instanceof ApiError && error.data && typeof error.data === 'object' && 'errors' in error.data) {
    const backendErrors = (error.data as { errors: Record<string, unknown> }).errors
    if (backendErrors && typeof backendErrors === 'object') {
      Object.entries(backendErrors).forEach(([field, messages]) => {
        const messagesArr = Array.isArray(messages) ? messages : [String(messages)]
        if (messagesArr.length > 0) fieldErrors[field] = String(messagesArr[0])
      })
    }
  }

  return { message, fieldErrors }
}
