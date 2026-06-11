// components/documents/document-card.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, Trash2, MoreHorizontal, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommonStatusBadge } from '@/components/common'
import { SettingsDeleteDialog } from '@/components/settings/shared'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { uiCardInteractive } from '@/lib/ui/design-system'
import { toast } from 'sonner'
import {
  employeeDocumentService,
  companyDocumentService,
} from '@/services/document-service'
import type { CompanyDocument, DocumentTab, EmployeeDocument } from '@/types/document'
import {
  getDaysUntilExpiry,
  getDocumentDisplayName,
  getDocumentNumber,
  getDocumentSubtitle,
  getFileTypeFromUrl,
  isEmployeeDocument,
  normalizeDocumentStatus,
} from '@/lib/mappers/document-mapper'
import { downloadFileFromUrl } from '@/lib/helpers/download-file-url'
import { statusConfig, fileTypeIcons } from './documents-constants'

interface DocumentCardProps {
  doc: EmployeeDocument | CompanyDocument
  type: DocumentTab
  index: number
  onDeleteSuccess: () => void
}

export function DocumentCard({ doc, type, index, onDeleteSuccess }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const normalizedStatus = normalizeDocumentStatus(doc.status || '')
  const status = statusConfig[normalizedStatus]

  const fileTypeKey = getFileTypeFromUrl(doc.file_url || '')
  const fileType = fileTypeIcons[fileTypeKey]
  const FileIcon = fileType.icon

  const docName = getDocumentDisplayName(doc, type)
  const subtitleLabel = getDocumentSubtitle(doc, type)
  const docNumber = getDocumentNumber(doc)
  const daysUntilExpiry = getDaysUntilExpiry(doc.expiry_date || '')
  const isEmp = isEmployeeDocument(doc)

  const handleOpenFile = () => {
    if (!doc.file_url) {
      toast.error('No file URL available')
      return
    }
    const opened = window.open(doc.file_url, '_blank', 'noopener,noreferrer')
    if (opened) opened.opener = null
  }

  const handleDownload = async () => {
    if (!doc.file_url) {
      toast.error('No file URL available')
      return
    }
    try {
      await downloadFileFromUrl(doc.file_url)
    } catch {
      const anchor = document.createElement('a')
      anchor.href = doc.file_url
      anchor.download = ''
      anchor.rel = 'noopener noreferrer'
      anchor.target = '_blank'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      if (type === 'employee') {
        await employeeDocumentService.delete(doc.id)
      } else {
        await companyDocumentService.delete(doc.id)
      }
      toast.success('Document deleted successfully!')
      setShowDeleteDialog(false)
      onDeleteSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete document'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={cn(uiCardInteractive, 'p-5 border-l-2 group', status.borderColor)}
      >
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className={cn('p-2.5 rounded-[20px] [corner-shape:squircle] transition-transform duration-300 group-hover:scale-105 shrink-0', fileType.color)}>
            <FileIcon className="w-5 h-5" aria-hidden />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <CommonStatusBadge variant={normalizedStatus} label={status.label} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus:opacity-100 hover:bg-midnight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-core/50 focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
                  aria-label="Document actions"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  ) : (
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border text-xs rounded-[20px] [corner-shape:squircle] shadow-xl">
                <DropdownMenuItem onClick={handleOpenFile} className="cursor-pointer">
                  <Eye className="w-4 h-4 mr-2 text-slate-400" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                  <Download className="w-4 h-4 mr-2 text-slate-400" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-border/40" />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                  className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-cloud mb-1.5 truncate group-hover:text-violet-glow transition-colors">
          {docName}
        </h3>
        <p className="text-xs text-muted-foreground mb-4 flex items-center gap-2 font-medium min-w-0">
          <span className="truncate min-w-0 flex-1">{subtitleLabel}</span>
          {docNumber && docNumber !== 'N/A' && (
            <span className="font-mono text-[10px] bg-midnight px-1.5 py-0.5 rounded text-violet-glow/90 border border-border/20 truncate shrink-0 max-w-[40%]">
              {docNumber}
            </span>
          )}
        </p>

        <div className="flex flex-col gap-1.5 pt-3 border-t border-border/40 text-xs">
          {!isEmp && 'issue_date' in doc && doc.issue_date && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Issued</span>
              <span className="font-mono text-cloud font-medium">{doc.issue_date}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Expires</span>
            <span
              className={cn(
                'font-mono font-semibold',
                normalizedStatus === 'expired'
                  ? 'text-red-400'
                  : normalizedStatus === 'expiring'
                    ? 'text-amber-400'
                    : 'text-cloud'
              )}
            >
              {normalizedStatus === 'expired'
                ? `${Math.abs(daysUntilExpiry)} days ago`
                : `${daysUntilExpiry} days left`}
            </span>
          </div>
        </div>
      </motion.div>

      <SettingsDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete document"
        description={`Are you sure you want to delete this ${type === 'employee' ? 'employee' : 'company'} document? This action cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
