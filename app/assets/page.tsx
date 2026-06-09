import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { CommonPageSkeleton } from '@/components/common'
import { AssetsList } from '@/components/assets/assets-list'

export default function AssetsPage() {
  return (
    <AppShell>
      <Suspense fallback={<CommonPageSkeleton />}>
        <AssetsList />
      </Suspense>
    </AppShell>
  )
}
