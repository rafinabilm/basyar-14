'use client'

import { useState, useRef, useEffect } from 'react'

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
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  useEffect(() => {
    if (isOpen) {
      console.log('ImageViewer opened:', { isOpen, imagesCount: images.length, images, title, description })
    }
  }, [isOpen, images, title, description])

  // Reset error state when images change
  useEffect(() => {
    setImageError(false)
    setCurrentIndex(0)
  }, [images])

  useEffect(() => {
    if (isOpen && images.length > 0) {
      // Save original overflow state
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      
      return () => {
        // Restore original overflow state
        document.body.style.overflow = originalOverflow || 'unset'
      }
    }
  }, [isOpen, images.length])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]
  
  if (!currentImage) {
    console.error('ImageViewer: currentImage is undefined', { currentIndex, imagesLength: images.length, images })
    return null
  }
  
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < images.length - 1

  const handlePrev = () => {
    if (canGoPrev) setCurrentIndex(prev => prev - 1)
  }

  const handleNext = () => {
    if (canGoNext) setCurrentIndex(prev => prev + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') onClose()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX
    handleSwipe()
  }

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && canGoNext) {
      handleNext()
    } else if (isRightSwipe && canGoPrev) {
      handlePrev()
    }
  }

  return (
    <div
      ref={(el) => el?.focus()}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(4px)',
        outline: 'none',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            {title && (
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
                {title}
              </div>
            )}
            {description && (
              <div style={{ fontSize: '13px', color: '#6B7280' }}>
                {description}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#9CA3AF',
              padding: '0',
              marginLeft: '16px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Image Container */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ 
            position: 'relative', 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: '#F9FAFB', 
            width: '100%',
            minHeight: '200px',
            maxHeight: '70vh',
            overflow: 'auto',
            userSelect: 'none',
          }}>
          {!imageError && currentImage && (
            <img
              src={currentImage}
              alt={`Image ${currentIndex + 1}`}
              onLoad={() => {
                console.log('Image loaded successfully:', currentImage)
                setImageError(false)
              }}
              onError={(e) => {
                console.error('Image load error:', { currentImage, currentIndex, error: e })
                setImageError(true)
              }}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          )}
          {imageError && (
            <div style={{ color: '#EF4444', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
              <div>❌ Gagal memuat gambar</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px', maxWidth: '200px', wordBreak: 'break-all' }}>
                {currentImage}
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                style={{
                  position: 'absolute',
                  left: '12px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: canGoPrev ? 'pointer' : 'not-allowed',
                  opacity: canGoPrev ? 1 : 0.3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#6366F1',
                }}
              >
                ◀
              </button>

              <button
                onClick={handleNext}
                disabled={!canGoNext}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: canGoNext ? 'pointer' : 'not-allowed',
                  opacity: canGoNext ? 1 : 0.3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#6366F1',
                }}
              >
                ▶
              </button>
            </>
          )}
        </div>

        {/* Footer - Image Counter & Thumbnails */}
        {images.length > 1 && (
          <div style={{ padding: '16px', borderTop: '1px solid #F3F4F6', background: '#F9FAFB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#6B7280', minWidth: '60px', textAlign: 'center' }}>
                {currentIndex + 1} / {images.length}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: idx === currentIndex ? '2px solid #6366F1' : '1px solid #D1D5DB',
                      background: 'white',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      padding: 0,
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
