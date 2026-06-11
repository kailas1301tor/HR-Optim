// components/tickets/create-ticket-dialog.tsx
'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SettingsFormDialog } from '@/components/settings/shared/settings-form-dialog'
import { CommonFormFieldError } from '@/components/common'
import { uiInput, uiSelect } from '@/lib/ui/design-system'
import { TicketAttachmentsField } from './ticket-attachments-field'
import { TICKET_PRIORITIES } from './ticket-constants'
import type { CreateTicketInput, TicketPriority } from '@/types/ticket'

interface CreateTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isSubmitting: boolean
  onSubmit: (input: CreateTicketInput) => Promise<void>
}

const labelClass = 'text-xs font-semibold uppercase tracking-wider text-muted-foreground'

export function CreateTicketDialog({
  open,
  onOpenChange,
  isSubmitting,
  onSubmit,
}: CreateTicketDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('Medium')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setTitle('')
      setDescription('')
      setPriority('Medium')
      setFiles([])
      setError(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setError(null)
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      files,
    })
  }

  return (
    <SettingsFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Raise Ticket"
      description="Describe the issue and attach files if needed."
      submitLabel="Submit Ticket"
      isSubmitting={isSubmitting}
      size="lg"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ticket-title" className={labelClass}>
            Title
          </Label>
          <Input
            id="ticket-title"
            className={uiInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief summary"
            disabled={isSubmitting}
            required
          />
          <CommonFormFieldError message={error ?? undefined} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticket-description" className={labelClass}>
            Description
          </Label>
          <Textarea
            id="ticket-description"
            className={uiInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail"
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticket-priority" className={labelClass}>
            Priority
          </Label>
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as TicketPriority)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="ticket-priority" className={uiSelect}>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border text-xs">
              {TICKET_PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TicketAttachmentsField
          files={files}
          onFilesChange={setFiles}
          disabled={isSubmitting}
        />
      </div>
    </SettingsFormDialog>
  )
}
