// components/requests/forms/leave-document-uploader.tsx
'use client'

import { X, UploadCloud } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface LeaveDocumentUploaderProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  error: string | null
  setError: (error: string | null) => void
}

export function LeaveDocumentUploader({
  files,
  onFilesChange,
  error,
  setError,
}: LeaveDocumentUploaderProps): React.JSX.Element {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files)
      onFilesChange([...files, ...selected])
      setError(null)
    }
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    onFilesChange(updated)
    if (updated.length === 0) {
      setError('At least one document is required for this leave type.')
    } else {
      setError(null)
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
        Attach Documents <span className="text-red-400">*</span>
      </Label>

      <div
        className={cn(
          'border border-dashed border-border/60 hover:border-violet-core/50 rounded-[20px] [corner-shape:squircle] p-5 bg-midnight/10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 group',
          error && 'border-red-500/50 bg-red-500/[0.02]'
        )}
        onClick={() => document.getElementById('leave-file-input')?.click()}
      >
        <input
          type="file"
          id="leave-file-input"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-10 h-10 rounded-full bg-violet-core/10 group-hover:bg-violet-core/20 flex items-center justify-center transition-colors">
          <UploadCloud className="w-5 h-5 text-violet-glow" />
        </div>
        <span className="text-xs text-slate-400">
          Drag files here or <span className="text-violet-glow font-medium hover:underline">browse</span>
        </span>
        <span className="text-[10px] text-slate-500">Multiple files allowed</span>
      </div>

      {error && (
        <p className="text-[11px] font-medium text-red-500 mt-1">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="space-y-1.5 mt-3 max-h-[140px] overflow-y-auto pr-1">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 bg-midnight/30 border border-border/40 rounded-xl p-2 px-3 text-xs"
            >
              <div className="min-w-0 flex-1 flex items-center gap-2">
                <span className="text-slate-300 truncate" title={file.name}>
                  {file.name}
                </span>
                <span className="text-[10px] text-slate-500 shrink-0">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                aria-label={`Remove file ${file.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
