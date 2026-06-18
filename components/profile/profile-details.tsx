// components/profile/profile-details.tsx
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Hash,
  Mail,
  User,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  UserCheck,
  Phone,
  MapPin,
  Globe,
  Cake,
  ShieldCheck,
  Contact,
} from 'lucide-react'
import type { CurrentUserProfile } from '@/types/auth'
import type { Employee } from '@/types/employee'
import { ProfileDetailField } from './profile-detail-field'
import { cn } from '@/lib/utils'

interface ProfileDetailsProps {
  profile: CurrentUserProfile
  employee: Employee | null
}

export function ProfileDetails({ profile, employee }: ProfileDetailsProps): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const hasEmployee = !!employee
  const activeTab = searchParams.get('tab') || (hasEmployee ? 'employment' : 'account')

  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Construct tabs dynamically based on employee availability
  const tabs = [
    ...(hasEmployee
      ? [
          { id: 'employment', label: 'Employment Detail', icon: Briefcase },
          { id: 'personal', label: 'Personal & Contact', icon: Contact },
        ]
      : []),
    { id: 'account', label: 'Account & Credentials', icon: ShieldCheck },
  ]

  return (
    <div className="space-y-6">
      {/* Premium Tab Navigation */}
      <div className="flex border-b border-border/40 gap-2 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 py-3.5 px-2.5 border-b-2 font-semibold text-xs sm:text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-core focus-visible:ring-offset-2 rounded-t-lg shrink-0 cursor-pointer',
                isActive
                  ? 'border-violet-core text-violet-glow bg-gradient-to-t from-violet-core/5 to-transparent'
                  : 'border-transparent text-muted-foreground hover:text-slate-200 hover:border-border/30'
              )}
            >
              <Icon className={cn('h-4 w-4 transition-transform duration-200', isActive && 'scale-110')} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tabs Content */}
      <div className="pt-2 animate-in fade-in-50 duration-200">
        {activeTab === 'employment' && employee && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
            <ProfileDetailField icon={Hash} label="Employee ID" value={employee.employee_id || '—'} />
            <ProfileDetailField icon={Calendar} label="Joining Date" value={employee.joined_date || '—'} />
            <ProfileDetailField icon={Building2} label="Department" value={employee.department || '—'} />
            <ProfileDetailField icon={Briefcase} label="Designation" value={employee.designation || '—'} />
            <ProfileDetailField icon={UserCheck} label="Employment Type" value={employee.employee_type || '—'} />
            <ProfileDetailField icon={Clock} label="Assigned Shift" value={employee.shift || '—'} />
          </div>
        )}

        {activeTab === 'account' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
            <ProfileDetailField icon={User} label="Username" value={profile.username} />
            <ProfileDetailField icon={Mail} label="Email Address" value={profile.email || '—'} />
            <ProfileDetailField icon={Hash} label="User System ID" value={String(profile.id)} />
          </div>
        )}

        {activeTab === 'personal' && employee && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
            <ProfileDetailField icon={Phone} label="Phone Number" value={employee.phone_number || '—'} />
            <ProfileDetailField icon={Cake} label="Date of Birth" value={employee.date_of_birth || '—'} />
            <ProfileDetailField icon={Globe} label="Nationality" value={employee.nationality || '—'} />
            <ProfileDetailField
              icon={MapPin}
              label="Residential Address"
              value={employee.address || '—'}
              className="sm:col-span-2"
            />
          </div>
        )}
      </div>
    </div>
  )
}

