// lib/helpers/format-display-text.ts

const PRESERVED_ACRONYMS = new Set([
  'AI',
  'API',
  'CEO',
  'CFO',
  'COO',
  'CTO',
  'HR',
  'IT',
  'QA',
  'R&D',
  'UI',
  'UX',
  'VP',
])

function isMostlyUppercase(value: string): boolean {
  const letters = value.replace(/[^a-zA-Z]/g, '')
  if (letters.length === 0) return false
  const upperCount = letters.replace(/[^A-Z]/g, '').length
  return upperCount / letters.length >= 0.8
}

function capitalizeToken(token: string): string {
  if (!token) return ''

  const upper = token.toUpperCase()
  if (PRESERVED_ACRONYMS.has(upper)) return upper

  if (token.includes('-')) {
    return token.split('-').map(capitalizeToken).join('-')
  }

  if (token.includes("'")) {
    return token
      .split("'")
      .map((part, index) => {
        if (!part) return part
        if (index === 0) return capitalizeToken(part)
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      })
      .join("'")
  }

  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
}

function titleCaseWords(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(capitalizeToken)
    .join(' ')
}

/** Title Case for person names (e.g. `test Doe` → `Test Doe`). */
export function formatPersonName(value: string | null | undefined): string {
  if (!value?.trim()) return ''
  return titleCaseWords(value)
}

/** Title Case for departments, designations, roles, and statuses (e.g. `TESTING` → `Testing`). */
export function formatTitleLabel(value: string | null | undefined): string {
  if (!value?.trim()) return ''
  const trimmed = value.trim()
  const normalized = isMostlyUppercase(trimmed) ? trimmed.toLowerCase() : trimmed
  return titleCaseWords(normalized)
}
