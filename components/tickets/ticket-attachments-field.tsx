// components/tickets/ticket-attachments-field.tsx
'use client'

import { Upload } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface TicketAttachmentsFieldProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  disabled?: boolean
  id?: string
  label?: string
}

export function TicketAttachmentsField({
  files,
  onFilesChange,
  disabled = false,
  id = 'ticket-attachments',
  label = 'Attachments',
}: TicketAttachmentsFieldProps) {
  const summary =
    files.length === 0
      ? 'Click to select files'
      : files.length === 1
        ? files[0].name
        : `${files.length} files selected`

  const sizeHint =
    files.length === 0
      ? 'Images, PDF, or documents'
      : files.map((f) => f.name).join(', ')

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center border border-dashed border-border/80',
          'rounded-[20px] [corner-shape:squircle] p-5 bg-midnight/25 transition-colors',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-violet-glow/65 group',
        )}
      >
        <input
          id={id}
          type="file"
          multiple
          disabled={disabled}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          aria-label="Ticket attachments"
          onChange={(e) => onFilesChange(Array.from(e.target.files ?? []))}
        />
        <Upload
          className="mb-2 h-7 w-7 text-slate-500 transition-colors group-hover:text-violet-glow"
          aria-hidden
        />
        <p className="max-w-full truncate px-2 text-center text-xs font-semibold text-cloud">{summary}</p>
        <p className="mt-1 max-w-full truncate px-2 text-center text-[10px] text-slate-500">{sizeHint}</p>
      </div>
    </div>
  )
}
