// components/documents/useDocumentCategories.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createModuleCacheMap } from '@/lib/hooks/create-module-cache'
import {
  companyDocumentService,
  employeeDocumentService,
} from '@/services/document-service'
import type { DocumentTab } from '@/types/document'

export interface DocumentCategory {
  id: number
  name: string
}

const documentCategoriesCache = createModuleCacheMap<DocumentTab, DocumentCategory[]>({
  shouldPersist: (categories) => categories.length > 0,
})

async function fetchCategoriesCached(tab: DocumentTab): Promise<DocumentCategory[]> {
  return documentCategoriesCache.fetch(tab, () =>
    tab === 'employee'
      ? employeeDocumentService.getDropdowns().then((data) => data.employee_document_types)
      : companyDocumentService.getDropdowns().then((data) => data.company_document_types)
  )
}

export function invalidateDocumentCategories(tab?: DocumentTab): void {
  documentCategoriesCache.invalidate(tab)
}

export interface UseDocumentCategoriesReturn {
  categories: DocumentCategory[]
  isLoading: boolean
  hasError: boolean
  reload: () => Promise<void>
}

export function useDocumentCategories(tab: DocumentTab): UseDocumentCategoriesReturn {
  const cached = documentCategoriesCache.read(tab)
  const [categories, setCategories] = useState<DocumentCategory[]>(cached ?? [])
  const [isLoading, setIsLoading] = useState(!cached?.length)
  const [hasError, setHasError] = useState(false)

  const runReload = useCallback(
    async (invalidate: boolean) => {
      if (invalidate) invalidateDocumentCategories(tab)
      setIsLoading(true)
      setHasError(false)
      try {
        const data = await fetchCategoriesCached(tab)
        setCategories(data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setHasError(true)
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    },
    [tab]
  )

  useEffect(() => {
    let active = true
    const hit = documentCategoriesCache.read(tab)

    if (hit?.length) {
      setCategories(hit)
      setIsLoading(false)
      return () => {
        active = false
      }
    }

    setIsLoading(true)
    setHasError(false)
    fetchCategoriesCached(tab)
      .then((data) => {
        if (active) setCategories(data)
      })
      .catch(() => {
        if (active) {
          setHasError(true)
          setCategories([])
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [tab])

  const reload = useCallback(() => runReload(true), [runReload])

  return { categories, isLoading, hasError, reload }
}
