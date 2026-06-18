// lib/helpers/is-initial-data-loading.ts

/** True while the first fetch is in flight and no rows are shown yet. */
export function isInitialDataLoading(
  isLoading: boolean,
  itemCount: number,
  hasError: boolean,
): boolean {
  return isLoading && itemCount === 0 && !hasError
}
