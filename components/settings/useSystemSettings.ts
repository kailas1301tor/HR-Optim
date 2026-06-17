// components/settings/useSystemSettings.ts
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export interface UseSystemSettingsReturn {
  lang: string
  theme: string | undefined
  setTheme: (theme: string) => void
  mounted: boolean
}

export function useSystemSettings(): UseSystemSettingsReturn {
  const lang = 'English (US)'
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    lang,
    theme,
    setTheme,
    mounted,
  }
}
