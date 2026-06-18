// components/settings/useNotificationSettings.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { notificationService } from '@/services/notification-service'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import { createModuleCache } from '@/lib/hooks/create-module-cache'
import type { NotificationSettings } from '@/types/notification'

export type NotificationSettingsStatus = 'loading' | 'error' | 'success'

export interface UseNotificationSettingsReturn {
  status: NotificationSettingsStatus
  settings: NotificationSettings | null
  updatingKey: keyof NotificationSettings | null
  handleToggle: (key: keyof NotificationSettings, checked: boolean) => Promise<void>
  handleRetry: () => void
}

const notificationSettingsCache = createModuleCache<NotificationSettings>()

export function invalidateNotificationSettingsCache(): void {
  notificationSettingsCache.invalidate()
}

export function useNotificationSettings(): UseNotificationSettingsReturn {
  const [status, setStatus] = useState<NotificationSettingsStatus>('loading')
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [updatingKey, setUpdatingKey] = useState<keyof NotificationSettings | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let active = true

    async function runLoad(): Promise<void> {
      setStatus('loading')
      try {
        const data = await notificationSettingsCache.fetch(() =>
          notificationService.getNotificationSettings(),
        )
        if (!active) return
        setSettings(data)
        setStatus('success')
      } catch (error) {
        if (!active) return
        if (error instanceof Error && error.name === 'AbortError') return
        setSettings(null)
        setStatus('error')
      }
    }

    void runLoad()

    return () => {
      active = false
    }
  }, [reloadToken])

  const handleToggle = useCallback(
    async (key: keyof NotificationSettings, checked: boolean): Promise<void> => {
      if (!settings) return

      const previous = settings
      const next: NotificationSettings = { ...settings, [key]: checked }
      setSettings(next)
      setUpdatingKey(key)

      try {
        const updated = await notificationService.updateNotificationSettings(next)
        setSettings(updated)
        notificationSettingsCache.write(updated)
        toast.success('Notification settings updated')
      } catch (error) {
        setSettings(previous)
        toast.error(getApiErrorMessage(error, 'Failed to update notification settings'))
      } finally {
        setUpdatingKey(null)
      }
    },
    [settings],
  )

  const handleRetry = useCallback((): void => {
    invalidateNotificationSettingsCache()
    setReloadToken((token) => token + 1)
  }, [])

  return {
    status,
    settings,
    updatingKey,
    handleToggle,
    handleRetry,
  }
}
