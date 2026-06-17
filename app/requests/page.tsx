// app/requests/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { RequestsList } from '@/components/requests/requests-list'
import { RequestsSkeleton } from '@/components/requests/requests-skeleton'

export default function RequestsPage() {
  return (
    <AppShell>
      <Suspense fallback={<RequestsSkeleton variant="employee" />}>
        <RequestsList />
      </Suspense>
    </AppShell>
  )
}
