// components/employees/profile/personal/regulatory-section.tsx
'use client'

import { MapPin } from 'lucide-react'
import type { Employee } from '@/types/employee'

interface RegulatorySectionProps {
  employee: Employee
}

export function RegulatorySection({ employee }: RegulatorySectionProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 font-sans">
        Address Details
      </h3>
      <div className="bg-midnight/40 border border-border/40 rounded-[20px] [corner-shape:squircle] p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-[20px] [corner-shape:squircle] bg-violet-core/10 border border-violet-core/20 flex items-center justify-center shrink-0">
          <MapPin className="w-4.5 h-4.5 text-violet-glow" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Physical / Residential Address</p>
          <p className="text-sm font-semibold text-cloud mt-0.5 leading-relaxed">
            {employee.address || '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
