import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { CreateRequestPage } from '@/components/requests/create-request-page'
import { CreateRequestPageSkeleton } from '@/components/requests/create-request-page-skeleton'

export default function NewRequestPage() {
  return (
    <AppShell>
      <Suspense fallback={<CreateRequestPageSkeleton />}>
        <CreateRequestPage />
      </Suspense>
    </AppShell>
  )
}
