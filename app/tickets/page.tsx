import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { CommonPageSkeleton } from '@/components/common'
import { TicketsList } from '@/components/tickets/tickets-list'

export default function TicketsPage() {
  return (
    <AppShell>
      <Suspense fallback={<CommonPageSkeleton />}>
        <TicketsList />
      </Suspense>
    </AppShell>
  )
}
