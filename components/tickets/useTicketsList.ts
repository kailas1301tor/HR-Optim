// components/tickets/useTicketsList.ts
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ticketService } from '@/services/ticket-service'
import type { TicketPriority, TicketRecord } from '@/types/ticket'

export type TicketPriorityFilter = 'all' | TicketPriority

export interface UseTicketsListReturn {
  tickets: TicketRecord[]
  filteredTickets: TicketRecord[]
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  priorityFilter: TicketPriorityFilter
  setPriorityFilter: (filter: TicketPriorityFilter) => void
  reload: () => void
}

export function useTicketsList(): UseTicketsListReturn {
  const [tickets, setTickets] = useState<TicketRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TicketPriorityFilter>('all')
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    const load = async () => {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage(null)
      try {
        const result = await ticketService.listTickets(controller.signal)
        if (fetchId !== fetchIdRef.current) return
        setTickets(result)
      } catch (error: unknown) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setTickets([])
        setHasError(true)
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load tickets')
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [reloadToken])

  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return tickets.filter((ticket) => {
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
      const matchesSearch =
        !query ||
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query)
      return matchesPriority && matchesSearch
    })
  }, [tickets, searchQuery, priorityFilter])

  return {
    tickets,
    filteredTickets,
    isLoading,
    hasError,
    errorMessage,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    reload,
  }
}
