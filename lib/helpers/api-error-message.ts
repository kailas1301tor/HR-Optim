// lib/helpers/api-error-message.ts
import { ApiError } from '@/lib/api'
import { parseAuthErrorPayload } from '@/lib/helpers/parse-auth-form-errors'

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!(error instanceof ApiError)) {
    if (error instanceof TypeError) {
      return 'Unable to reach the server. Check your connection and try again.'
    }
    return error instanceof Error ? error.message : fallback
  }

  const parsed = parseAuthErrorPayload(error.data)
  if (parsed.length > 0) return parsed.join('. ')

  return error.message || fallback
}
