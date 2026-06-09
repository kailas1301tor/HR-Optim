// components/requests/requests-constants.ts
import { Calendar, FileText, DollarSign, Landmark } from 'lucide-react'

export type RequestType = 'leave' | 'document' | 'salary-advance' | 'loan'

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export type RequestStatusFilter = RequestStatus | 'all'

export interface Request {
  id: string
  backendId: number
  displayId: string
  type: RequestType
  title: string
  description: string
  requester: {
    id: string
    name: string
    initials: string
    department: string
    avatar?: string
  }
  submittedAt: string
  status: RequestStatus
  priority: 'low' | 'medium' | 'high'
  timeline: {
    step: string
    status: 'completed' | 'current' | 'pending'
    date?: string
  }[]
}

export const typeConfig = {
  leave: {
    label: 'Leave',
    icon: Calendar,
    color: 'text-violet-glow bg-violet-core/20',
    borderColor: 'border-l-violet-core',
    gradientClass: 'from-violet-core/10',
  },
  document: {
    label: 'Document',
    icon: FileText,
    color: 'text-amber-400 bg-amber-400/20',
    borderColor: 'border-l-amber-400',
    gradientClass: 'from-amber-400/10',
  },
  'salary-advance': {
    label: 'Salary Advance',
    icon: DollarSign,
    color: 'text-lime-400 bg-lime-400/20',
    borderColor: 'border-l-lime-400',
    gradientClass: 'from-lime-400/10',
  },
  loan: {
    label: 'Loan',
    icon: Landmark,
    color: 'text-teal-400 bg-teal-400/20',
    borderColor: 'border-l-teal-400',
    gradientClass: 'from-teal-400/10',
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

export const priorityConfig = {
  low: { label: 'Low', className: 'text-slate-400' },
  medium: { label: 'Medium', className: 'text-amber-400' },
  high: { label: 'High', className: 'text-red-400' },
}
