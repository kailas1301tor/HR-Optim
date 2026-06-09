// lib/ui/design-system.ts

export const uiCard =
  'bg-card border border-border/80 rounded-2xl shadow-lg transition-all duration-200'

export const uiCardInteractive =
  'bg-card border border-border/80 rounded-2xl shadow-lg transition-all duration-200 hover:border-violet-core/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]'

export const uiDialog =
  'bg-card border border-border/80 rounded-2xl p-6 shadow-2xl'

export const uiInput =
  'h-10 rounded-xl bg-input border-border text-sm text-foreground placeholder:text-muted-foreground'

export const uiSelect =
  'h-10 rounded-xl bg-input border-border text-sm text-foreground'

export const uiPrimaryBtn =
  'h-10 rounded-xl bg-violet-core hover:bg-violet-core/90 text-sm font-medium text-white shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-all duration-200 hover:shadow-[0_0_28px_rgba(124,58,237,0.35)]'

export const uiApproveBtn =
  'h-10 min-h-10 rounded-xl bg-lime-400 text-lime-900 hover:bg-lime-300 text-sm font-medium transition-all duration-200'

export const uiOutlineBtn =
  'h-10 rounded-xl border-border text-sm transition-all duration-200'

export const uiSkeletonBlock = 'bg-midnight/60'

/** Leave request calendar — theme-aware (no hardcoded dark hex) */
export const uiCalendarShell =
  'rounded-2xl border border-border bg-card overflow-hidden w-full'

export const uiCalendarHeaderBtn =
  'rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors'

/** 1px gap grid — parent bg shows through as consistent dividers */
export const uiCalendarGrid = 'grid grid-cols-7 gap-px bg-border'

export const uiCalendarCellBase =
  'relative flex h-full min-h-[72px] flex-col p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-core/50 focus-visible:z-10'

export const uiCalendarCellInMonth = 'bg-card'

export const uiCalendarCellOutMonth = 'bg-muted/50'

export const uiPageHeaderBorder = 'pb-2 border-b border-border/40'

/** App shell layout — shared header height & sidebar widths */
export const SHELL_HEADER_HEIGHT_PX = 64
export const SHELL_SIDEBAR_WIDTH_EXPANDED = 240
export const SHELL_SIDEBAR_WIDTH_COLLAPSED = 72

export const uiShellHeader =
  'h-16 shrink-0 flex items-center border-b border-border'

export const uiShellHeaderInset = 'px-4 sm:px-6'

export const uiEmptyStateShell =
  'flex flex-col items-center justify-center text-center p-12 bg-card border border-border/60 rounded-2xl py-16 shadow-lg'

export const uiEmptyStateIconRing =
  'w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-core/20 to-violet-glow/10 border border-violet-core/20 flex items-center justify-center mb-5 ring-4 ring-violet-core/5'

export const uiErrorBanner =
  'rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300'

export const uiErrorStateShell =
  'flex flex-col items-center justify-center text-center p-10 bg-card border border-red-500/20 rounded-2xl shadow-lg'

export const uiFilterChipBase =
  'shrink-0 rounded-xl py-2 px-3.5 text-xs font-medium border transition-all duration-200 cursor-pointer'

export const uiFilterChipActive =
  'bg-violet-core/15 text-violet-glow border-violet-core/30 shadow-[0_0_12px_rgba(139,92,246,0.12)]'

export const uiFilterChipInactive =
  'text-slate-400 border-transparent hover:text-slate-200 hover:bg-midnight/60'

export const uiTableShell = 'bg-card border border-border/80 rounded-2xl shadow-lg overflow-hidden'

export const uiSectionHeader = 'pb-2 border-b border-border/40'

export const uiTabChipBase = uiFilterChipBase
export const uiTabChipActive = uiFilterChipActive
export const uiTabChipInactive = uiFilterChipInactive

export const statusBadgeClasses = {
  pending: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
  approved: 'bg-lime-400/15 text-lime-300 border border-lime-400/20',
  rejected: 'bg-red-500/15 text-red-300 border border-red-500/20',
  active: 'bg-lime-400/15 text-lime-300 border border-lime-400/20',
  inactive: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
  draft: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
  valid: 'bg-lime-400/15 text-lime-300 border border-lime-400/20',
  expiring: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
  expired: 'bg-red-500/15 text-red-300 border border-red-500/20',
  in_use: 'bg-violet-core/15 text-violet-glow border border-violet-core/20',
  available: 'bg-lime-400/15 text-lime-300 border border-lime-400/20',
  disposed: 'bg-red-500/15 text-red-300 border border-red-500/20',
  maintenance: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
  on_leave: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
  onboarding: 'bg-violet-core/15 text-violet-glow border border-violet-core/20',
  offboarding: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
} as const

export type StatusBadgeVariant = keyof typeof statusBadgeClasses

export function getEmployeeStatusBadgeVariant(statusName: string = ''): StatusBadgeVariant {
  const name = statusName.toLowerCase()
  if (name.includes('active') && !name.includes('inactive')) return 'active'
  if (name.includes('onboarding')) return 'onboarding'
  if (name.includes('offboarding')) return 'offboarding'
  if (name.includes('leave')) return 'on_leave'
  if (name.includes('probation') || name.includes('pending')) return 'pending'
  if (name.includes('inactive') || name.includes('terminated')) return 'inactive'
  return 'draft'
}

