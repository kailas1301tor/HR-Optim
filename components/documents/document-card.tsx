// components/documents/document-card.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, Trash2, MoreHorizontal, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommonStatusBadge } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { uiCardInteractive, uiOutlineBtn } from '@/lib/ui/design-system'
import { toast } from 'sonner'
import {
  employeeDocumentService,
  companyDocumentService,
  type EmployeeDocument,
  type CompanyDocument
} from '@/services/document-service'
import { statusConfig, fileTypeIcons } from './documents-constants'

interface DocumentCardProps {
  doc: EmployeeDocument | CompanyDocument
  type: 'employee' | 'company'
  index: number
  onDeleteSuccess: () => void
}

function isEmployeeDocument(doc: EmployeeDocument | CompanyDocument): doc is EmployeeDocument {
  return 'employee' in doc
}

export function DocumentCard({ doc, type, index, onDeleteSuccess }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const statusLower = (doc.status || '').toLowerCase()
  const normalizedStatus: 'valid' | 'expiring' | 'expired' =
    statusLower.includes('expired') ? 'expired' :
    statusLower.includes('expiring') || statusLower.includes('soon') ? 'expiring' :
    'valid'

  const status = statusConfig[normalizedStatus]

  const getFileType = (url: string): 'pdf' | 'doc' | 'img' => {
    if (!url) return 'pdf'
    const cleanUrl = url.split('?')[0]
    const ext = cleanUrl.split('.').pop()?.toLowerCase() || ''
    if (ext === 'pdf') return 'pdf'
    if (['doc', 'docx'].includes(ext)) return 'doc'
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'img'
    return 'pdf'
  }

  const fileTypeKey = getFileType(doc.file_url || '')
  const fileType = fileTypeIcons[fileTypeKey]
  const FileIcon = fileType.icon

  const isEmp = isEmployeeDocument(doc)
  const docName = isEmp
    ? doc.document_type_name || doc.document_type
    : doc.company_document_type_name || doc.company_document_type

  const subtitleLabel = isEmp
    ? doc.employee_name || doc.employee
    : doc.branch_name || doc.branch

  const docNumber = isEmp ? doc.document_number : doc.document_number || 'N/A'

  const getDaysUntilExpiry = (expiryDateStr: string): number => {
    if (!expiryDateStr) return 0
    const expiry = new Date(expiryDateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    expiry.setHours(0, 0, 0, 0)
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const daysUntilExpiry = getDaysUntilExpiry(doc.expiry_date || '')

  const handleDownload = () => {
    if (doc.file_url) {
      window.open(doc.file_url, '_blank')
    } else {
      toast.error('No file URL available')
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
      console.error(err)
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
        className={cn(
          uiCardInteractive,
          'p-5 border-l-2 group',
          status.borderColor
        )}
      >
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className={cn('p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-105 shrink-0', fileType.color)}>
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
              <DropdownMenuContent align="end" className="bg-popover border border-border text-xs rounded-xl shadow-xl">
                <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
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
          {!isEmp && doc.issue_date && (
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold text-lg">Delete document</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm mt-2">
              Are you sure you want to delete this {type === 'employee' ? 'employee' : 'company'} document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/40">
            <AlertDialogCancel asChild>
              <Button variant="outline" className={cn(uiOutlineBtn, 'text-xs')} disabled={isDeleting}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              className="h-10 bg-destructive text-white hover:bg-destructive/90 font-semibold rounded-xl px-5 flex items-center gap-2 text-xs"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
