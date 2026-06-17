// components/auth/network-status-provider.tsx
'use client'

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useNetworkStatus, type NetworkStatusType } from '@/lib/hooks/useNetworkStatus'

interface NetworkStatusContextValue {
  isOnline: boolean
  isServerReachable: boolean
  status: NetworkStatusType
  checkConnectivity: () => Promise<boolean>
}

const NetworkStatusContext = createContext<NetworkStatusContextValue | null>(null)

interface NetworkStatusProviderProps {
  children: ReactNode
}

export function NetworkStatusProvider({ children }: NetworkStatusProviderProps) {
  const network = useNetworkStatus()

  // Detect transition from offline/unreachable to online
  useEffect(() => {
    if (network.status !== 'online') return

    // Dispatch custom event to notify all listening hooks/services that network was restored
    const event = new CustomEvent('hrms:network-restored')
    window.dispatchEvent(event)
  }, [network.status])

  const value = useMemo<NetworkStatusContextValue>(
    () => ({
      isOnline: network.isOnline,
      isServerReachable: network.isServerReachable,
      status: network.status,
      checkConnectivity: network.checkConnectivity,
    }),
    [network.isOnline, network.isServerReachable, network.status, network.checkConnectivity]
  )

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  )
}

export function useNetwork(): NetworkStatusContextValue {
  const context = useContext(NetworkStatusContext)
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkStatusProvider')
  }
  return context
}
