'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BottomNav } from '@/app/components/ui/BottomNav'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { useEvents } from '@/app/hooks/useGaleri'

const PLACEHOLDER_COLORS = [
  'linear-gradient(135deg, #6366F1, #818cf8)',
  'linear-gradient(135deg, #4f46e5, #6366f1)',
  'linear-gradient(135deg, #818cf8, #a5b4fc)',
  'linear-gradient(135deg, #4338ca, #4f46e5)',
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
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px' }}>
        <PageHeader title="Momen & Galeri" subtitle="Kilas balik kebersamaan kita." />
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', margin: '0 -20px', paddingLeft: '20px', paddingRight: '20px' }}>
          {tahunList.map((t, i) => (
            <button 
              key={t} 
              onClick={() => setActiveTahun(t)} 
              className="animate-in"
              style={{ 
                padding: '10px 20px', 
                borderRadius: '20px', 
                fontSize: '13px', 
                fontWeight: 700, 
                whiteSpace: 'nowrap', 
                border: '1px solid', 
                borderColor: activeTahun === t ? '#6366F1' : '#F3F4F6', 
                background: activeTahun === t ? '#6366F1' : '#FFFFFF', 
                color: activeTahun === t ? 'white' : '#6B7280', 
                cursor: 'pointer', 
                fontFamily: 'Nunito, sans-serif',
                animationDelay: `${i * 0.05}s`
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat galeri...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '32px', height: '32px' }} strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
            title="Belum ada foto nih"
            description="Momen kebersamaan kalian akan muncul di sini segera."
          />
        ) : (
          <>
            {featured && (
              <Link href={`/galeri/${featured.id}`} style={{ textDecoration: 'none' }} className="animate-in">
                <div style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <div style={{ height: '200px', background: featured.foto_cover_url ? undefined : PLACEHOLDER_COLORS[0] }}>
                    {featured.foto_cover_url && <img src={featured.foto_cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 16px 16px', background: 'linear-gradient(transparent, rgba(17,24,39,0.9))' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>{featured.nama_event}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '2px', fontWeight: 500 }}>{new Date(featured.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                </div>
              </Link>
            )}
            {rest.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {rest.map((event, i) => (
                  <Link key={event.id} href={`/galeri/${event.id}`} style={{ textDecoration: 'none' }} className="animate-in">
                    <div style={{ animationDelay: `${i * 0.1 + 0.2}s`, borderRadius: '20px', overflow: 'hidden', position: 'relative', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                      <div style={{ height: '120px', background: event.foto_cover_url ? undefined : PLACEHOLDER_COLORS[(i + 1) % PLACEHOLDER_COLORS.length] }}>
                        {event.foto_cover_url && <img src={event.foto_cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 12px 10px', background: 'linear-gradient(transparent, rgba(17,24,39,0.85))' }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>{event.nama_event}</div>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{new Date(event.tanggal).getFullYear()}</div>
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
