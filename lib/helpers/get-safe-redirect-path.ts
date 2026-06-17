// lib/helpers/get-safe-redirect-path.ts

/**
 * Sanitizes post-login redirect paths to prevent open redirects.
 * Only same-origin relative paths are allowed (must start with `/` but not `//`).
 */
export function getSafeRedirectPath(redirect: string | null | undefined): string {
  if (!redirect) return '/'
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return '/'
  return redirect
}
