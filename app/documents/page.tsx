import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { CommonPageHeader, CommonPageSkeleton } from '@/components/common'
import { DocumentsGrid } from '@/components/documents/documents-grid'

export default function DocumentsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <CommonPageHeader
          title="Documents"
          subtitle="Manage employee documents and track expiry dates"
        />

        <Suspense fallback={<CommonPageSkeleton />}>
          <DocumentsGrid />
        </Suspense>
      </div>
    </AppShell>
  )
}
