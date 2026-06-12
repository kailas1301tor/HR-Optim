// components/assets/useAssetDropdowns.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createModuleCache } from '@/lib/hooks/create-module-cache'
import { assetService } from '@/services/asset-service'
import { employeeService } from '@/services/employee-service'
import type { Department } from '@/types/settings'
import type { AssetDropdowns } from '@/types/asset'

interface CachedMetadata {
  dropdowns: AssetDropdowns
  departments: Department[]
}

const EMPTY_DROPDOWNS: AssetDropdowns = {
  asset_types: [],
  asset_categories: [],
  maintenance_shops: [],
  vendors: [],
  service_types: [],
  asset_status: [],
  disposal_choices: [],
  asset_document_types: [],
}

interface MetadataResult extends CachedMetadata {
  hasError: boolean
}

// Cache the full result (success AND failure) so that repeated mounts —
// React Strict Mode, route-guard transitions, parent re-renders/remounts —
// read the memoized outcome instead of firing a fresh dropdowns+departments
// request every time. A failed/partial fetch is surfaced once via the
// `hasError` banner and only refetched on an explicit `reload()` (manual
// Retry) or `invalidateAssetDropdowns()` after a masters mutation.
const assetMetadataCache = createModuleCache<MetadataResult>()
let metadataInflight: Promise<MetadataResult> | null = null

async function fetchMetadata(): Promise<MetadataResult> {
  const cached = assetMetadataCache.read()
  if (cached) return cached

  if (!metadataInflight) {
    metadataInflight = Promise.allSettled([
      assetService.getAssetDropdowns(),
      employeeService.getDepartmentsFromDropdowns(),
    ])
      .then(([dropdownsResult, departmentsResult]) => {
        const dropdowns =
          dropdownsResult.status === 'fulfilled' ? dropdownsResult.value : EMPTY_DROPDOWNS
        const departments =
          departmentsResult.status === 'fulfilled' ? departmentsResult.value : []
        const hasError = dropdownsResult.status === 'rejected'

        const result: MetadataResult = { dropdowns, departments, hasError }
        assetMetadataCache.write(result)
        return result
      })
      .finally(() => {
        metadataInflight = null
      })
  }

  return metadataInflight
}

export function invalidateAssetDropdowns(): void {
  assetMetadataCache.invalidate()
}

export interface UseAssetDropdownsReturn {
  dropdowns: AssetDropdowns | null
  departments: Department[]
  isLoading: boolean
  hasError: boolean
  reload: () => Promise<void>
}

export function useAssetDropdowns(): UseAssetDropdownsReturn {
  const cached = assetMetadataCache.read()
  const [dropdowns, setDropdowns] = useState<AssetDropdowns | null>(cached?.dropdowns ?? null)
  const [departments, setDepartments] = useState<Department[]>(cached?.departments ?? [])
  const [isLoading, setIsLoading] = useState(!cached)
  const [hasError, setHasError] = useState(cached?.hasError ?? false)

  const reload = useCallback(async () => {
    invalidateAssetDropdowns()
    setIsLoading(true)
    setHasError(false)
    try {
      const data = await fetchMetadata()
      setDropdowns(data.dropdowns)
      setDepartments(data.departments)
      setHasError(data.hasError)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setHasError(true)
      setDropdowns(null)
      setDepartments([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    const hit = assetMetadataCache.read()

    if (hit) {
      setDropdowns(hit.dropdowns)
      setDepartments(hit.departments)
      setHasError(hit.hasError)
      setIsLoading(false)
      return () => {
        active = false
      }
    }

    setIsLoading(true)
    setHasError(false)
    fetchMetadata()
      .then((data) => {
        if (!active) return
        setDropdowns(data.dropdowns)
        setDepartments(data.departments)
        setHasError(data.hasError)
      })
      .catch(() => {
        if (!active) return
        setHasError(true)
        setDropdowns(null)
        setDepartments([])
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { dropdowns, departments, isLoading, hasError, reload }
}
