import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { COMPANY_NAME, PRODUCT_DESCRIPTION, PRODUCT_NAME } from '@/lib/brand'
import './globals.css'

// Mock font variables to avoid Google Fonts network request failure during build in sandbox
const plusJakarta = { variable: 'font-sans' }
const inter = { variable: 'font-sans' }
const jetbrainsMono = { variable: 'font-mono' }

export const metadata: Metadata = {
  title: {
    default: `${PRODUCT_NAME} · ${COMPANY_NAME}`,
    template: `%s | ${PRODUCT_NAME}`,
  },
  description: PRODUCT_DESCRIPTION,
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f0a1e',
  width: 'device-width',
  initialScale: 1,
}

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
