// lib/helpers/client-fetch-lifecycle.ts
import type { MutableRefObject } from 'react'

/** True when this request is still active and was not aborted. */
export function shouldFinalizeClientFetch(options: {
  signal: AbortSignal
  fetchId: number
  fetchIdRef: MutableRefObject<number>
}): boolean {
  const { signal, fetchId, fetchIdRef } = options
  return fetchId === fetchIdRef.current && !signal.aborted
}

/** Invalidate in-flight request on effect cleanup or dependency change. */
export function invalidateClientFetch(
  fetchIdRef: MutableRefObject<number>,
  controller: AbortController,
): void {
  fetchIdRef.current += 1
  controller.abort()
}
