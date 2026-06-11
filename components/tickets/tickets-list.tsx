// components/tickets/tickets-list.tsx
'use client'

import { LifeBuoy, Plus } from 'lucide-react'
import {
  CommonEmptyState,
  CommonErrorState,
  CommonFilterChips,
  CommonListToolbar,
  CommonMobileCardGrid,
  CommonPageHeader,
  CommonStatusBadge,
} from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { uiCard, uiTableShell } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { CreateTicketDialog } from './create-ticket-dialog'
import { TicketDeleteDialog, TicketDetailDialog } from './ticket-detail-dialog'
import { TICKET_PRIORITY_VARIANT } from './ticket-constants'
import { useTicketsList } from './useTicketsList'
import { useTicketActions } from './useTicketActions'
import type { TicketPriorityFilter } from './useTicketsList'

const PRIORITY_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
] as const

export function TicketsList() {
  const {
    filteredTickets,
    isLoading,
    hasError,
    errorMessage,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    reload,
  } = useTicketsList()

  const {
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
  } = useTicketActions({ onSuccess: reload })

  if (hasError) {
    return (
      <CommonErrorState
        title="Failed to load tickets"
        message={errorMessage ?? 'Please try again.'}
        onRetry={reload}
      />
    )
  }

  return (
    <div className="space-y-6">
      <CommonPageHeader
        title="Tickets"
        subtitle="Raise and track support tickets"
        action={
          <PrimaryButton className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            Raise Ticket
          </PrimaryButton>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <CommonListToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search tickets..."
          className="w-full sm:max-w-md"
        />
        <CommonFilterChips
          options={[...PRIORITY_FILTERS]}
          value={priorityFilter}
          onChange={(value) => setPriorityFilter(value as TicketPriorityFilter)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={cn(uiCard, 'h-20 animate-pulse bg-midnight/60')} />
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <CommonEmptyState
          icon={LifeBuoy}
          title="No tickets"
          description="Raise a ticket to get help from support."
          actions={
            <PrimaryButton onClick={() => setIsCreateOpen(true)}>Raise Ticket</PrimaryButton>
          }
        />
      ) : (
        <>
          <div className={cn(uiTableShell, 'hidden lg:block overflow-x-auto')}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Priority
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-border/50 hover:bg-midnight/40 cursor-pointer"
                    onClick={() => setDetailTarget(ticket)}
                    onKeyDown={(e) => e.key === 'Enter' && setDetailTarget(ticket)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ticket ${ticket.title}`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-cloud">{ticket.title}</p>
                      <p className="text-xs text-slate-400 truncate max-w-md">{ticket.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <CommonStatusBadge
                        label={ticket.priority}
                        variant={TICKET_PRIORITY_VARIANT[ticket.priority]}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CommonMobileCardGrid className="lg:hidden">
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                className={cn(uiCard, 'p-4 text-left w-full')}
                onClick={() => setDetailTarget(ticket)}
                aria-label={`View ticket ${ticket.title}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-cloud">{ticket.title}</p>
                  <CommonStatusBadge
                    label={ticket.priority}
                    variant={TICKET_PRIORITY_VARIANT[ticket.priority]}
                  />
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{ticket.description}</p>
              </button>
            ))}
          </CommonMobileCardGrid>
        </>
      )}

      <CreateTicketDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        isSubmitting={isSubmitting}
        onSubmit={handleCreate}
      />

      <TicketDetailDialog
        ticket={detailTarget}
        onOpenChange={(open) => !open && setDetailTarget(null)}
        isSubmitting={isSubmitting}
        onUpdate={handleUpdate}
        onRequestDelete={() => detailTarget && setDeleteTarget(detailTarget)}
      />

      <TicketDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget?.title ?? ''}
        isDeleting={isSubmitting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
