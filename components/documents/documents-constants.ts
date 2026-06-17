// components/documents/documents-constants.ts
import { CheckCircle, Clock, AlertTriangle, FileText, File, Image } from 'lucide-react'
import type { DocumentUiStatus } from '@/types/document'

export type {
  CompanyDocument,
  DocumentStatusCounts,
  DocumentTab,
  DocumentUiStatus,
  EmployeeDocument,
} from '@/types/document'
export { EMPTY_DOCUMENT_STATUS_COUNTS as EMPTY_STATUS_COUNTS } from '@/types/document'

export const statusConfig: Record<
  DocumentUiStatus,
  { label: string; className: string; borderColor: string; icon: typeof CheckCircle }
> = {
  valid: {
    label: 'Valid',
    className: 'bg-success-bg text-success-text',
    borderColor: 'border-l-lime-400',
    icon: CheckCircle,
  },
  expiring: {
    label: 'Expiring Soon',
    className: 'bg-warning-bg text-warning-text',
    borderColor: 'border-l-amber-400',
    icon: Clock,
  },
  expired: {
    label: 'Expired',
    className: 'bg-danger-bg text-danger-text',
    borderColor: 'border-l-red-500',
    icon: AlertTriangle,
  },
}

export const fileTypeIcons = {
  pdf: { icon: FileText, color: 'text-red-400 bg-red-400/20' },
  doc: { icon: File, color: 'text-blue-400 bg-blue-400/20' },
  img: { icon: Image, color: 'text-lime-400 bg-lime-400/20' },
}
