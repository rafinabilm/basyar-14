'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { BottomNav } from '@/app/components/ui/BottomNav'
import { useEventById, useFotoByEvent, GaleriFoto } from '@/app/hooks/useGaleri'

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
                onClick={() => setSelectedIndex(i)} 
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
      {selectedFoto && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.99)', zIndex: 1000, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(16px)', animation: 'fadeIn 0.2s ease-out', userSelect: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header Area */}
          <div style={{ padding: '24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ color: 'white', fontSize: '13px', fontWeight: 800, background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '120px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {selectedIndex! + 1} / {foto.length}
            </div>
            <button 
              onClick={() => setSelectedIndex(null)} 
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px 100px', position: 'relative' }} onClick={() => setSelectedIndex(null)}>
            {/* Nav Buttons - Left */}
            {selectedIndex! > 0 && (
              <button 
                onClick={handlePrev} 
                className="viewer-nav-btn"
                style={{ position: 'absolute', left: '16px', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '24px', height: '24px' }} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
            )}
            
            {/* Image Wrapper */}
            <div key={selectedFoto.id} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'photoSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <img 
                src={selectedFoto.foto_url} 
                alt={selectedFoto.caption || ''} 
                style={{ maxWidth: '92vw', maxHeight: '75vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} 
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Nav Buttons - Right */}
            {selectedIndex! < foto.length - 1 && (
              <button 
                onClick={handleNext} 
                className="viewer-nav-btn"
                style={{ position: 'absolute', right: '16px', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '24px', height: '24px' }} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            )}
          </div>

          {/* Caption Area */}
          {selectedFoto.caption && (
            <div style={{ position: 'absolute', bottom: '120px', left: 0, right: 0, textAlign: 'center', padding: '0 24px', pointerEvents: 'none' }}>
              <span style={{ background: 'white', color: '#111827', padding: '12px 28px', borderRadius: '120px', fontSize: '13px', fontWeight: 800, boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
                {selectedFoto.caption}
              </span>
            </div>
          )}

          <style>{`
            @keyframes photoSlide { 
              from { opacity: 0; transform: scale(0.96) translateY(10px) } 
              to { opacity: 1; transform: scale(1) translateY(0) } 
            }
            .viewer-nav-btn:hover { background: rgba(0,0,0,0.5) !important; transform: scale(1.1); }
            .viewer-nav-btn:active { transform: scale(0.9); }
          `}</style>
        </div>
      )}

      <BottomNav />
    </main>
  )
}
