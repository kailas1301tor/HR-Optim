// lib/helpers/mask-sensitive.ts

export function maskAccountNumber(value: string | null | undefined): string {
  if (!value || value === '—') return '—'
  const trimmed = value.trim()
  if (trimmed.length <= 4) return '••••'
  return `•••• ${trimmed.slice(-4)}`
}
