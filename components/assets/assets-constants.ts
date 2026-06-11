// components/assets/assets-constants.ts
import { Laptop, Smartphone, Monitor, Car, Printer, Headphones, Package } from 'lucide-react'
import type { StatusBadgeVariant } from '@/lib/ui/design-system'

export type { Asset, BackendAsset } from '@/types/asset'

export function getAssetTypeConfig(typeName: string = '') {
  const name = typeName.toLowerCase()
  if (name.includes('laptop')) return { label: typeName, icon: Laptop, color: 'text-violet-glow bg-violet-core/20' }
  if (name.includes('desktop') || name.includes('monitor')) return { label: typeName, icon: Monitor, color: 'text-blue-400 bg-blue-400/20' }
  if (name.includes('phone') || name.includes('mobile')) return { label: typeName, icon: Smartphone, color: 'text-teal-400 bg-teal-400/20' }
  if (name.includes('car') || name.includes('vehicle')) return { label: typeName, icon: Car, color: 'text-amber-400 bg-amber-400/20' }
  if (name.includes('printer')) return { label: typeName, icon: Printer, color: 'text-pink-400 bg-pink-400/20' }
  if (name.includes('headset') || name.includes('headphone')) return { label: typeName, icon: Headphones, color: 'text-lime-400 bg-lime-400/20' }
  return { label: typeName || 'Other', icon: Package, color: 'text-slate-400 bg-slate-400/20' }
}

export function getAssetStatusBadgeVariant(statusName: string = ''): StatusBadgeVariant {
  const name = statusName.toLowerCase()
  if (
    name.includes('assigned') ||
    name.includes('in-service') ||
    name.includes('in service') ||
    name.includes('in use') ||
    name.includes('in-use')
  ) {
    return 'in_use'
  }
  if (name.includes('repair') || name.includes('maintenance')) return 'maintenance'
  if (name.includes('store') || name.includes('in-store') || name.includes('ready') || name.includes('available')) {
    return 'available'
  }
  if (name.includes('disposed') || name.includes('deleted')) return 'disposed'
  return 'inactive'
}

export function getStatusConfig(statusName: string = '') {
  const name = statusName.toLowerCase()
  if (
    name.includes('assigned') ||
    name.includes('in-service') ||
    name.includes('in service') ||
    name.includes('in use') ||
    name.includes('in-use')
  ) {
    return {
      label: statusName,
      className: 'bg-violet-50/80 text-violet-700 border border-violet-200/80 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/60',
      dotClassName: 'bg-violet-600 dark:bg-violet-400',
    }
  }
  if (name.includes('repair') || name.includes('maintenance')) {
    return {
      label: statusName,
      className: 'bg-amber-50/80 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
      dotClassName: 'bg-amber-600 dark:bg-amber-400',
    }
  }
  if (name.includes('store') || name.includes('in-store') || name.includes('ready') || name.includes('available')) {
    return {
      label: statusName,
      className: 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
      dotClassName: 'bg-emerald-600 dark:bg-emerald-400',
    }
  }
  if (name.includes('disposed') || name.includes('deleted')) {
    return {
      label: statusName,
      className: 'bg-rose-50/80 text-rose-700 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
      dotClassName: 'bg-rose-600 dark:bg-rose-400',
    }
  }
  return {
    label: statusName || 'Unknown',
    className: 'bg-slate-50/80 text-slate-700 border border-slate-200/80 dark:bg-slate-950/40 dark:text-slate-300 dark:border-slate-800/60',
    dotClassName: 'bg-slate-600 dark:bg-slate-400',
  }
}
