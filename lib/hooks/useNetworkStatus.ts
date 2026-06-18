// lib/hooks/useNetworkStatus.ts
import { useEffect, useState, useCallback } from 'react'

export type NetworkStatusType = 'online' | 'offline' | 'server-unreachable'

export interface UseNetworkStatusReturn {
  isOnline: boolean
  isServerReachable: boolean
  status: NetworkStatusType
  checkConnectivity: () => Promise<boolean>
}

// Keep a simple global listener list to avoid multiple timers/listeners in different components
let globalStatus: NetworkStatusType = 'online'
const listeners = new Set<(status: NetworkStatusType) => void>()

if (typeof window !== 'undefined') {
  const updateStatus = async (): Promise<void> => {
    if (!navigator.onLine) {
      globalStatus = 'offline'
      listeners.forEach((listener) => listener('offline'))
      return
    }

    // Try a lightweight request to the proxy API URL to confirm server reachability.
    // Use HEAD request to keep it minimal and cheap.
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      await fetch('/api/hrms/', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store',
      })
      clearTimeout(timeoutId)
      
      // Even if it's 401/403/404, if we got a response, the server is reachable and we are online.
      globalStatus = 'online'
      listeners.forEach((listener) => listener('online'))
    } catch {
      // If TypeError (failed to fetch) or aborted, the server is unreachable
      globalStatus = 'server-unreachable'
      listeners.forEach((listener) => listener('server-unreachable'))
    }
  }

  window.addEventListener('online', () => {
    void updateStatus()
  })
  window.addEventListener('offline', () => {
    globalStatus = 'offline'
    listeners.forEach((listener) => listener('offline'))
  })

  // Periodically check server status every 30 seconds if online
  setInterval(() => {
    if (globalStatus !== 'offline') {
      void updateStatus()
    }
  }, 30000)
}

export function useNetworkStatus(): UseNetworkStatusReturn {
  const [status, setStatus] = useState<NetworkStatusType>(
    typeof window !== 'undefined' ? globalStatus : 'online'
  )

  useEffect(() => {
    const handleStatusChange = (newStatus: NetworkStatusType) => {
      setStatus(newStatus)
    }

    listeners.add(handleStatusChange)
    
    // Run initial check on mount (avoid SSR mismatch by doing it inside useEffect)
    if (typeof window !== 'undefined' && globalStatus === 'online') {
      const checkOnMount = async (): Promise<void> => {
        if (!navigator.onLine) {
          setStatus('offline')
          return
        }
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)
          await fetch('/api/hrms/', {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-store',
          })
          clearTimeout(timeoutId)
          setStatus('online')
        } catch {
          setStatus('server-unreachable')
        }
      }
      void checkOnMount()
    }

    return () => {
      listeners.delete(handleStatusChange)
    }
  }, [])

  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return true
    if (!navigator.onLine) {
      setStatus('offline')
      return false
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      await fetch('/api/hrms/', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store',
      })
      clearTimeout(timeoutId)
      setStatus('online')
      return true
    } catch {
      setStatus('server-unreachable')
      return false
    }
  }, [])

  return {
    isOnline: status === 'online',
    isServerReachable: status === 'online',
    status,
    checkConnectivity,
  }
}
