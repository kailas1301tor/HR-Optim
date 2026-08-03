// components/requests/forms/use-blocked-date-range.ts
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BLOCKED_RANGE_MESSAGE,
  buildBlockedDateSet,
  rangeOverlapsBlocked,
} from '@/lib/helpers/calendar-blocked-dates'

interface UseBlockedDateRangeOptions {
  blockedDates: Date[]
  fromDate: string
  toDate: string
  onClearDates: () => void
}

export function useBlockedDateRange({
  blockedDates,
  fromDate,
  toDate,
  onClearDates,
}: UseBlockedDateRangeOptions) {
  const blockedSet = useMemo(() => buildBlockedDateSet(blockedDates), [blockedDates])
  const [blockedRangeMessage, setBlockedRangeMessage] = useState<string | null>(null)

  const validateAndApplyRange = useCallback(
    (from: string, to: string, onApply: (from: string, to: string) => void): boolean => {
      if (!from || !to) {
        setBlockedRangeMessage(null)
        onApply(from, to)
        return true
      }

      if (rangeOverlapsBlocked(from, to, blockedSet)) {
        setBlockedRangeMessage(BLOCKED_RANGE_MESSAGE)
        return false
      }

      setBlockedRangeMessage(null)
      onApply(from, to)
      return true
    },
    [blockedSet],
  )

  const handleBlockedSelectionAttempt = useCallback(() => {
    setBlockedRangeMessage(BLOCKED_RANGE_MESSAGE)
  }, [])

  useEffect(() => {
    if (!fromDate || !toDate) return
    if (rangeOverlapsBlocked(fromDate, toDate, blockedSet)) {
      onClearDates()
      setBlockedRangeMessage(BLOCKED_RANGE_MESSAGE)
    }
  }, [blockedSet, fromDate, toDate, onClearDates])

  return {
    blockedSet,
    blockedRangeMessage,
    validateAndApplyRange,
    handleBlockedSelectionAttempt,
    setBlockedRangeMessage,
  }
}
