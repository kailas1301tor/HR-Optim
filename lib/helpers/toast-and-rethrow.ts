// lib/helpers/toast-and-rethrow.ts
import { toast } from 'sonner'

/** Shows a toast then rethrows so callers (e.g. useGenericMasterCard) do not show false success. */
export function toastAndRethrow(error: unknown, fallbackMessage: string): never {
  const message = error instanceof Error ? error.message : fallbackMessage
  toast.error(message)
  throw error instanceof Error ? error : new Error(fallbackMessage)
}
