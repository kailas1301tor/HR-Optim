// components/settings/invalidate-settings-departments.ts

const listeners = new Set<() => void>()

export function subscribeSettingsDepartmentsInvalidation(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function invalidateSettingsDepartments(): void {
  listeners.forEach((listener) => listener())
}
