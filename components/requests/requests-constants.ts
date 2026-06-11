// components/requests/requests-constants.ts
import { Calendar, FileText, DollarSign, Landmark } from 'lucide-react'

export type {
  Request,
  RequestType,
  RequestStatus,
  RequestStatusFilter,
  RequestTypeFilter,
  StatusCounts,
} from '@/types/request'

export const typeConfig = {
  leave: {
    label: 'Leave',
    icon: Calendar,
    color: 'text-violet-glow bg-violet-core/20',
    borderColor: 'border-l-violet-core',
    gradientClass: 'from-violet-core/10',
    hoverBorder: 'hover:border-violet-core/55 hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)]',
    iconSurface: 'bg-violet-core/12 text-violet-glow ring-violet-core/15',
  },
  document: {
    label: 'Document',
    icon: FileText,
    color: 'text-amber-400 bg-amber-400/20',
    borderColor: 'border-l-amber-400',
    gradientClass: 'from-amber-400/10',
    hoverBorder: 'hover:border-amber-500/55 hover:shadow-[0_8px_32px_rgba(245,158,11,0.12)]',
    iconSurface: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 ring-amber-500/15',
  },
  'salary-advance': {
    label: 'Salary Advance',
    icon: DollarSign,
    color: 'text-lime-400 bg-lime-400/20',
    borderColor: 'border-l-lime-400',
    gradientClass: 'from-lime-400/10',
    hoverBorder: 'hover:border-lime-500/55 hover:shadow-[0_8px_32px_rgba(132,204,22,0.12)]',
    iconSurface: 'bg-lime-500/12 text-lime-700 dark:text-lime-400 ring-lime-500/15',
  },
  loan: {
    label: 'Loan',
    icon: Landmark,
    color: 'text-teal-400 bg-teal-400/20',
    borderColor: 'border-l-teal-400',
    gradientClass: 'from-teal-400/10',
    hoverBorder: 'hover:border-teal-500/55 hover:shadow-[0_8px_32px_rgba(20,184,166,0.12)]',
    iconSurface: 'bg-teal-500/12 text-teal-700 dark:text-teal-400 ring-teal-500/15',
  },
} as const

export const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
    apiValue: 'Pending',
  },
  approved: {
    label: 'Approved',
    className: 'bg-lime-400/15 text-lime-300 border border-lime-400/20',
    apiValue: 'Approved',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-500/15 text-red-300 border border-red-500/20',
    apiValue: 'Rejected',
  },
} as const
