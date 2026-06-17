// app/assets/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { TableSkeleton } from '@/components/common'
import { AssetsList } from '@/components/assets/assets-list'

export default function AssetsPage() {
  return (
    <AppShell>
      <Suspense fallback={<TableSkeleton />}>
        <AssetsList />
      </Suspense>
    </AppShell>
  )
}
