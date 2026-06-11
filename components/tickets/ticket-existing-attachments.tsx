// components/tickets/ticket-existing-attachments.tsx
'use client'

import { ExternalLink, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TicketAttachment } from '@/types/ticket'

interface TicketExistingAttachmentsProps {
  attachments: TicketAttachment[]
  className?: string
}

export function TicketExistingAttachments({
  attachments,
  className,
}: TicketExistingAttachmentsProps) {
  if (attachments.length === 0) return null

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Existing attachments
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {attachments.map((attachment) => (
          <li key={`${attachment.id}-${attachment.url}`}>
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group flex h-full flex-col overflow-hidden rounded-[16px] [corner-shape:squircle]',
                'border border-border/80 bg-midnight/25 transition-colors hover:border-violet-glow/50',
              )}
              aria-label={`Open attachment ${attachment.name}`}
            >
              {attachment.isImage ? (
                <div className="relative aspect-video w-full overflow-hidden bg-midnight/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-midnight/40">
                  <FileText className="h-10 w-10 text-slate-500" aria-hidden />
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-2">
                <p className="min-w-0 flex-1 truncate text-xs font-medium text-cloud">
                  {attachment.name}
                </p>
                <ExternalLink
                  className="h-3.5 w-3.5 shrink-0 text-slate-500 group-hover:text-violet-glow"
                  aria-hidden
                />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
