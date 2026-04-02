'use client'

import { useEffect, useState } from 'react'
import { useDialog } from '@/app/providers/DialogProvider'

export function PWABanner() {
  const [isStandalone, setIsStandalone] = useState(true) // default true to avoid flash on standalone
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isDismissed, setIsDismissed] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { showConfirm, showAlert } = useDialog()

  useEffect(() => {
    setMounted(true)
    
    // Check if standalone
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    
    // iOS detection
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    
    setIsStandalone(standalone)
    setIsIOS(ios)

    // Check dismissal state (1 day expiration)
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

    // Android/Chrome install prompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  if (!mounted || isStandalone || isDismissed) return null
  if (!isIOS && !deferredPrompt) return null // Only show on iOS or if Android prompt is ready

  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    
    if (isIOS) {
      showAlert({
        title: 'Install di iPhone',
        message: 'Tap ikon "Share" (⍐) di bagian tengah bawah browser Safari, kemudian gulir panel dan pilih "Add to Home Screen" (Tambah ke Layar Utama).',
        confirmText: 'Mengerti'
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
      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-md sticky top-0 z-50 animate-in no-animate gap-2"
      style={{
        paddingTop: 'max(14px, env(safe-area-inset-top))',
        paddingRight: 'max(16px, env(safe-area-inset-right))',
        paddingBottom: '14px',
        paddingLeft: 'max(16px, env(safe-area-inset-left))'
      }}
    >
      <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={handleInstallClick}>
        <div className="bg-white/20 p-2 rounded-[14px] shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-bold text-[14px] leading-tight text-white truncate">Install Website Basyar-14</h3>
          <p className="text-[12px] text-indigo-100 leading-tight mt-[3px] truncate">di Home Screen HP</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={handleInstallClick}
          className="bg-white text-indigo-600 text-[13px] font-bold px-5 py-2 rounded-full shadow hover:bg-slate-50 transition-colors shrink-0"
        >
          Install
        </button>
        <button onClick={handleDismiss} className="text-white/80 hover:text-white p-2 -mr-2 shrink-0 flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
