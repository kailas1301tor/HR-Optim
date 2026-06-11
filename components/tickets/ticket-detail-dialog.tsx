// components/tickets/ticket-detail-dialog.tsx
'use client'

import { useEffect, useState } from 'react'
import { SettingsDeleteDialog } from '@/components/settings/shared/settings-delete-dialog'
import { SettingsFormDialog } from '@/components/settings/shared/settings-form-dialog'
import { CommonStatusBadge } from '@/components/common'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { uiInput, uiSelect } from '@/lib/ui/design-system'
import { TicketAttachmentsField } from './ticket-attachments-field'
import { TicketExistingAttachments } from './ticket-existing-attachments'
import { TICKET_PRIORITIES, TICKET_PRIORITY_VARIANT } from './ticket-constants'
import type { TicketPriority, TicketRecord, UpdateTicketInput } from '@/types/ticket'

const labelClass = 'text-xs font-semibold uppercase tracking-wider text-muted-foreground'

interface TicketDetailDialogProps {
  ticket: TicketRecord | null
  onOpenChange: (open: boolean) => void
  isSubmitting: boolean
  onUpdate: (id: number, input: UpdateTicketInput) => Promise<void>
  onRequestDelete: () => void
}

export function TicketDetailDialog({
  ticket,
  onOpenChange,
  isSubmitting,
  onUpdate,
  onRequestDelete,
}: TicketDetailDialogProps) {
  const [priority, setPriority] = useState<TicketPriority>('Medium')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    if (ticket) {
      setPriority(ticket.priority)
      setDescription(ticket.description)
      setFiles([])
    }
  }, [ticket])

  if (!ticket) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onUpdate(ticket.id, {
      priority,
      description: description.trim(),
      files: files.length > 0 ? files : undefined,
    })
  }

  const createdLabel = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleString()
    : 'Unknown date'

  return (
    <SettingsFormDialog
      open={ticket !== null}
      onOpenChange={onOpenChange}
      title={ticket.title}
      description={`Created ${createdLabel}`}
      submitLabel="Save Changes"
      isSubmitting={isSubmitting}
      size="lg"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <CommonStatusBadge
          label={ticket.priority}
          variant={TICKET_PRIORITY_VARIANT[ticket.priority]}
        />

        <div className="space-y-2">
          <Label htmlFor="detail-priority" className={labelClass}>
            Priority
          </Label>
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as TicketPriority)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="detail-priority" className={uiSelect}>
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

        <div className="space-y-2">
          <Label htmlFor="detail-description" className={labelClass}>
            Description
          </Label>
          <Textarea
            id="detail-description"
            className={uiInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <TicketExistingAttachments attachments={ticket.attachments} />

        <TicketAttachmentsField
          id="detail-attachments"
          label={ticket.attachments.length > 0 ? 'Add attachments' : 'Attachments'}
          files={files}
          onFilesChange={setFiles}
          disabled={isSubmitting}
        />

        <button
          type="button"
          className="text-sm text-red-400 transition-colors hover:text-red-300"
          onClick={onRequestDelete}
          disabled={isSubmitting}
        >
          Delete ticket
        </button>
      </div>
    </SettingsFormDialog>
  )
}

interface TicketDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  isDeleting: boolean
  onConfirm: () => void
}

export function TicketDeleteDialog({
  open,
  onOpenChange,
  title,
  isDeleting,
  onConfirm,
}: TicketDeleteDialogProps) {
  return (
    <SettingsDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete ticket"
      description={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
      isDeleting={isDeleting}
      onConfirm={onConfirm}
    />
  )
}
