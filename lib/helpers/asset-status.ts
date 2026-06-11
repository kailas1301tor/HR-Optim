// lib/helpers/asset-status.ts

export function isAssetDisposed(status: string | null | undefined): boolean {
  const normalized = status?.toLowerCase() ?? ''
  return normalized.includes('dispose') || normalized.includes('delete')
}

export function isAssetInService(status: string | null | undefined): boolean {
  const normalized = status?.toLowerCase() ?? ''
  return (
    normalized.includes('assigned') ||
    normalized.includes('service') ||
    normalized.includes('in use') ||
    normalized.includes('in-use')
  )
}

export function formatAssetCost(value: string | number | null | undefined): string {
  const parsed = typeof value === 'string' ? parseFloat(value) : (value ?? 0)
  if (!Number.isFinite(parsed)) return '—'
  return `AED ${parsed.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}
