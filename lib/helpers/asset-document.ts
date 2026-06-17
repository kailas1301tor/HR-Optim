// lib/helpers/asset-document.ts
import { resolveBackendOrigin } from '@/lib/env'
import type { AssetDocument } from '@/types/asset'

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
}

function toString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  const s = String(value).trim()
  return s.length > 0 ? s : undefined
}

export function resolveAssetDocumentUrl(raw: string | null | undefined): string {
  const url = (raw ?? '').trim()
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url

  const origin = resolveBackendOrigin()
  return url.startsWith('/') ? `${origin}${url}` : `${origin}/${url}`
}

export function formatAssetDocumentDate(raw: string | null | undefined): string {
  if (!raw?.trim()) return '—'
  const parsed = new Date(raw.trim())
  if (Number.isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleDateString()
}

function resolveDocumentType(raw: Record<string, unknown>): string {
  const docTypeRaw = raw.document_type
  if (typeof docTypeRaw === 'object' && docTypeRaw !== null) {
    const obj = docTypeRaw as Record<string, unknown>
    return toString(obj.name) ?? String(toNumber(obj.id) ?? '')
  }
  return toString(docTypeRaw) ?? ''
}

function resolveUploadedAt(raw: Record<string, unknown>): string {
  return (
    toString(raw.uploaded_at) ??
    toString(raw.created_at) ??
    toString(raw.date) ??
    toString(raw.upload_date) ??
    ''
  )
}

function resolveFileUrl(raw: Record<string, unknown>): string {
  const fileRaw =
    toString(raw.file) ??
    toString(raw.file_url) ??
    toString(raw.document_url) ??
    toString(raw.url) ??
    ''
  return resolveAssetDocumentUrl(fileRaw)
}

export function mapAssetDocumentFromApi(raw: Record<string, unknown>): AssetDocument {
  return {
    id: toNumber(raw.id) ?? 0,
    document_type: resolveDocumentType(raw),
    file_url: resolveFileUrl(raw),
    uploaded_at: resolveUploadedAt(raw),
  }
}

export function openAssetDocument(url: string): void {
  if (!url) return
  const opened = window.open(url, '_blank', 'noopener,noreferrer')
  if (opened) opened.opener = null
}
