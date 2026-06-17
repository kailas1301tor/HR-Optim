// lib/brand.ts

const nameFromEnv = process.env.NEXT_PUBLIC_PRODUCT_NAME?.trim()

/** Customer-facing product name (override via NEXT_PUBLIC_PRODUCT_NAME). */
export const PRODUCT_NAME =
  nameFromEnv && nameFromEnv.length > 0 ? nameFromEnv : 'Roka'

export const COMPANY_NAME = 'HROPTIM'

/** Shown under the product name in the shell and on the login page. */
export const PRODUCT_TAGLINE = `${PRODUCT_NAME} by ${COMPANY_NAME}`

export const PRODUCT_DESCRIPTION =
  `${PRODUCT_NAME} by ${COMPANY_NAME} — enterprise human resource and asset management.`

export const APP_ICON_PATH = '/brand/roka-app-icon.png'

export const APP_ICON_ALT = `${PRODUCT_NAME} app icon`

export function pageTitle(page: string): string {
  return `${page} | ${PRODUCT_NAME}`
}
