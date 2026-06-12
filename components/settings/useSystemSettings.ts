// components/settings/useSystemSettings.ts
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export interface UseSystemSettingsProps {
  notifications: {
    emailAlerts: boolean
    documentExpiry: boolean
    leaveRequests: boolean
    payrollUpdates: boolean
    systemUpdates: boolean
  }
  setNotifications: (notifs: UseSystemSettingsProps['notifications']) => void
}

export interface UseSystemSettingsReturn {
  lang: string
  theme: string | undefined
  setTheme: (theme: string) => void
  mounted: boolean
  handleToggleNotification: (key: keyof UseSystemSettingsProps['notifications'], checked: boolean) => void
}

export function useSystemSettings({
  notifications,
  setNotifications,
}: UseSystemSettingsProps): UseSystemSettingsReturn {
  const lang = 'English (US)'
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggleNotification = (
    key: keyof UseSystemSettingsProps['notifications'],
    checked: boolean
  ): void => {
    setNotifications({
      ...notifications,
      [key]: checked,
    })
  }

  return {
    lang,
    theme,
    setTheme,
    mounted,
    handleToggleNotification,
  }
}
