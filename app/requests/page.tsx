import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { CommonPageSkeleton } from '@/components/common'
import { RequestsList } from '@/components/requests/requests-list'

export default function RequestsPage() {
  return (
    <AppShell>
      <Suspense fallback={<CommonPageSkeleton />}>
        <RequestsList />
      </Suspense>
    </AppShell>
  )
}
