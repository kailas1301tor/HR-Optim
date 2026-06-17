// components/tickets/ticket-attachments-field.tsx
'use client'

import { useState } from 'react'
import { FileText, Upload, X } from 'lucide-react'
import { CommonFormFieldError } from '@/components/common'
import { Label } from '@/components/ui/label'
import {
  ALLOWED_UPLOAD_MIME_TYPES,
  FILE_UPLOAD_ERROR_MESSAGE,
  isAllowedUploadFile,
} from '@/lib/helpers/file-upload-validation'
import { cn } from '@/lib/utils'

const FILE_ACCEPT = ALLOWED_UPLOAD_MIME_TYPES.join(',')

interface TicketAttachmentsFieldProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  disabled?: boolean
  id?: string
  label?: string
}

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`
}

function mergeFiles(existing: File[], incoming: File[]): File[] {
  const seen = new Set(existing.map(fileKey))
  const merged = [...existing]
  for (const file of incoming) {
    const key = fileKey(file)
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(file)
  }
  return merged
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function TicketAttachmentsField({
  files,
  onFilesChange,
  disabled = false,
  id = 'ticket-attachments',
  label = 'Attachments',
}: TicketAttachmentsFieldProps) {
  const [fileError, setFileError] = useState<string | null>(null)
  const hasFiles = files.length > 0

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const incoming = Array.from(e.target.files ?? [])
    if (incoming.length === 0) return

    const invalidFile = incoming.find((file) => !isAllowedUploadFile(file))
    if (invalidFile) {
      setFileError(FILE_UPLOAD_ERROR_MESSAGE)
      e.target.value = ''
      return
    }

    setFileError(null)
    onFilesChange(mergeFiles(files, incoming))
    e.target.value = ''
  }

  const handleRemoveFile = (index: number): void => {
    onFilesChange(files.filter((_, i) => i !== index))
    if (fileError) setFileError(null)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center border border-dashed border-border/80',
          'rounded-[20px] [corner-shape:squircle] p-5 bg-muted/40 transition-colors',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-violet-glow/65 hover:bg-muted/50 group',
        )}
      >
        <input
          id={id}
          type="file"
          multiple
          accept={FILE_ACCEPT}
          disabled={disabled}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          aria-label="Ticket attachments"
          onChange={handleFileChange}
        />
        <Upload
          className="mb-2 h-7 w-7 text-muted-foreground transition-colors group-hover:text-violet-glow"
          aria-hidden
        />
        <div className="flex items-center gap-2">
          <p className="text-center text-xs font-semibold text-foreground">
            {hasFiles ? 'Add more files' : 'Click to add files'}
          </p>
          {hasFiles ? (
            <span className="rounded-full bg-violet-core/15 px-2 py-0.5 text-[10px] font-medium text-violet-glow tabular-nums">
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-center text-[10px] text-muted-foreground">
          PDF or image (JPG, PNG, WEBP) up to 10MB
        </p>
      </div>

      <CommonFormFieldError message={fileError ?? undefined} />

      {hasFiles ? (
        <ul
          className="max-h-[120px] space-y-1 overflow-y-auto rounded-[16px] [corner-shape:squircle] border border-border/50 bg-muted/20 p-2"
          aria-label="Selected attachments"
        >
          {files.map((file, index) => (
            <li
              key={fileKey(file)}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted/50"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{file.name}</p>
                <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleRemoveFile(index)}
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                  'text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-core/50',
                  disabled && 'pointer-events-none opacity-50',
                )}
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
