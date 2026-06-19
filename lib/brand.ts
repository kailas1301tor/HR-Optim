// lib/brand.ts

const nameFromEnv = process.env.NEXT_PUBLIC_PRODUCT_NAME?.trim()

/** Customer-facing product name (override via NEXT_PUBLIC_PRODUCT_NAME). */
export const PRODUCT_NAME =
  nameFromEnv && nameFromEnv.length > 0 ? nameFromEnv : 'Roka'

export const COMPANY_NAME = 'HROPTIM'

/** Shown under the product name in metadata and legacy contexts. */
export const PRODUCT_TAGLINE = `${PRODUCT_NAME} by ${COMPANY_NAME}`

/** Shown under the wordmark logo in shell contexts. */
export const COMPANY_TAGLINE = `by ${COMPANY_NAME}`

export const PRODUCT_DESCRIPTION =
  `${PRODUCT_NAME} by ${COMPANY_NAME} — enterprise human resource and asset management.`

export function pageTitle(page: string): string {
  return `${page} | ${PRODUCT_NAME}`
}

/** Full horizontal wordmark — dark shapes for light mode. */
export const APP_LOGO_LIGHT_PATH = '/brand/roka-logo-light.png'

/** Full horizontal wordmark — white shapes for dark mode. */
export const APP_LOGO_DARK_PATH = '/brand/roka-logo-dark.png'

export const APP_LOGO_ALT = 'ROKA'

/** Icon mark only — dark shapes for light mode. */
export const APP_MARK_LIGHT_PATH = '/brand/roka-mark-light.png'

/** Icon mark only — white shapes for dark mode. */
export const APP_MARK_DARK_PATH = '/brand/roka-mark-dark.png'

export const APP_MARK_ALT = `${PRODUCT_NAME} mark`

/** @deprecated Use APP_MARK_LIGHT_PATH / APP_MARK_DARK_PATH */
export const APP_MARK_PATH = APP_MARK_LIGHT_PATH

/** @deprecated Use APP_MARK_LIGHT_PATH */
export const APP_ICON_PATH = APP_MARK_LIGHT_PATH

export const APP_ICON_ALT = `${PRODUCT_NAME} app icon`

/** @deprecated Use APP_LOGO_LIGHT_PATH / APP_LOGO_DARK_PATH */
export const APP_LOGO_PATH = APP_LOGO_LIGHT_PATH
