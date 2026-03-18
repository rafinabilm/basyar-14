'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type DialogOptions = {
  title: string
  message: string
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
          style={{ position: 'fixed', inset: 0, background: 'rgba(20, 40, 28, 0.75)', backdropFilter: 'blur(4px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'fadeIn 0.2s ease-out' }} 
          onClick={() => options.type === 'alert' ? handleClose(true) : handleClose(false)}
        >
          <div 
            style={{ background: 'white', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '340px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              {options.type === 'confirm' ? (
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: options.isDestructive ? '#FEE2E2' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={options.isDestructive ? '#C0392B' : '#B8860B'} style={{ width: '20px', height: '20px' }} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#EAF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1E7B3A" style={{ width: '20px', height: '20px' }} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              )}
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.3px', margin: 0 }}>{options.title}</h3>
            </div>
            
            <div style={{ fontSize: '14px', color: '#5A6E5E', marginBottom: '24px', lineHeight: 1.6, paddingLeft: '4px' }}>
              {options.message.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #E2D9C8' }}>
              {options.type === 'confirm' && (
                <button onClick={() => handleClose(false)} style={{ flex: 1, padding: '12px 16px', borderRadius: '14px', background: '#F5F0E8', color: '#5A6E5E', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                  {options.cancelText || 'Batal'}
                </button>
              )}
              <button 
                onClick={() => handleClose(true)} 
                style={{ flex: options.type === 'confirm' ? 1 : undefined, padding: '12px 24px', borderRadius: '14px', background: options.isDestructive ? '#C0392B' : '#2E7D52', color: 'white', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}
              >
                {options.confirmText || 'OK'}
              </button>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95) } to { opacity: 1; transform: translateY(0) scale(1) } }
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
