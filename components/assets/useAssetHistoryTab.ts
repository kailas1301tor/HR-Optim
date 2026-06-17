// components/assets/useAssetHistoryTab.ts
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { assetService } from '@/services/asset-service'
import type { AssetHistoryEntry } from '@/types/asset'
import { User, Building, Wrench, RefreshCw, Trash2, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'

export interface UseAssetHistoryTabReturn {
  history: AssetHistoryEntry[]
  isLoading: boolean
  hasError: boolean
  handleRetry: () => void
  getActionConfig: (actionName?: string) => {
    icon: typeof User
    color: string
  }
}

export function useAssetHistoryTab(assetId: number): UseAssetHistoryTabReturn {
  const [history, setHistory] = useState<AssetHistoryEntry[]>([])
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

    async function loadHistory(): Promise<void> {
      setIsLoading(true)
      setHasError(false)
      try {
        const data = await assetService.getAssetHistory(assetId, controller.signal)
        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return
        const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setHistory(sorted)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        setHasError(true)
        setHistory([])
        toast.error('Failed to load asset history')
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void loadHistory()
    return () => controller.abort()
  }, [assetId, reloadToken])

  const getActionConfig = (actionName: string = '') => {
    const action = actionName.toLowerCase()
    if (action.includes('assign')) {
      return { icon: User, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' }
    }
    if (action.includes('transfer')) {
      return { icon: RefreshCw, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' }
    }
    if (action.includes('maintenance') || action.includes('repair')) {
      return { icon: Wrench, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' }
    }
    if (action.includes('return')) {
      return { icon: Building, color: 'text-violet-glow bg-violet-core/15 border-violet-core/30' }
    }
    if (action.includes('dispose') || action.includes('delete')) {
      return { icon: Trash2, color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' }
    }
    return { icon: HelpCircle, color: 'text-slate-400 bg-slate-500/15 border-slate-500/30' }
  }

  return {
    history,
    isLoading,
    hasError,
    handleRetry,
    getActionConfig,
  }
}
