// components/documents/documents-grid.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommonEmptyState,
  CommonErrorState,
  CommonFilterChips,
  CommonStatCards,
  type StatCardItem,
} from '@/components/common'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { DocumentCard } from './document-card'
import { DocumentCardSkeleton } from './document-card-skeleton'
import { UploadDocumentModal } from './upload-document-modal'
import { statusConfig } from './documents-constants'
import { DocumentsToolbar } from './documents-toolbar'
import {
  employeeDocumentService,
  companyDocumentService,
  type EmployeeDocument,
  type CompanyDocument,
  type DocumentStatusCounts
} from '@/services/document-service'
import { toast } from 'sonner'

const DOC_STAT_CARDS: StatCardItem[] = [
  {
    key: 'valid',
    label: 'Valid',
    count: 0,
    icon: statusConfig.valid.icon,
    iconClass: 'bg-lime-400/20 text-lime-400',
    activeRing: 'ring-2 ring-lime-400/40 border-lime-400/30',
  },
  {
    key: 'expiring',
    label: 'Expiring Soon',
    count: 0,
    icon: statusConfig.expiring.icon,
    iconClass: 'bg-amber-400/20 text-amber-400',
    activeRing: 'ring-2 ring-amber-400/40 border-amber-400/30',
  },
  {
    key: 'expired',
    label: 'Expired',
    count: 0,
    icon: statusConfig.expired.icon,
    iconClass: 'bg-red-500/20 text-red-400',
    activeRing: 'ring-2 ring-red-500/40 border-red-500/30',
  },
]

const TAB_OPTIONS = [
  { value: 'employee', label: 'Employee' },
  { value: 'company', label: 'Company' },
]

export function DocumentsGrid() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tab = (searchParams.get('tab') as 'employee' | 'company') || 'employee'
  const statusFilter = searchParams.get('status') || 'all'
  const categoryFilter = searchParams.get('category') || 'all'
  const urlSearchQuery = searchParams.get('search') || ''

  const [localSearch, setLocalSearch] = useState(urlSearchQuery)
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [documents, setDocuments] = useState<Array<EmployeeDocument | CompanyDocument>>([])
  const [counts, setCounts] = useState<DocumentStatusCounts>({ valid: 0, expiring_soon: 0, expired: 0 })
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, value)
      }
    })
    router.replace(`${pathname}?${nextParams.toString()}`)
  }

  useEffect(() => {
    setLocalSearch(urlSearchQuery)
  }, [urlSearchQuery])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== urlSearchQuery) {
        updateQueryParams({ search: localSearch })
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [localSearch, urlSearchQuery])

  const loadData = async (signal?: AbortSignal) => {
    setLoading(true)
    setHasError(false)

    try {
      const docTypeParam = categoryFilter !== 'all' ? categoryFilter : undefined
      const statusParam = statusFilter !== 'all' ? statusFilter : undefined
      const searchParam = urlSearchQuery || undefined

      if (tab === 'employee') {
        const [countsData, docsList, dropdowns] = await Promise.all([
          employeeDocumentService.getStatusCounts(signal),
          employeeDocumentService.getAll({
            search: searchParam,
            document_type: docTypeParam,
            status: statusParam
          }, signal),
          employeeDocumentService.getDropdowns(signal)
        ])

        if (signal?.aborted) return

        setCounts(countsData)
        setDocuments(docsList)
        setCategories(dropdowns.employee_document_types)
      } else {
        const [countsData, docsList, dropdowns] = await Promise.all([
          companyDocumentService.getStatusCounts(signal),
          companyDocumentService.getAll({
            search: searchParam,
            document_type: docTypeParam,
            status: statusParam
          }, signal),
          companyDocumentService.getDropdowns(signal)
        ])

        if (signal?.aborted) return

        setCounts(countsData)
        setDocuments(docsList)
        setCategories(dropdowns.company_document_types)
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      console.error('Failed to load documents data:', error)
      setHasError(true)
      toast.error('Failed to retrieve documents')
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    setCounts({ valid: 0, expiring_soon: 0, expired: 0 })
    setDocuments([])

    const controller = new AbortController()
    loadData(controller.signal)

    return () => {
      controller.abort()
    }
  }, [tab, statusFilter, categoryFilter, urlSearchQuery])

  const handleTabChange = (newTab: string) => {
    setCategories([])
    const nextParams = new URLSearchParams()
    nextParams.set('tab', newTab)
    router.replace(`${pathname}?${nextParams.toString()}`)
    setLocalSearch('')
  }

  const handleExport = () => {
    toast.success(`Exporting ${tab === 'employee' ? 'Employee' : 'Company'} documents...`)
  }

  const handleClearFilters = () => {
    updateQueryParams({ status: 'all', category: 'all', search: '' })
    setLocalSearch('')
  }

  const handleStatusCardSelect = (key: string) => {
    updateQueryParams({ status: statusFilter === key ? 'all' : key })
  }

  const statItems = DOC_STAT_CARDS.map((card) => ({
    ...card,
    count:
      card.key === 'valid' ? counts.valid
      : card.key === 'expiring' ? counts.expiring_soon
      : counts.expired,
  }))

  return (
    <div className="space-y-6">
      <CommonFilterChips
        options={TAB_OPTIONS}
        value={tab}
        onChange={handleTabChange}
      />

      <DocumentsToolbar
        tab={tab}
        localSearch={localSearch}
        setLocalSearch={setLocalSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={(val) => updateQueryParams({ category: val })}
        categories={categories}
        onExport={handleExport}
        onUploadClick={() => setIsUploadOpen(true)}
      />

      <CommonStatCards
        items={statItems}
        activeKey={statusFilter}
        isLoading={loading}
        onSelect={handleStatusCardSelect}
      />

      {hasError ? (
        <CommonErrorState
          title="Failed to load documents"
          message="Please check your connection and try again."
          onRetry={() => loadData()}
        />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <DocumentCardSkeleton key={idx} />
          ))}
        </div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, idx) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              type={tab}
              index={idx}
              onDeleteSuccess={() => loadData()}
            />
          ))}
        </div>
      ) : !hasError ? (
        <CommonEmptyState
          icon={FileQuestion}
          title="No documents matching your search"
          description="Try adjusting your search query, status filters, or document type criteria."
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              className={cn(uiOutlineBtn, 'text-xs h-9')}
            >
              Clear Filters
            </Button>
          }
        />
      ) : null}

      <UploadDocumentModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        tab={tab}
        onSuccess={() => loadData()}
      />
    </div>
  )
}
