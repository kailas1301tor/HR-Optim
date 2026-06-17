// components/tickets/useTicketActions.ts
'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { ticketService } from '@/services/ticket-service'
import type { CreateTicketInput, TicketRecord, UpdateTicketInput } from '@/types/ticket'

export interface UseTicketActionsProps {
  onSuccess: () => void
}

export function useTicketActions({ onSuccess }: UseTicketActionsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [detailTarget, setDetailTarget] = useState<TicketRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TicketRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = useCallback(
    async (input: CreateTicketInput) => {
      setIsSubmitting(true)
      try {
        await ticketService.createTicket(input)
        toast.success('Ticket created successfully')
        setIsCreateOpen(false)
        onSuccess()
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to create ticket'
        toast.error(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSuccess],
  )

  const handleUpdate = useCallback(
    async (id: number, input: UpdateTicketInput) => {
      setIsSubmitting(true)
      try {
        const updated = await ticketService.updateTicket(id, input)
        toast.success('Ticket updated successfully')
        setDetailTarget(updated)
        onSuccess()
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to update ticket'
        toast.error(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSuccess],
  )

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setIsSubmitting(true)
    try {
      await ticketService.deleteTicket(deleteTarget.id)
      toast.success('Ticket deleted')
      setDeleteTarget(null)
      setDetailTarget(null)
      onSuccess()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete ticket'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [deleteTarget, onSuccess])

  return {
    isCreateOpen,
    setIsCreateOpen,
    detailTarget,
    setDetailTarget,
    deleteTarget,
    setDeleteTarget,
    isSubmitting,
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}
