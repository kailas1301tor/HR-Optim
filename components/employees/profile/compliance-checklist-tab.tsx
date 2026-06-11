// components/employees/profile/compliance-checklist-tab.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { onboardingOffboardingService, type MasterDocType, type EmployeeDocument } from '@/services/onboarding-offboarding-service'
import { CommonEmptyState } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Upload, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'

type ChecklistVariant = 'onboarding' | 'offboarding'

interface ComplianceChecklistTabProps {
  employeeId: number
  variant: ChecklistVariant
}

const VARIANT_CONFIG = {
  onboarding: {
    label: 'onboarding',
    bannerText: 'Once onboarding files are submitted, they are locked as immutable audit logs and cannot be deleted or replaced.',
    emptyText: 'No onboarding document types configured. Set them up under Settings.',
    fetchTypes: (signal?: AbortSignal) => onboardingOffboardingService.getOnboardingDocTypes(signal),
    fetchDocs: (id: number, signal?: AbortSignal) => onboardingOffboardingService.getOnboardingDocuments(id, signal),
    uploadDoc: (data: FormData) => onboardingOffboardingService.uploadOnboardingDocument(data),
  },
  offboarding: {
    label: 'offboarding',
    bannerText: 'Once offboarding files are submitted, they are locked as immutable audit logs and cannot be deleted or replaced.',
    emptyText: 'No offboarding document types configured. Set them up under Settings.',
    fetchTypes: (signal?: AbortSignal) => onboardingOffboardingService.getOffboardingDocTypes(signal),
    fetchDocs: (id: number, signal?: AbortSignal) => onboardingOffboardingService.getOffboardingDocuments(id, signal),
    uploadDoc: (data: FormData) => onboardingOffboardingService.uploadOffboardingDocument(data),
  },
} as const

function ComplianceChecklistTab({ employeeId, variant }: ComplianceChecklistTabProps) {
  const config = VARIANT_CONFIG[variant]
  const [masterTypes, setMasterTypes] = useState<MasterDocType[]>([])
  const [uploadedDocs, setUploadedDocs] = useState<EmployeeDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadingId, setUploadingId] = useState<number | null>(null)

  const loadData = useCallback(async (signal?: AbortSignal): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const [typesData, docsData] = await Promise.all([
        config.fetchTypes(signal),
        config.fetchDocs(employeeId, signal),
      ])
      setMasterTypes(typesData)
      setUploadedDocs(docsData)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      const message = err instanceof Error ? err.message : `Failed to load ${config.label} checklist.`
      console.error(`Failed to load ${config.label} checklist data:`, err)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [employeeId, config])

  useEffect(() => {
    const controller = new AbortController()
    loadData(controller.signal)
    return () => controller.abort()
  }, [loadData])

  const handleFileUpload = async (masterTypeId: number, file: File): Promise<void> => {
    setUploadingId(masterTypeId)
    try {
      const formData = new FormData()
      formData.append('employee', String(employeeId))
      formData.append('document_type', String(masterTypeId))
      formData.append('file', file)
      await config.uploadDoc(formData)
      toast.success('Document uploaded successfully!')
      const docsData = await config.fetchDocs(employeeId)
      setUploadedDocs(docsData)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload document. Please try again.'
      console.error('Failed to upload document:', err)
      toast.error(message)
    } finally {
      setUploadingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4" aria-label="Loading checklist" role="status">
        <Skeleton className={cn('h-4 w-40 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="bg-midnight/40 border border-border/40 rounded-[20px] [corner-shape:squircle] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className={cn('w-8 h-8 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
              <div className="space-y-1.5">
                <Skeleton className={cn('h-3.5 w-32 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                <Skeleton className={cn('h-2 w-20 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
              </div>
            </div>
            <Skeleton className={cn('w-24 h-9 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 animate-bounce">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-cloud mb-1">Failed to Load Checklist</h4>
        <p className="text-xs text-slate-400 max-w-xs mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={() => loadData()} className="h-9 rounded-[20px] [corner-shape:squircle]">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 bg-violet-core/5 border border-violet-core/20 rounded-[20px] [corner-shape:squircle] p-4 text-xs">
        <AlertCircle className="w-4 h-4 text-violet-glow shrink-0 mt-0.5" />
        <div className="text-slate-350 space-y-1">
          <p className="font-semibold text-violet-glow">Compliance Document Control</p>
          <p>{config.bannerText}</p>
        </div>
      </div>

      <div className="space-y-3">
        {masterTypes.length === 0 ? (
          <CommonEmptyState
            icon={FileText}
            title="No document types configured"
            description={config.emptyText}
            className="py-8 shadow-none border-0 bg-transparent"
          />
        ) : (
          masterTypes.map((type) => {
            const matchingDoc = uploadedDocs.find((doc) => doc.document_type === type.name)
            const isUploading = uploadingId === type.id

            return (
              <div
                key={type.id}
                className={cn(
                  'flex items-center justify-between border rounded-[20px] [corner-shape:squircle] p-4 transition-all duration-200 bg-midnight/35',
                  matchingDoc
                    ? 'border-emerald-500/20 hover:border-emerald-500/30'
                    : 'border-border/60 hover:border-violet-core/30'
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-[20px] [corner-shape:squircle] flex items-center justify-center shrink-0 border',
                      matchingDoc
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800/40 border-border/40 text-slate-400'
                    )}
                  >
                    {matchingDoc ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">{type.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {matchingDoc
                        ? `Uploaded: ${new Date(matchingDoc.created_at ?? '').toLocaleDateString()}`
                        : 'Action required'}
                    </p>
                  </div>
                </div>

                <div className="ml-4 shrink-0 flex items-center gap-2">
                  {matchingDoc ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 rounded-[16px] [corner-shape:squircle] text-xs font-medium border-border/80 hover:bg-slate-800 text-slate-300 flex items-center gap-1.5"
                      asChild
                    >
                      <a href={matchingDoc.file_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-3.5 h-3.5" /> View File
                      </a>
                    </Button>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(type.id, file)
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                        className="h-9 px-3 rounded-[16px] [corner-shape:squircle] text-xs font-semibold border-violet-core/35 text-violet-glow hover:bg-violet-core/10 flex items-center gap-1.5"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-glow" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

/** Backward-compatible named exports for existing import sites. */
export function OnboardingChecklistTab({ employeeId }: { employeeId: number }) {
  return <ComplianceChecklistTab employeeId={employeeId} variant="onboarding" />
}

export function OffboardingChecklistTab({ employeeId }: { employeeId: number }) {
  return <ComplianceChecklistTab employeeId={employeeId} variant="offboarding" />
}
