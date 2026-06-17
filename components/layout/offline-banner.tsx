// components/layout/offline-banner.tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Wifi, WifiOff, AlertTriangle, RefreshCw, X } from 'lucide-react'
import { useNetwork } from '@/components/auth/network-status-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { uiSquircleSm, uiOutlineBtn } from '@/lib/ui/design-system'

const AUTO_DISMISS_MS = 4000
const DISMISS_ANIMATION_MS = 350

export function OfflineBanner() {
  const { status, checkConnectivity } = useNetwork()
  const [showBanner, setShowBanner] = useState(false)
  const [animationClass, setAnimationClass] = useState('')
  const [displayStatus, setDisplayStatus] = useState(status)
  const [isRetrying, setIsRetrying] = useState(false)
  const autoDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearDismissTimers = useCallback(() => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current)
      autoDismissTimerRef.current = null
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const handleDismiss = useCallback(() => {
    clearDismissTimers()
    setAnimationClass('animate-slide-up')
    closeTimerRef.current = setTimeout(() => {
      setShowBanner(false)
      closeTimerRef.current = null
    }, DISMISS_ANIMATION_MS)
  }, [clearDismissTimers])

  useEffect(() => {
    if (status !== 'online') {
      clearDismissTimers()
      setDisplayStatus(status)
      setShowBanner(true)
      setAnimationClass('animate-slide-down')
      return
    }

    if (showBanner && displayStatus !== 'online') {
      setDisplayStatus('online')
      setAnimationClass('animate-slide-down')

      autoDismissTimerRef.current = setTimeout(() => {
        handleDismiss()
      }, AUTO_DISMISS_MS)
    }
  }, [status, showBanner, displayStatus, clearDismissTimers, handleDismiss])

  useEffect(() => {
    return () => clearDismissTimers()
  }, [clearDismissTimers])

  const handleRetry = async (): Promise<void> => {
    setIsRetrying(true)
    try {
      await checkConnectivity()
    } finally {
      setTimeout(() => {
        setIsRetrying(false)
      }, 600)
    }
  }

  if (!showBanner) return null

  const getBannerConfig = () => {
    switch (displayStatus) {
      case 'offline':
        return {
          bg: 'bg-amber-500/10 border-amber-500/25 text-amber-400 shadow-amber-950/20',
          icon: <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />,
          message: 'You are currently offline. Check your connection.',
          showRetry: true,
        }
      case 'server-unreachable':
        return {
          bg: 'bg-red-500/10 border-red-500/25 text-red-400 shadow-red-950/20',
          icon: <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />,
          message: 'Server is unreachable. Retrying connection...',
          showRetry: true,
        }
      case 'online':
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 shadow-emerald-950/20',
          icon: <Wifi className="w-4 h-4 text-emerald-400" />,
          message: 'Connection restored. Back online!',
          showRetry: false,
        }
    }
  }

  const config = getBannerConfig()

  return (
    <div className="fixed top-4 inset-x-0 z-[9999] flex justify-center px-4 pointer-events-none">
      <div
        className={cn(
          'w-full max-w-md flex items-center justify-between gap-3 p-3.5 border rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 pointer-events-auto',
          config.bg,
          animationClass
        )}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0">{config.icon}</div>
          <span className="text-xs font-medium leading-relaxed tracking-wide truncate">
            {config.message}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {config.showRetry ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying}
              className={cn(
                uiOutlineBtn,
                'h-7 text-[10px] px-2.5 font-semibold bg-background/40 hover:bg-background/80 border-current/25 hover:border-current transition-all gap-1.5',
                uiSquircleSm
              )}
              aria-label="Retry network connection"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', isRetrying && 'animate-spin')} />
              Retry
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-7 w-7 rounded-xl text-current hover:bg-background/50"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
