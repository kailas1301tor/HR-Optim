// app/tickets/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { TicketsList } from '@/components/tickets/tickets-list'
import { TicketsSkeleton } from '@/components/tickets/tickets-skeleton'

export default function TicketsPage() {
  return (
    <AppShell>
      <Suspense fallback={<TicketsSkeleton />}>
        <TicketsList />
      </Suspense>
    </AppShell>
  )
}
