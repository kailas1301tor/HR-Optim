// components/employees/profile/personal/contact-section.tsx
'use client'

import { Mail, Phone, Globe, Calendar } from 'lucide-react'
import type { Employee } from '@/types/employee'

interface ContactSectionProps {
  employee: Employee
}

export function ContactSection({ employee }: ContactSectionProps) {
  const email = employee.user?.email || '—'
  const phone = employee.phone_number || '—'
  const nationality = employee.nationality || '—'
  const dob = employee.date_of_birth || ''

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 font-sans">Contact & Basic Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-midnight/60 border border-border/40 rounded-[20px] [corner-shape:squircle] p-3 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-[16px] [corner-shape:squircle] bg-violet-core/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-violet-glow" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Email Address</p>
            <p className="text-xs text-slate-200 truncate font-medium" title={email}>{email}</p>
          </div>
        </div>
        <div className="bg-midnight/60 border border-border/40 rounded-[20px] [corner-shape:squircle] p-3 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-[16px] [corner-shape:squircle] bg-violet-core/10 flex items-center justify-center">
            <Phone className="w-4 h-4 text-violet-glow" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Phone Number</p>
            <p className="text-xs text-slate-200 truncate font-mono font-medium">{phone}</p>
          </div>
        </div>
        <div className="bg-midnight/60 border border-border/40 rounded-[20px] [corner-shape:squircle] p-3 flex flex-col gap-2">
          <div className="w-8 h-8 rounded-[16px] [corner-shape:squircle] bg-violet-core/10 flex items-center justify-center">
            <Globe className="w-4 h-4 text-violet-glow" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Nationality</p>
            <p className="text-xs text-slate-200 truncate font-medium">{nationality}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3 mt-3">
        <div className="bg-midnight/40 border border-border/45 rounded-[20px] [corner-shape:squircle] p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-[16px] [corner-shape:squircle] bg-slate-700/30 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Date of Birth</p>
            <p className="text-xs font-semibold text-cloud font-mono">
              {dob ? new Date(dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
