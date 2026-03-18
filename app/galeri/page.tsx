'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BottomNav } from '@/app/components/ui/BottomNav'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { useEvents } from '@/app/hooks/useGaleri'

const PLACEHOLDER_COLORS = [
  'linear-gradient(135deg, #2E7D52, #5aac7e)',
  'linear-gradient(135deg, #C8DDD0, #8FBA9F)',
  'linear-gradient(135deg, #b8d4c0, #7eaa8e)',
  'linear-gradient(135deg, #A8C4B0, #6a9e80)',
]

export default function GaleriPage() {
  const { events, loading } = useEvents()
  const [activeTahun, setActiveTahun] = useState('Semua')

  const tahunList = ['Semua', ...Array.from(new Set(events.map(e => new Date(e.tanggal).getFullYear().toString()))).sort((a, b) => parseInt(b) - parseInt(a))]

  const filtered = events.filter(e =>
    activeTahun === 'Semua' ? true : new Date(e.tanggal).getFullYear().toString() === activeTahun
  )

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px' }}>
        <PageHeader title="Galeri Kenangan" />
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {tahunList.map(t => (
            <button key={t} onClick={() => setActiveTahun(t)} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap', border: '1px solid', borderColor: activeTahun === t ? '#2E7D52' : '#E2D9C8', background: activeTahun === t ? '#2E7D52' : 'transparent', color: activeTahun === t ? 'white' : '#5A6E5E', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2E7D52" style={{ width: '28px', height: '28px' }} strokeWidth={1.8}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
            title="Belum ada foto nih"
            description="Momen kebersamaan kalian akan muncul di sini."
          />
        ) : (
          <>
            {featured && (
              <Link href={`/galeri/${featured.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ height: '140px', background: featured.foto_cover_url ? undefined : PLACEHOLDER_COLORS[0] }}>
                    {featured.foto_cover_url && <img src={featured.foto_cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 12px 10px', background: 'linear-gradient(transparent, rgba(20,40,28,0.82))' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>{featured.nama_event}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.75)' }}>{new Date(featured.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                </div>
              </Link>
            )}
            {rest.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {rest.map((event, i) => (
                  <Link key={event.id} href={`/galeri/${event.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                      <div style={{ height: '80px', background: event.foto_cover_url ? undefined : PLACEHOLDER_COLORS[(i + 1) % PLACEHOLDER_COLORS.length] }}>
                        {event.foto_cover_url && <img src={event.foto_cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 8px 7px', background: 'linear-gradient(transparent, rgba(20,40,28,0.82))' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>{event.nama_event}</div>
                        <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.75)' }}>{new Date(event.tanggal).getFullYear()}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </main>
  )
}
