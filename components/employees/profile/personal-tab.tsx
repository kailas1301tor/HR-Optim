// components/employees/profile/personal-tab.tsx
'use client'

import type { Employee } from '@/types/employee'
import { ContactSection } from './personal/contact-section'
import { EmploymentSection } from './personal/employment-section'
import { RegulatorySection } from './personal/regulatory-section'
import { BankSection } from './personal/bank-section'

interface PersonalTabProps {
  employee: Employee
}

export function PersonalTab({ employee }: PersonalTabProps) {
  return (
    <div className="space-y-6">
      <ContactSection employee={employee} />
      <EmploymentSection employee={employee} />
      <RegulatorySection employee={employee} />
      <BankSection employee={employee} />
    </div>
  )
}
