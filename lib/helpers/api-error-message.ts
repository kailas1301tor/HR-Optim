// lib/helpers/api-error-message.ts
import { ApiError } from '@/lib/api'

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : fallback
  }

  const data = error.data as Record<string, unknown> | undefined
  if (!data) return error.message || fallback

  const errors = data.errors
  if (errors && typeof errors === 'object') {
    const messages = Object.values(errors as Record<string, unknown>)
      .flatMap((val) => (Array.isArray(val) ? val : [val]))
      .filter((msg): msg is string => typeof msg === 'string')
    if (messages.length > 0) return messages.join('. ')
  }

  if (typeof data.message === 'string' && data.message) return data.message
  return error.message || fallback
}
