// components/assets/useAssetDropdowns.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { assetService } from '@/services/asset-service'
import { departmentService } from '@/services/department-service'
import type { Department } from '@/types/settings'
import type { AssetDropdowns } from '@/types/asset'

interface CachedMetadata {
  dropdowns: AssetDropdowns
  departments: Department[]
}

let cachedMetadata: CachedMetadata | null = null
let inflightRequest: Promise<CachedMetadata> | null = null

async function fetchMetadataCached(signal?: AbortSignal): Promise<CachedMetadata> {
  if (cachedMetadata) return cachedMetadata

  if (!inflightRequest) {
    inflightRequest = Promise.all([
      assetService.getAssetDropdowns(signal),
      departmentService.getDepartments(signal),
    ])
      .then(([dropdowns, departments]) => {
        cachedMetadata = { dropdowns, departments }
        return cachedMetadata
      })
      .finally(() => {
        inflightRequest = null
      })
  }

  return inflightRequest
}

export function invalidateAssetDropdowns(): void {
  cachedMetadata = null
}

export interface UseAssetDropdownsReturn {
  dropdowns: AssetDropdowns | null
  departments: Department[]
  isLoading: boolean
  hasError: boolean
  reload: () => Promise<void>
}

export function useAssetDropdowns(): UseAssetDropdownsReturn {
  const [dropdowns, setDropdowns] = useState<AssetDropdowns | null>(cachedMetadata?.dropdowns ?? null)
  const [departments, setDepartments] = useState<Department[]>(cachedMetadata?.departments ?? [])
  const [isLoading, setIsLoading] = useState(!cachedMetadata)
  const [hasError, setHasError] = useState(false)

  const reload = useCallback(async (signal?: AbortSignal) => {
    invalidateAssetDropdowns()
    setIsLoading(true)
    setHasError(false)
    try {
      const data = await fetchMetadataCached(signal)
      if (signal?.aborted) return
      setDropdowns(data.dropdowns)
      setDepartments(data.departments)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setHasError(true)
      setDropdowns(null)
      setDepartments([])
    } finally {
      if (!signal?.aborted) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    reload(controller.signal)
    return () => controller.abort()
  }, [reload])

  return { dropdowns, departments, isLoading, hasError, reload: () => reload() }
}
