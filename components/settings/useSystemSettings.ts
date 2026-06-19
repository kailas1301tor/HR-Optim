// components/settings/useSystemSettings.ts
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useColorTheme, type ColorTheme } from '@/components/color-theme-provider'

export interface UseSystemSettingsReturn {
  lang: string
  theme: string | undefined
  setTheme: (theme: string) => void
  colorTheme: ColorTheme
  setColorTheme: (colorTheme: ColorTheme) => void
  mounted: boolean
}

export function useSystemSettings(): UseSystemSettingsReturn {
  const lang = 'English (US)'
  const { theme, setTheme } = useTheme()
  const { colorTheme, setColorTheme } = useColorTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    lang,
    theme,
    setTheme,
    colorTheme,
    setColorTheme,
    mounted,
  }
}
