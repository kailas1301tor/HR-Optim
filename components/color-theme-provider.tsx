// components/color-theme-provider.tsx
'use client'

import * as React from 'react'

export const COLOR_THEMES = [
  'theme-violet',
  'theme-blue',
  'theme-emerald',
  'theme-rose',
  'theme-amber',
  'theme-red',
  'theme-cyan',
  'theme-black',
  'theme-grey',
] as const

export type ColorTheme = (typeof COLOR_THEMES)[number]

export const DEFAULT_COLOR_THEME: ColorTheme = 'theme-red'

interface ColorThemeContextType {
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
}

const ColorThemeContext = React.createContext<ColorThemeContextType | undefined>(undefined)

export function ColorThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [colorTheme, setColorThemeState] = React.useState<ColorTheme>(DEFAULT_COLOR_THEME)

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('color-theme') as ColorTheme
      if (saved && COLOR_THEMES.includes(saved)) {
        setColorThemeState(saved)
        // Ensure the class is applied
        COLOR_THEMES.forEach((t) => document.documentElement.classList.remove(t))
        document.documentElement.classList.add(saved)
      } else {
        document.documentElement.classList.add(DEFAULT_COLOR_THEME)
      }
    } catch (error) {
      console.warn('Failed to load color theme from localStorage:', error)
    }
  }, [])

  const setColorTheme = (newTheme: ColorTheme) => {
    try {
      // Remove all theme classes first
      COLOR_THEMES.forEach((t) => document.documentElement.classList.remove(t))
      // Add the new theme class
      document.documentElement.classList.add(newTheme)
      // Save to localStorage
      localStorage.setItem('color-theme', newTheme)
      setColorThemeState(newTheme)
    } catch (error) {
      console.warn('Failed to save color theme to localStorage:', error)
    }
  }

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme(): ColorThemeContextType {
  const context = React.useContext(ColorThemeContext)
  if (!context) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider')
  }
  return context
}
