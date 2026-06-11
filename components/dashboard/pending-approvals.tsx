'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Check, X, Clock, Calendar, FileText, Package } from 'lucide-react'

interface Request {
  id: string
  type: 'leave' | 'document' | 'asset' | 'expense'
  title: string
  requester: {
    name: string
    avatar?: string
    initials: string
    department: string
  }
  submittedAt: string
  details: string
}

const requests: Request[] = [
  {
    id: 'REQ-001',
    type: 'leave',
    title: 'Annual Leave Request',
    requester: {
      name: 'Ahmed Al Maktoum',
      initials: 'AM',
      department: 'Engineering',
    },
    submittedAt: '2 hours ago',
    details: 'Jan 20 - Jan 25, 2024 (5 days)',
  },
  {
    id: 'REQ-002',
    type: 'document',
    title: 'Passport Upload',
    requester: {
      name: 'Sarah Johnson',
      initials: 'SJ',
      department: 'HR',
    },
    submittedAt: '4 hours ago',
    details: 'Renewal document pending verification',
  },
  {
    id: 'REQ-003',
    type: 'asset',
    title: 'Laptop Request',
    requester: {
      name: 'Mohammed Hassan',
      initials: 'MH',
      department: 'Finance',
    },
    submittedAt: '1 day ago',
    details: 'MacBook Pro 14" for development work',
  },
  {
    id: 'REQ-004',
    type: 'leave',
    title: 'Sick Leave',
    requester: {
      name: 'Fatima Al Rashid',
      initials: 'FR',
      department: 'Marketing',
    },
    submittedAt: '1 day ago',
    details: 'Jan 18, 2024 (1 day)',
  },
]

const typeConfig = {
  leave: {
    icon: Calendar,
    color: 'bg-violet-core/20 text-violet-glow',
    borderColor: 'border-l-violet-core',
  },
  document: {
    icon: FileText,
    color: 'bg-amber-400/20 text-amber-400',
    borderColor: 'border-l-amber-400',
  },
  asset: {
    icon: Package,
    color: 'bg-teal-400/20 text-teal-400',
    borderColor: 'border-l-teal-400',
  },
  expense: {
    icon: Clock,
    color: 'bg-lime-400/20 text-lime-400',
    borderColor: 'border-l-lime-400',
  },
}

export function PendingApprovals() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-cloud">Pending Approvals</h3>
        <span className="px-2 py-1 rounded-full bg-violet-core/20 text-violet-glow text-xs font-medium">
          {requests.length} pending
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Review and approve employee requests
      </p>

      <div className="space-y-4">
        {requests.map((request, index) => {
          const config = typeConfig[request.type]
          const Icon = config.icon

          return (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'bg-midnight rounded-[20px] [corner-shape:squircle] p-4 border-l-2',
                config.borderColor
              )}
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={request.requester.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
                    {request.requester.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('p-1 rounded', config.color)}>
                      <Icon className="w-3 h-3" />
                    </span>
                    <p className="text-sm font-medium text-cloud truncate">
                      {request.title}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {request.requester.name} · {request.requester.department}
                  </p>
                  <p className="text-xs text-slate-400">{request.details}</p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {request.submittedAt}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 hover:bg-red-500/20 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 px-3 bg-lime-400 text-lime-900 hover:bg-lime-300"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <Button
        variant="ghost"
        className="w-full mt-4 text-muted-foreground hover:text-cloud"
      >
        View All Requests
      </Button>
    </motion.div>
  )
}
