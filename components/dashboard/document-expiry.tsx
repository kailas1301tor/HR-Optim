'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface Document {
  id: string
  name: string
  type: string
  employeeName: string
  expiryDate: string
  daysUntilExpiry: number
  status: 'expired' | 'expiring' | 'valid'
}

const documents: Document[] = [
  {
    id: 'DOC-001',
    name: 'Emirates ID',
    type: 'ID',
    employeeName: 'Ahmed Al Maktoum',
    expiryDate: '2024-01-15',
    daysUntilExpiry: -10,
    status: 'expired',
  },
  {
    id: 'DOC-002',
    name: 'Work Visa',
    type: 'Visa',
    employeeName: 'Sarah Johnson',
    expiryDate: '2024-02-05',
    daysUntilExpiry: 12,
    status: 'expiring',
  },
  {
    id: 'DOC-003',
    name: 'Passport',
    type: 'ID',
    employeeName: 'Mohammed Hassan',
    expiryDate: '2024-02-20',
    daysUntilExpiry: 27,
    status: 'expiring',
  },
  {
    id: 'DOC-004',
    name: 'Medical Insurance',
    type: 'Insurance',
    employeeName: 'Fatima Al Rashid',
    expiryDate: '2024-06-15',
    daysUntilExpiry: 142,
    status: 'valid',
  },
  {
    id: 'DOC-005',
    name: 'Driving License',
    type: 'License',
    employeeName: 'James Wilson',
    expiryDate: '2024-08-30',
    daysUntilExpiry: 218,
    status: 'valid',
  },
]

const statusConfig = {
  expired: {
    color: 'bg-danger-bg text-danger-text',
    barColor: 'bg-red-500',
    icon: AlertTriangle,
  },
  expiring: {
    color: 'bg-warning-bg text-warning-text',
    barColor: 'bg-amber-500',
    icon: Clock,
  },
  valid: {
    color: 'bg-success-bg text-success-text',
    barColor: 'bg-lime-400',
    icon: CheckCircle,
  },
}

export function DocumentExpiryTimeline() {
  const maxDays = Math.max(...documents.filter(d => d.daysUntilExpiry > 0).map((d) => d.daysUntilExpiry), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-cloud">Document Expiry Timeline</h3>
        <span className="text-xs text-muted-foreground">Next 12 months</span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Track document renewals and avoid compliance issues
      </p>

      <div className="space-y-4">
        {documents.map((doc, index) => {
          const config = statusConfig[doc.status]
          const barWidth = doc.status === 'expired' 
            ? 0 
            : Math.min((doc.daysUntilExpiry / maxDays) * 100, 100)

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-8 h-8 rounded-[16px] [corner-shape:squircle] bg-midnight flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-cloud truncate">{doc.name}</p>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0',
                      config.color
                    )}>
                      {doc.status === 'expired' ? 'Expired' : doc.status === 'expiring' ? 'Expiring Soon' : 'Valid'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {doc.employeeName} · <span className="font-mono text-violet-glow">{doc.id}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-mono text-cloud">
                    {doc.status === 'expired' 
                      ? `${Math.abs(doc.daysUntilExpiry)}d ago` 
                      : `${doc.daysUntilExpiry}d`}
                  </p>
                  <p className="text-xs text-muted-foreground">{doc.expiryDate}</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="ml-12 h-1.5 bg-midnight rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                  className={cn('h-full rounded-full', config.barColor)}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
