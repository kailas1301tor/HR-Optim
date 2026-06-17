// lib/helpers/load-master-list.ts
import { toast } from 'sonner'

export interface LoadMasterListOptions<T> {
  setLoading: (loading: boolean) => void
  setHasError: (hasError: boolean) => void
  fetcher: () => Promise<T>
  onSuccess: (data: T) => void
  errorMessage: string
  /** Pass a ref from the calling hook to ignore stale responses from overlapping reloads */
  requestIdRef?: { current: number }
  /** When false, skip toggling loading state (background refresh after mutations) */
  showLoading?: boolean
}

export async function loadMasterList<T>({
  setLoading,
  setHasError,
  fetcher,
  onSuccess,
  errorMessage,
  requestIdRef,
  showLoading = true,
}: LoadMasterListOptions<T>): Promise<void> {
  const requestId = requestIdRef ? ++requestIdRef.current : null
  const isStale = (): boolean =>
    requestIdRef !== undefined && requestId !== requestIdRef.current

  if (showLoading) {
    setLoading(true)
  }
  setHasError(false)

  try {
    const data = await fetcher()
    if (isStale()) return
    onSuccess(data)
  } catch {
    if (isStale()) return
    setHasError(true)
    toast.error(errorMessage)
  } finally {
    if (!isStale() && showLoading) {
      setLoading(false)
    }
  }
}
