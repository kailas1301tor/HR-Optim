// components/profile/profile-details.tsx
'use client'

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
} from 'lucide-react'
import type { CurrentUserProfile } from '@/types/auth'
import type { Employee } from '@/types/employee'
import { ProfileDetailField } from './profile-detail-field'

interface ProfileDetailsProps {
  profile: CurrentUserProfile
  employee: Employee | null
}

export function ProfileDetails({ profile, employee }: ProfileDetailsProps): React.JSX.Element {
  return (
    <div className="space-y-8">
      {/* Account & Credentials */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-border/30">
          <h3 className="text-xs font-bold uppercase tracking-wider text-violet-glow">
            Account & Credentials
          </h3>
        </div>
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <ProfileDetailField icon={User} label="Username" value={profile.username} />
          <ProfileDetailField icon={Mail} label="Email Address" value={profile.email || '—'} />
          <ProfileDetailField icon={Hash} label="User System ID" value={String(profile.id)} />
        </div>
      </div>

      {/* Employment Detail */}
      {employee && (
        <div className="space-y-4">
          <div className="pb-2 border-b border-border/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-glow">
              Employment Detail
            </h3>
          </div>
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <ProfileDetailField icon={Hash} label="Employee ID" value={employee.employee_id || '—'} />
            <ProfileDetailField icon={Calendar} label="Joining Date" value={employee.joined_date || '—'} />
            <ProfileDetailField icon={Building2} label="Department" value={employee.department || '—'} />
            <ProfileDetailField icon={Briefcase} label="Designation" value={employee.designation || '—'} />
            <ProfileDetailField icon={UserCheck} label="Employment Type" value={employee.employee_type || '—'} />
            <ProfileDetailField icon={Clock} label="Assigned Shift" value={employee.shift || '—'} />
          </div>
        </div>
      )}

      {/* Personal & Contact */}
      {employee && (
        <div className="space-y-4">
          <div className="pb-2 border-b border-border/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-glow">
              Personal & Contact
            </h3>
          </div>
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <ProfileDetailField icon={Phone} label="Phone Number" value={employee.phone_number || '—'} />
            <ProfileDetailField icon={Cake} label="Date of Birth" value={employee.date_of_birth || '—'} />
            <ProfileDetailField icon={Globe} label="Nationality" value={employee.nationality || '—'} />
            <ProfileDetailField icon={MapPin} label="Residential Address" value={employee.address || '—'} className="sm:col-span-2" />
          </div>
        </div>
      )}
    </div>
  )
}
