'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type DialogOptions = {
  title: string
  message: string | ReactNode
  type?: 'alert' | 'confirm'
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}

type DialogContextType = {
  showAlert: (options: Omit<DialogOptions, 'type'> | string) => Promise<void>
  showConfirm: (options: Omit<DialogOptions, 'type'> | string) => Promise<boolean>
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<DialogOptions | null>(null)
  
  const [resolver, setResolver] = useState<{resolve: (val: boolean) => void} | null>(null)

  const showAlert = (opts: Omit<DialogOptions, 'type'> | string) => {
    return new Promise<void>((resolve) => {
      const parsedOpts = typeof opts === 'string' ? { title: 'Pemberitahuan', message: opts } : opts
      setOptions({ ...parsedOpts, type: 'alert' })
      setResolver({ resolve: () => resolve() })
      setIsOpen(true)
    })
  }

  const showConfirm = (opts: Omit<DialogOptions, 'type'> | string) => {
    return new Promise<boolean>((resolve) => {
      const parsedOpts = typeof opts === 'string' ? { title: 'Konfirmasi', message: opts } : opts
      setOptions({ ...parsedOpts, type: 'confirm' })
      setResolver({ resolve })
      setIsOpen(true)
    })
  }

  const handleClose = (result: boolean) => {
    setIsOpen(false)
    if (resolver) resolver.resolve(result)
  }

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      
      {isOpen && options && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'fadeIn 0.2s ease-out' }} 
          onClick={() => options.type === 'alert' ? handleClose(true) : handleClose(false)}
        >
          <div 
            style={{ background: 'white', borderRadius: '32px', padding: '32px', width: '100%', maxWidth: '360px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', marginBottom: '24px' }}>
              {options.type === 'confirm' ? (
                <div style={{ width: '56px', height: '56px', borderRadius: '20px', background: options.isDestructive ? '#FEF2F2' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={options.isDestructive ? '#EF4444' : '#F59E0B'} style={{ width: '28px', height: '28px' }} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              ) : (
                <div style={{ width: '56px', height: '56px', borderRadius: '20px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" style={{ width: '28px', height: '28px' }} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0', fontFamily: 'Space Grotesk, sans-serif' }}>{options.title}</h3>
                <div style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                  {typeof options.message === 'string' 
                    ? options.message.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)
                    : options.message}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {options.type === 'confirm' && (
                <button onClick={() => handleClose(false)} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: '#F9FAFB', color: '#6B7280', border: '1px solid #F3F4F6', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', transition: 'all 0.2s' }}>
                  {options.cancelText || 'Batal'}
                </button>
              )}
              <button 
                onClick={() => handleClose(true)} 
                style={{ flex: 1, padding: '14px', borderRadius: '16px', background: options.isDestructive ? '#EF4444' : '#6366F1', color: 'white', border: 'none', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: options.isDestructive ? '0 4px 12px rgba(239, 68, 68, 0.2)' : '0 4px 12px rgba(99, 102, 241, 0.2)', transition: 'all 0.2s' }}
              >
                {options.confirmText || 'Siap'}
              </button>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.95); filter: blur(4px) } to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0) } }
          `}</style>
        </div>
      )}
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = useContext(DialogContext)
  if (!context) throw new Error('useDialog must be used within DialogProvider')
  return context
}
