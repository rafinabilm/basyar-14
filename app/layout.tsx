import type { Metadata, Viewport } from 'next'
import './globals.css'
import { DialogProvider } from '@/app/providers/DialogProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'Basyar-14 | PP Al-Hamid',
  description: 'Website resmi Angkatan Basyar-14 Pondok Pesantren Al-Hamid',
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
  themeColor: '#2E7D52',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
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