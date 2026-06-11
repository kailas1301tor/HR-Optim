// app/assets/[id]/page.tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { AssetDetailView } from '@/components/assets/asset-detail-view'
import { AssetDetailSkeleton } from '@/components/assets/asset-detail-skeleton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AssetDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const assetId = Number(resolvedParams.id)

  if (!Number.isFinite(assetId) || assetId <= 0) {
    notFound()
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <Suspense fallback={<AssetDetailSkeleton />}>
          <AssetDetailView assetId={assetId} />
        </Suspense>
      </div>
    </AppShell>
  )
}
