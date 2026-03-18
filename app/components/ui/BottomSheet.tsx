'use client'

import { ReactNode, useEffect } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
}

export function BottomSheet({ isOpen, onClose, title, subtitle, children }: BottomSheetProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <div
        className={`bottom-sheet-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`bottom-sheet ${isOpen ? 'open' : ''}`}>
        <div className="sheet-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1C2B22' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '10px', color: '#A0B0A4', marginTop: '2px' }}>{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F5F0E8', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#A0B0A4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </>
  )
}
