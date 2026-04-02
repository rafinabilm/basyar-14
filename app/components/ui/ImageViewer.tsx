'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ImageViewerProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  title?: string
  description?: string
}

export function ImageViewer({ isOpen, onClose, images, title, description }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Ensure we're mounted on the client before using createPortal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset error state when images change
  useEffect(() => {
    setImageError(false)
    setCurrentIndex(0)
  }, [images])

  useEffect(() => {
    if (!isOpen || images.length === 0) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow || ''
    }
  }, [isOpen, images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, images.length])

  if (!isOpen || images.length === 0 || !mounted) return null

  const currentImage = images[currentIndex]
  if (!currentImage) return null

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < images.length - 1

  const handlePrev = () => { if (canGoPrev) setCurrentIndex(prev => prev - 1) }
  const handleNext = () => { if (canGoNext) setCurrentIndex(prev => prev + 1) }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX
    const distance = touchStartX.current - touchEndX.current
    if (distance > 50 && canGoNext) handleNext()
    if (distance < -50 && canGoPrev) handlePrev()
  }

  const overlay = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        animation: 'ivFadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90dvh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'ivSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && (
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827', marginBottom: '2px', fontFamily: 'Space Grotesk, sans-serif' }}>
                {title}
              </div>
            )}
            {description && (
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {description}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F3F4F6',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#6B7280',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '12px',
              flexShrink: 0,
              fontWeight: 800,
            }}
          >
            ✕
          </button>
        </div>

        {/* Image area */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            flex: 1,
            minHeight: 0,
            position: 'relative',
            background: '#0f0f0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {!imageError ? (
            <img
              key={currentImage}
              src={currentImage}
              alt={`Bukti ${currentIndex + 1}`}
              loading="eager"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
              style={{
                maxWidth: '100%',
                maxHeight: '60dvh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                animation: 'ivImgFade 0.2s ease-out',
              }}
            />
          ) : (
            <div style={{ color: '#EF4444', textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Gagal memuat gambar</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px', wordBreak: 'break-all', maxWidth: '240px' }}>
                {currentImage}
              </div>
            </div>
          )}

          {/* Prev/Next arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: canGoPrev ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: canGoPrev ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s',
                  zIndex: 2,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke={canGoPrev ? '#6366F1' : '#9CA3AF'} style={{ width: '18px', height: '18px' }} strokeWidth={2.5} strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: canGoNext ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: canGoNext ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s',
                  zIndex: 2,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke={canGoNext ? '#6366F1' : '#9CA3AF'} style={{ width: '18px', height: '18px' }} strokeWidth={2.5} strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </>
          )}
        </div>

        {/* Footer: counter + thumbnails */}
        {images.length > 1 && (
          <div style={{
            padding: '14px 16px',
            borderTop: '1px solid #F3F4F6',
            background: '#F9FAFB',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280' }}>
                {currentIndex + 1} / {images.length}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentIndex(idx); setImageError(false) }}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      border: idx === currentIndex ? '2.5px solid #6366F1' : '2px solid #E5E7EB',
                      background: 'white',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      padding: 0,
                      flexShrink: 0,
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ivFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ivSlideUp { from { opacity: 0; transform: translateY(16px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes ivImgFade { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  )

  return createPortal(overlay, document.body)
}