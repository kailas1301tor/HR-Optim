// lib/helpers/ticket-attachment.ts

const IMAGE_EXTENSION_PATTERN = /\.(png|jpe?g|gif|webp|svg|bmp)(\?|$)/i

export function isTicketAttachmentImage(url: string): boolean {
  return IMAGE_EXTENSION_PATTERN.test(url)
}

export function ticketAttachmentNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const segment = pathname.split('/').pop()
    return segment ? decodeURIComponent(segment) : 'attachment'
  } catch {
    const segment = url.split('/').pop()
    return segment ? decodeURIComponent(segment) : 'attachment'
  }
}
