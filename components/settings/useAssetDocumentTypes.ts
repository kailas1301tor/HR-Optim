// components/settings/useAssetDocumentTypes.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { assetDocumentTypeService, type AssetDocumentType } from '@/services/asset-document-type-service'

export function useAssetDocumentTypes() {
  const [items, setItems] = useState<AssetDocumentType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const fetchIdRef = useRef(0)

  const load = useCallback(async (signal?: AbortSignal) => {
    const fetchId = ++fetchIdRef.current
    setIsLoading(true)
    setHasError(false)
    try {
      const data = await assetDocumentTypeService.getAll(signal)
      if (fetchId !== fetchIdRef.current) return
      setItems(data)
    } catch {
      if (fetchId !== fetchIdRef.current) return
      setItems([])
      setHasError(true)
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    return () => controller.abort()
  }, [load])

  const handleSave = async (id: number | null, name: string) => {
    if (id) {
      await assetDocumentTypeService.update(id, name)
    } else {
      await assetDocumentTypeService.create(name)
    }
    await load()
  }

  const handleDelete = async (id: number) => {
    await assetDocumentTypeService.delete(id)
    await load()
  }

  return { items, isLoading, hasError, reload: () => void load(), handleSave, handleDelete }
}
