// components/notifications/useNotificationsList.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { invalidateClientFetch } from '@/lib/helpers/client-fetch-lifecycle'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import { notificationService } from '@/services/notification-service'
import type { Notification } from '@/types/notification'

export interface UseNotificationsListReturn {
  notifications: Notification[]
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  reload: () => void
  markNotificationRead: (id: number) => void
}

export function useNotificationsList(): UseNotificationsListReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  const markNotificationRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification,
      ),
    )
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    const load = async () => {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage(null)

      try {
        const result = await notificationService.getNotifications(controller.signal)
        if (fetchId !== fetchIdRef.current) return
        setNotifications(Array.isArray(result) ? result : [])
      } catch (error: unknown) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setNotifications([])
        setHasError(true)
        setErrorMessage(
          getApiErrorMessage(error, 'Failed to load notifications. Please try again.'),
        )
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => invalidateClientFetch(fetchIdRef, controller)
  }, [reloadToken])

  return {
    notifications,
    isLoading,
    hasError,
    errorMessage,
    reload,
    markNotificationRead,
  }
}
