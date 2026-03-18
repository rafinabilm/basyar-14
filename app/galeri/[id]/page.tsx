'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BottomNav } from '@/app/components/ui/BottomNav'
import { useEventById, useFotoByEvent, GaleriFoto } from '@/app/hooks/useGaleri'

const PLACEHOLDER_COLORS = [
  'linear-gradient(135deg, #D4EDDE, #A8C4B0)',
  'linear-gradient(135deg, #C8DDD0, #8FBA9F)',
  'linear-gradient(135deg, #b8d4c0, #7eaa8e)',
  'linear-gradient(135deg, #E2D9C8, #C8DDD0)',
]

export default function GaleriDetailPage({ params }: { params: { id: string } }) {
  const { event, loading: eventLoading } = useEventById(params.id)
  const { foto, loading: fotoLoading } = useFotoByEvent(params.id)
  const [selectedFoto, setSelectedFoto] = useState<GaleriFoto | null>(null)

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <Link href="/galeri" style={{ fontSize: '20px', color: '#2E7D52', fontWeight: 800, textDecoration: 'none', lineHeight: 1 }}>←</Link>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.3px' }}>
              {eventLoading ? 'Memuat...' : event?.nama_event || 'Album'}
            </h1>
            {event && (
              <p style={{ fontSize: '9px', color: '#A0B0A4' }}>
                {foto.length} foto · {new Date(event.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {fotoLoading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat foto...</div>
        ) : foto.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📸</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Belum ada foto</div>
            <div style={{ fontSize: '11px', color: '#A0B0A4', marginTop: '4px' }}>Foto akan muncul setelah diupload admin.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
            {foto.map((f, i) => (
              <div key={f.id} onClick={() => setSelectedFoto(f)} style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length], cursor: 'pointer' }}>
                <img src={f.foto_url} alt={f.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Photo Viewer */}
      {selectedFoto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setSelectedFoto(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', cursor: 'pointer' }}>
              ×
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px 40px' }} onClick={() => setSelectedFoto(null)}>
            <img src={selectedFoto.foto_url} alt={selectedFoto.caption || ''} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }} />
          </div>
          {selectedFoto.caption && (
            <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, textAlign: 'center', padding: '0 20px' }}>
              <span style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontFamily: 'Nunito, sans-serif' }}>
                {selectedFoto.caption}
              </span>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </main>
  )
}
