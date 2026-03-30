import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import { Nunito, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { DialogProvider } from './providers/DialogProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Basyar-14 | PP Al-Hamid',
  description: 'Website resmi Angkatan Basyar-14 Pondok Pesantren Al-Hamid',
  icons: {
    icon: 'https://api.iconify.design/material-symbols:b-circle-outline.svg?color=%236366F1',
  },
  robots: {
    index: false,
    follow: false,
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#6366F1',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="id" className={`${nunito.variable} ${spaceGrotesk.variable}`}>
      <body>
        <div className="mobile-container">
          <DialogProvider>
            {children}
          </DialogProvider>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}