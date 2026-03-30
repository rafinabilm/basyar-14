'use client'

import React, { useState } from 'react'
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
  const [selectedFoto, setSelectedFoto] = useState<GaleriFoto | null>(null)

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
                onClick={() => setSelectedFoto(f)} 
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.98)', zIndex: 1000, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ padding: '24px 20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setSelectedFoto(null)} 
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                width: '44px', 
                height: '44px', 
                borderRadius: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontSize: '24px', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ×
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px 64px' }} onClick={() => setSelectedFoto(null)}>
            <img src={selectedFoto.foto_url} alt={selectedFoto.caption || ''} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', animation: 'zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          </div>
          {selectedFoto.caption && (
            <div style={{ position: 'absolute', bottom: '60px', left: 0, right: 0, textAlign: 'center', padding: '0 32px' }}>
              <span style={{ background: 'rgba(255,255,255,1)', color: '#111827', padding: '10px 24px', borderRadius: '20px', fontSize: '13px', fontWeight: 800, fontFamily: 'Nunito, sans-serif', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                {selectedFoto.caption}
              </span>
            </div>
          )}
          <style>{`
            @keyframes zoomIn { from { opacity: 0; transform: scale(0.9) } to { opacity: 1; transform: scale(1) } }
          `}</style>
        </div>
      )}

      <BottomNav />
    </main>
  )
}
