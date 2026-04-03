'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useDialog } from '@/app/providers/DialogProvider'

export function PWABanner() {
  const pathname = usePathname()
  const [isStandalone, setIsStandalone] = useState(true)
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isDismissed, setIsDismissed] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { showConfirm, showAlert } = useDialog()

  const isAdminRoute = pathname.startsWith('/admin')

  useEffect(() => {
    setMounted(true)
    
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    
    setIsStandalone(standalone)
    setIsIOS(ios)

    const dismissedAt = localStorage.getItem('pwaDismissedAt')
    if (dismissedAt) {
      const dismissedTime = new Date(dismissedAt).getTime()
      const now = new Date().getTime()
      if (now - dismissedTime < 24 * 60 * 60 * 1000) {
        setIsDismissed(true)
      } else {
        setIsDismissed(false)
        localStorage.removeItem('pwaDismissedAt')
      }
    } else {
      setIsDismissed(false)
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  if (!mounted || isStandalone || isDismissed || isAdminRoute) return null
  if (!isIOS && !deferredPrompt) return null

  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    
    if (isIOS) {
      // [MARK: Updated iOS Safari specific instruction flow]
      showAlert({
        title: 'Install di iPhone / iPad 🍏',
        message: 'Cara install Basyar-14:\n\n1. Buka web ini via Safari (Wajib).\n2. Tap menu (...) di pojok kanan bawah.\n3. Pilih "Share".\n4. Scroll / klik panah "View More".\n5. Pilih "Add to Home Screen" ➕.',
        confirmText: 'Oke, Mengerti!'
      })
      return
    }

    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsStandalone(true)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const isConfirmed = await showConfirm({
      title: 'Sembunyikan Banner?',
      message: 'Banner instalasi akan disembunyikan sampai besok.',
      confirmText: 'Ya, sembunyikan',
      cancelText: 'Batal'
    })

    if (isConfirmed) {
      localStorage.setItem('pwaDismissedAt', new Date().toISOString())
      setIsDismissed(true)
    }
  }

  return (
    <div 
      className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md sticky top-0 z-50 w-full animate-in no-animate flex items-center justify-between cursor-pointer active:opacity-90 transition-opacity"
      onClick={handleInstallClick}
      style={{
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        paddingRight: 'max(16px, env(safe-area-inset-right))',
        paddingBottom: '12px',
        paddingLeft: 'max(16px, env(safe-area-inset-left))'
      }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 pointer-events-none">
        <div className="bg-white/20 p-2.5 rounded-[14px] flex-none">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-bold text-[14px] leading-tight text-white pr-2 truncate">
            Install Basyar-14
          </h3>
          <p className="text-[12px] text-indigo-100 leading-tight mt-[3px] pr-2 truncate">
            Tap untuk akses dari layar utama 📲
          </p>
        </div>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation()
          handleDismiss(e)
        }} 
        className="text-white/70 hover:text-white p-2 -mr-2 bg-transparent flex-none z-10"
        aria-label="Tutup"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}