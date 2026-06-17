// components/tickets/help-support-section.tsx
'use client'

import type { ReactNode } from 'react'
import { Mail, Phone } from 'lucide-react'
import { CommonCard } from '@/components/common'
import {
  SUPPORT_EMAIL,
  SUPPORT_MAILTO_HREF,
  SUPPORT_PHONE,
  SUPPORT_TEL_HREF,
  SUPPORT_WHATSAPP_HREF,
} from '@/lib/support'
import { cn } from '@/lib/utils'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

interface ContactRowProps {
  icon: ReactNode
  iconClassName?: string
  label: string
  href: string
  ariaLabel: string
  value: string
  hint?: string
  hintClassName?: string
  external?: boolean
}

function ContactRow({
  icon,
  iconClassName,
  label,
  href,
  ariaLabel,
  value,
  hint,
  hintClassName,
  external = false,
}: ContactRowProps) {
  return (
    <li className="border-b border-border/50 last:border-b-0">
      <a
        href={href}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={cn(
          'flex items-center gap-3 px-5 py-3.5 transition-colors',
          'hover:bg-midnight/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-core/50',
        )}
      >
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
            'bg-muted/60 text-muted-foreground',
            iconClassName,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-medium text-cloud truncate">{value}</p>
          {hint ? (
            <p className={cn('mt-0.5 text-xs', hintClassName)}>{hint}</p>
          ) : null}
        </div>
      </a>
    </li>
  )
}

export function HelpSupportSection() {
  return (
    <section aria-labelledby="help-contact-heading">
      <CommonCard className="overflow-hidden p-0">
        <div className="border-b border-border/50 px-5 py-4">
          <h2 id="help-contact-heading" className="text-sm font-semibold text-cloud">
            Contact us
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Reach our team by email, phone, or WhatsApp
          </p>
        </div>

        <ul>
          <ContactRow
            icon={<Mail className="h-4 w-4" aria-hidden />}
            label="Email"
            value={SUPPORT_EMAIL}
            href={SUPPORT_MAILTO_HREF}
            ariaLabel={`Email support at ${SUPPORT_EMAIL}`}
          />
          <ContactRow
            icon={<Phone className="h-4 w-4" aria-hidden />}
            label="Phone"
            value={SUPPORT_PHONE}
            href={SUPPORT_TEL_HREF}
            ariaLabel={`Call support at ${SUPPORT_PHONE}`}
          />
          <ContactRow
            icon={<WhatsAppIcon className="h-4 w-4" />}
            iconClassName="text-[#25D366] bg-[#25D366]/10"
            label="WhatsApp"
            value={SUPPORT_PHONE}
            hint="Chat on WhatsApp"
            hintClassName="text-[#25D366]"
            href={SUPPORT_WHATSAPP_HREF}
            ariaLabel={`Chat on WhatsApp with support at ${SUPPORT_PHONE}`}
            external
          />
        </ul>
      </CommonCard>
    </section>
  )
}
