// app/documents/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { SelfServicePageHeader } from '@/components/common'
import { DocumentsSkeleton } from '@/components/documents/documents-skeleton'
import { DocumentsGrid } from '@/components/documents/documents-grid'

export default function DocumentsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <SelfServicePageHeader
          moduleKey="documents"
          title="Documents"
          subtitle="Manage employee documents and track expiry dates"
        />

        <Suspense fallback={<DocumentsSkeleton variant="employee" />}>
          <DocumentsGrid />
        </Suspense>
      </div>
    </AppShell>
  )
}
