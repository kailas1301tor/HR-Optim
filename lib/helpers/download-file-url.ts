// lib/helpers/download-file-url.ts
import { downloadBlob } from '@/lib/helpers/download-blob'

function filenameFromUrl(url: string): string {
  const cleanUrl = url.split('?')[0]
  const segment = cleanUrl.split('/').pop()
  return segment && segment.length > 0 ? segment : 'document'
}

export async function downloadFileFromUrl(url: string): Promise<void> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to download file')
  }
  const blob = await response.blob()
  downloadBlob(blob, filenameFromUrl(url))
}
