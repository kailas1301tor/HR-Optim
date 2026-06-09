// lib/helpers/parse-auth-form-errors.ts
import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form'

function collectMessages(value: unknown): string[] {
  if (value == null) return []
  if (typeof value === 'string' && value.trim()) return [value.trim()]
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectMessages(item))
  }
  return []
}

export function parseAuthErrorPayload(data: unknown): string[] {
  if (!data || typeof data !== 'object') return []

  const payload = data as Record<string, unknown>
  const messages: string[] = []

  messages.push(...collectMessages(payload.detail))
  messages.push(...collectMessages(payload.message))
  messages.push(...collectMessages(payload.error))
  messages.push(...collectMessages(payload.non_field_errors))

  const nestedErrors = payload.errors
  if (nestedErrors && typeof nestedErrors === 'object') {
    for (const value of Object.values(nestedErrors as Record<string, unknown>)) {
      messages.push(...collectMessages(value))
    }
  }

  return [...new Set(messages.filter(Boolean))]
}

export function applyAuthFieldErrors<T extends FieldValues>(
  data: unknown,
  setError: UseFormSetError<T>,
  fieldMap: Partial<Record<string, FieldPath<T>>>
): string[] {
  const messages = parseAuthErrorPayload(data)

  if (!data || typeof data !== 'object') return messages

  const payload = data as Record<string, unknown>
  const nestedErrors = payload.errors

  if (nestedErrors && typeof nestedErrors === 'object') {
    for (const [field, value] of Object.entries(nestedErrors as Record<string, unknown>)) {
      const formField = fieldMap[field]
      const fieldMessages = collectMessages(value)
      if (formField && fieldMessages.length > 0) {
        setError(formField, { type: 'server', message: fieldMessages[0] })
      }
    }
  }

  return messages
}
