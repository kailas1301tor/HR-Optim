// components/documents/useDocumentsList.ts
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import {
  employeeDocumentService,
  companyDocumentService,
} from '@/services/document-service'
import type {
  CompanyDocument,
  DocumentStatusCounts,
  EmployeeDocument,
} from '@/types/document'
import { EMPTY_DOCUMENT_STATUS_COUNTS } from '@/types/document'
import { useDocumentsFilters } from './useDocumentsFilters'
import { useDocumentCategories } from './useDocumentCategories'

export function useDocumentsList() {
  const {
    tab,
    statusFilter,
    categoryFilter,
    localSearch,
    setLocalSearch,
    listParams,
    updateQueryParams,
    handleTabChange: onTabChange,
    handleClearFilters,
    handleStatusCardSelect,
  } = useDocumentsFilters()

  const { categories, reload: reloadCategories } = useDocumentCategories(tab)

  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [documents, setDocuments] = useState<Array<EmployeeDocument | CompanyDocument>>([])
  const [counts, setCounts] = useState<DocumentStatusCounts>(EMPTY_DOCUMENT_STATUS_COUNTS)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const refreshList = useCallback(() => {
    setReloadToken((prev) => prev + 1)
  }, [])

  const handleTabChange = useCallback(
    (newTab: string) => {
      setIsUploadOpen(false)
      onTabChange(newTab)
    },
    [onTabChange]
  )

  const handleRetry = useCallback(() => {
    void reloadCategories()
    refreshList()
  }, [reloadCategories, refreshList])

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    async function loadDocuments(): Promise<void> {
      setLoading(true)
      setHasError(false)

      try {
        const [countsData, docsList] =
          tab === 'employee'
            ? await Promise.all([
                employeeDocumentService.getStatusCounts(controller.signal),
                employeeDocumentService.getAll(listParams, controller.signal),
              ])
            : await Promise.all([
                companyDocumentService.getStatusCounts(controller.signal),
                companyDocumentService.getAll(listParams, controller.signal),
              ])

        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return

        setCounts(countsData)
        setDocuments(docsList)
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        setHasError(true)
        setDocuments([])
        setCounts(EMPTY_DOCUMENT_STATUS_COUNTS)
        toast.error('Failed to retrieve documents')
      } finally {
        if (fetchId === fetchIdRef.current) {
          setLoading(false)
        }
      }
    }

    void loadDocuments()
    return () => controller.abort()
  }, [tab, listParams, reloadToken])

  return {
    tab,
    statusFilter,
    categoryFilter,
    localSearch,
    setLocalSearch,
    loading,
    hasError,
    documents,
    counts,
    categories,
    isUploadOpen,
    setIsUploadOpen,
    updateQueryParams,
    refreshList,
    handleRetry,
    handleTabChange,
    handleClearFilters,
    handleStatusCardSelect,
  }
}
