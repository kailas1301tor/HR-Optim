// components/layout/useCommandPalette.ts
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { searchService } from '@/services/search-service'
import type { GlobalSearchData, UseCommandPaletteProps, UseCommandPaletteReturn } from '@/types/search'

export function useCommandPalette({
  open,
  onOpenChange,
}: UseCommandPaletteProps): UseCommandPaletteReturn {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [results, setResults] = useState<GlobalSearchData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Clear search and results when palette is closed
  useEffect(() => {
    if (!open) {
      setSearch('')
      setDebouncedSearch('')
      setResults(null)
      setIsLoading(false)
    }
  }, [open])

  // Keybind listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, search.trim() ? 300 : 0)
    return () => clearTimeout(handler)
  }, [search])

  // Fetch search results when debounced query changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResults(null)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)

    async function fetchResults() {
      try {
        const data = await searchService.globalSearch(debouncedSearch, controller.signal)
        setResults(data)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        console.error('🔴 Global search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchResults()
    return () => controller.abort()
  }, [debouncedSearch])

  const handleSelect = useCallback(
    (href: string) => {
      onOpenChange(false)
      setSearch('')
      router.push(href)
    },
    [router, onOpenChange]
  )

  return {
    search,
    setSearch,
    handleSelect,
    results,
    isLoading,
  }
}


