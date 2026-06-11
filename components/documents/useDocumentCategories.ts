// components/documents/useDocumentCategories.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  companyDocumentService,
  employeeDocumentService,
} from '@/services/document-service'
import type { DocumentTab } from '@/types/document'

export interface DocumentCategory {
  id: number
  name: string
}

const categoryCache: Partial<Record<DocumentTab, DocumentCategory[]>> = {}
const inflightRequests: Partial<Record<DocumentTab, Promise<DocumentCategory[]>>> = {}

async function fetchCategoriesCached(
  tab: DocumentTab,
  signal?: AbortSignal
): Promise<DocumentCategory[]> {
  if (categoryCache[tab]) return categoryCache[tab]!

  if (!inflightRequests[tab]) {
    inflightRequests[tab] =
      tab === 'employee'
        ? employeeDocumentService.getDropdowns(signal).then((data) => {
            categoryCache.employee = data.employee_document_types
            return data.employee_document_types
          })
        : companyDocumentService.getDropdowns(signal).then((data) => {
            categoryCache.company = data.company_document_types
            return data.company_document_types
          })

    inflightRequests[tab] = inflightRequests[tab]!.finally(() => {
      delete inflightRequests[tab]
    })
  }

  return inflightRequests[tab]!
}

export function invalidateDocumentCategories(tab?: DocumentTab): void {
  if (tab) {
    delete categoryCache[tab]
    return
  }
  delete categoryCache.employee
  delete categoryCache.company
}

export interface UseDocumentCategoriesReturn {
  categories: DocumentCategory[]
  isLoading: boolean
  hasError: boolean
  reload: () => Promise<void>
}

export function useDocumentCategories(tab: DocumentTab): UseDocumentCategoriesReturn {
  const [categories, setCategories] = useState<DocumentCategory[]>(categoryCache[tab] ?? [])
  const [isLoading, setIsLoading] = useState(!categoryCache[tab])
  const [hasError, setHasError] = useState(false)

  const reload = useCallback(
    async (signal?: AbortSignal) => {
      invalidateDocumentCategories(tab)
      setIsLoading(true)
      setHasError(false)
      try {
        const data = await fetchCategoriesCached(tab, signal)
        if (signal?.aborted) return
        setCategories(data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setHasError(true)
        setCategories([])
      } finally {
        if (!signal?.aborted) setIsLoading(false)
      }
    },
    [tab]
  )

  useEffect(() => {
    const controller = new AbortController()
    reload(controller.signal)
    return () => controller.abort()
  }, [reload])

  return { categories, isLoading, hasError, reload: () => reload() }
}
