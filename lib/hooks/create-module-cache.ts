// lib/hooks/create-module-cache.ts

export interface ModuleCacheOptions<T> {
  /** When false, the result is returned but not stored. Default: always persist. */
  shouldPersist?: (value: T) => boolean
}

export interface ModuleCache<T> {
  read: () => T | null
  write: (value: T) => void
  fetch: (fetcher: () => Promise<T>) => Promise<T>
  invalidate: () => void
}

/**
 * Module-level singleton cache with in-flight deduplication.
 * Never pass AbortSignal into fetchers used here — shared requests must not
 * be aborted by individual component unmounts (React Strict Mode safe).
 */
export function createModuleCache<T>(options?: ModuleCacheOptions<T>): ModuleCache<T> {
  let cached: T | null = null
  let inflight: Promise<T> | null = null
  const shouldPersist = options?.shouldPersist ?? (() => true)

  return {
    read: () => cached,
    write: (value) => {
      cached = value
    },
    invalidate: () => {
      cached = null
    },
    fetch: (fetcher) => {
      if (cached !== null) {
        return Promise.resolve(cached)
      }

      if (!inflight) {
        inflight = fetcher()
          .then((value) => {
            if (shouldPersist(value)) {
              cached = value
            }
            return value
          })
          .finally(() => {
            inflight = null
          })
      }

      return inflight
    },
  }
}

export interface ModuleCacheMap<K extends string, T> {
  read: (key: K) => T | null
  write: (key: K, value: T) => void
  fetch: (key: K, fetcher: () => Promise<T>) => Promise<T>
  invalidate: (key?: K) => void
}

/** Keyed variant of createModuleCache for tab-scoped or multi-tenant caches. */
export function createModuleCacheMap<K extends string, T>(
  options?: ModuleCacheOptions<T>
): ModuleCacheMap<K, T> {
  const cached = new Map<K, T>()
  const inflight = new Map<K, Promise<T>>()
  const shouldPersist = options?.shouldPersist ?? (() => true)

  return {
    read: (key) => cached.get(key) ?? null,
    write: (key, value) => {
      cached.set(key, value)
    },
    invalidate: (key) => {
      if (key === undefined) {
        cached.clear()
        return
      }
      cached.delete(key)
    },
    fetch: (key, fetcher) => {
      const hit = cached.get(key)
      if (hit !== undefined) {
        return Promise.resolve(hit)
      }

      const existing = inflight.get(key)
      if (existing) {
        return existing
      }

      const promise = fetcher()
        .then((value) => {
          if (shouldPersist(value)) {
            cached.set(key, value)
          }
          return value
        })
        .finally(() => {
          inflight.delete(key)
        })

      inflight.set(key, promise)
      return promise
    },
  }
}
