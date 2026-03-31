'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useEventById, useFotoByEvent } from '@/app/hooks/useGaleri'
import { createPortal } from 'react-dom'

const PLACEHOLDER_COLORS = [
  'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
  'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
  'linear-gradient(135deg, #F0F9FF, #E0F2FE)',
  'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
]

export default function GaleriDetailPage({ params }: { params: any }) {
  const resolvedParams = params instanceof Promise ? React.use(params) : params;
  const id = resolvedParams.id;

  const { event, loading: eventLoading } = useEventById(id)
  const { foto, loading: fotoLoading } = useFotoByEvent(id)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [showUI, setShowUI] = useState(true)

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (selectedIndex !== null && selectedIndex < foto.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    if (diff > 50) handleNext()
    if (diff < -50) handlePrev()
    setTouchStart(null)
  }

  const selectedFoto = selectedIndex !== null ? foto[selectedIndex] : null

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'Escape') setSelectedIndex(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex])

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 16px' }}>
        <div className="animate-in" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            href="/galeri" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: '#F9FAFB', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#6366F1', 
              fontSize: '20px', 
              fontWeight: 800, 
              textDecoration: 'none', 
              border: '1px solid #F3F4F6' 
            }}
          >
            ←
          </Link>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
              {eventLoading ? 'Memuat...' : event?.nama_event || 'Detail Album'}
            </h1>
            {event && (
              <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, marginTop: '2px' }}>
                {foto.length} Foto · {new Date(event.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {fotoLoading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat koleksi foto...</div>
        ) : foto.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', background: '#F9FAFB', borderRadius: '24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📸</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>Belum ada foto</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px', fontWeight: 500 }}>Admin belum mengupload foto untuk album ini.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {foto.map((f, i) => (
              <div 
                key={f.id} 
                onClick={() => { setSelectedIndex(i); setShowUI(true); }} 
                className="animate-in"
                style={{ 
                   animationDelay: `${i * 0.05}s`,
                   aspectRatio: '1', 
                   borderRadius: '16px', 
                   overflow: 'hidden', 
                   background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length], 
                   cursor: 'pointer',
                   border: '1px solid rgba(0,0,0,0.03)',
                   boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                <img src={f.foto_url} alt={f.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Photo Viewer */}
      {selectedFoto && typeof document !== 'undefined' && (
        createPortal(
          <div 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: '#000000', 
              zIndex: 9998, 
              display: 'grid', 
              placeItems: 'center', 
              height: '100dvh',
              width: '100vw',
              userSelect: 'none',
              overflow: 'hidden'
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => setShowUI(!showUI)}
          >
            {/* Image Layer — Scrollable Viewport */}
            <div 
              key={selectedFoto.id} 
              style={{ 
                position: 'absolute',
                inset: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                background: '#000000',
                WebkitOverflowScrolling: 'touch', 
                animation: 'photoSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
              }} 
            >
              <div 
                style={{ 
                  minHeight: '100%', 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', // Centers landscape (shorter than viewport)
                  justifyContent: 'center'
                }}
                onClick={() => setShowUI(!showUI)}
              >
                <img 
                  src={selectedFoto.foto_url} 
                  alt={selectedFoto.caption || ''} 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block',
                    margin: '0 auto' 
                  }} 
                />
              </div>
            </div>

            {/* UI Layer: Header */}
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              padding: 'env(safe-area-inset-top, 24px) 20px 24px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
              zIndex: 10,
              opacity: showUI ? 1 : 0,
              pointerEvents: showUI ? 'auto' : 'none',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 800, background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '120px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                {selectedIndex! + 1} / {foto.length}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(null) }} 
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
              >
                ×
              </button>
            </div>

            {/* UI Layer: Navigation Arrows */}
            {showUI && selectedIndex! > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrev() }} 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, cursor: 'pointer', borderStyle: 'solid' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '24px', height: '24px' }} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
            )}
            {showUI && selectedIndex! < foto.length - 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleNext() }} 
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, cursor: 'pointer', borderStyle: 'solid' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '24px', height: '24px' }} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            )}

            {/* UI Layer: Caption */}
            {selectedFoto.caption && (
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                padding: '60px 24px env(safe-area-inset-bottom, 40px)', 
                textAlign: 'center', 
                pointerEvents: 'none', 
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                zIndex: 10,
                opacity: showUI ? 1 : 0,
                transition: 'all 0.3s ease'
              }}>
                <span style={{ 
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.1)', 
                  color: 'white', 
                  padding: '12px 28px', 
                  borderRadius: '120px', 
                  fontSize: '13px', 
                  fontWeight: 800, 
                  backdropFilter: 'blur(10px)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  maxWidth: '85vw',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {selectedFoto.caption}
                </span>
              </div>
            )}

            <style>{`
              @keyframes photoSlide { 
                from { opacity: 0; transform: scale(0.96) } 
                to { opacity: 1; transform: scale(1) } 
              }
            `}</style>
          </div>,
          document.body
        )
      )}
    </main>
  )
}
