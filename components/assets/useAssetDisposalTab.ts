// components/assets/useAssetDisposalTab.ts
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { assetService } from '@/services/asset-service'
import type { AssetDisposal } from '@/types/asset'
import { toast } from 'sonner'

export interface UseAssetDisposalTabReturn {
  disposal: AssetDisposal | null
  isLoading: boolean
  hasError: boolean
  handleRetry: () => void
  formatDate: (dateStr: string) => string
}

export function useAssetDisposalTab(assetId: number): UseAssetDisposalTabReturn {
  const [disposal, setDisposal] = useState<AssetDisposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const handleRetry = useCallback(() => {
    setReloadToken((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    async function loadDisposal(): Promise<void> {
      setIsLoading(true)
      setHasError(false)
      try {
        const data = await assetService.getAssetDisposal(assetId, controller.signal)
        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return
        setDisposal(data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        setHasError(true)
        setDisposal(null)
        toast.error('Failed to load disposal records')
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void loadDisposal()
    return () => controller.abort()
  }, [assetId, reloadToken])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return {
    disposal,
    isLoading,
    hasError,
    handleRetry,
    formatDate,
  }
}
