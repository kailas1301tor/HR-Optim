// lib/brand.ts

const nameFromEnv = process.env.NEXT_PUBLIC_PRODUCT_NAME?.trim()

/** Customer-facing product name (override via NEXT_PUBLIC_PRODUCT_NAME). */
export const PRODUCT_NAME =
  nameFromEnv && nameFromEnv.length > 0 ? nameFromEnv : 'Roka'

export const COMPANY_NAME = 'HROPTIM'

/** Shown under the product name in metadata and legacy contexts. */
export const PRODUCT_TAGLINE = `${PRODUCT_NAME} by ${COMPANY_NAME}`

/** Shown under the wordmark logo in shell and login (logo already includes product name). */
export const COMPANY_TAGLINE = `by ${COMPANY_NAME}`

export const PRODUCT_DESCRIPTION =
  `${PRODUCT_NAME} by ${COMPANY_NAME} — enterprise human resource and asset management.`

export function pageTitle(page: string): string {
  return `${page} | ${PRODUCT_NAME}`
}

/** App icon used in favicon contexts. */
export const APP_ICON_PATH = '/brand/roka-app-icon.png'

export const APP_ICON_ALT = `${PRODUCT_NAME} app icon`

/** Full horizontal wordmark logo (icon + ROKA text). Legacy asset — prefer composited BrandLogo. */
export const APP_LOGO_PATH = '/brand/roka-logo.png'

export const APP_LOGO_ALT = 'ROKA'

/** Squircle app icon — high-contrast mark for shell, favicon, and composited wordmark. */
export const APP_MARK_PATH = '/brand/roka-app-icon.png'

export const APP_MARK_ALT = `${PRODUCT_NAME} mark`
