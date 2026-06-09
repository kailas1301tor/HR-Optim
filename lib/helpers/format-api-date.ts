// lib/helpers/format-api-date.ts
import { format, parseISO, isValid } from 'date-fns'

export const formatApiDate = (date: Date): string => format(date, 'yyyy-MM-dd')

export const parseApiDate = (value: string): Date | undefined => {
  if (!value) return undefined
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : undefined
}

export const formatDisplayDate = (value: string): string => {
  const parsed = parseApiDate(value)
  if (!parsed) return value
  return format(parsed, 'MMM d, yyyy')
}
