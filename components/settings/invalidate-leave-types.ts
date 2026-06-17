// components/settings/invalidate-leave-types.ts

const listeners = new Set<() => void>()

export function subscribeLeaveTypesInvalidation(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function invalidateLeaveTypes(): void {
  listeners.forEach((listener) => listener())
}
