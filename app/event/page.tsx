'use client'

import { BottomNav } from '@/app/components/ui/BottomNav'
import { Card } from '@/app/components/ui/Card'
import { Pill } from '@/app/components/ui/Pill'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { useEvents } from '@/app/hooks/useGaleri'

function getDaysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default function EventPage() {
  const { events, loading } = useEvents()

  const today = new Date().toISOString().split('T')[0]
  const upcoming = events.filter(e => e.tanggal >= today)
  const past = events.filter(e => e.tanggal < today)

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px' }}>
        <PageHeader title="Event Angkatan" />
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat...</div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2E7D52" style={{ width: '28px', height: '28px' }} strokeWidth={1.8}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
            title="Belum ada event"
            description="Event mendatang akan muncul di sini."
          />
        ) : (
          <>
            {upcoming.length > 0 && (
              <div>
                <p style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '10px' }}>Akan Datang</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {upcoming.map(e => {
                    const days = getDaysUntil(e.tanggal)
                    const d = new Date(e.tanggal)
                    return (
                      <Card key={e.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#EAF6EE', border: '1px solid #D4EDDE', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#2E7D52', fontFamily: 'Space Grotesk, monospace', lineHeight: 1 }}>{d.getDate()}</span>
                          <span style={{ fontSize: '7px', fontWeight: 700, color: '#2E7D52' }}>{d.toLocaleDateString('id-ID', { month: 'short' })}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22' }}>{e.nama_event}</div>
                          {e.lokasi && <div style={{ fontSize: '9px', color: '#A0B0A4' }}>📍 {e.lokasi}</div>}
                          <Pill label="Upcoming" variant="green" className="mt-1" />
                        </div>
                        {days >= 0 && (
                          <span style={{ fontSize: '9px', fontWeight: 700, color: 'white', background: '#2E7D52', padding: '3px 8px', borderRadius: '20px', fontFamily: 'Space Grotesk, monospace', flexShrink: 0 }}>
                            H-{days}
                          </span>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <p style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '10px' }}>Sudah Lewat</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {past.map(e => {
                    const d = new Date(e.tanggal)
                    return (
                      <Card key={e.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', opacity: 0.6 }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#F5F0E8', border: '1px solid #E2D9C8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#5A6E5E', fontFamily: 'Space Grotesk, monospace', lineHeight: 1 }}>{d.getDate()}</span>
                          <span style={{ fontSize: '7px', fontWeight: 700, color: '#5A6E5E' }}>{d.toLocaleDateString('id-ID', { month: 'short' })}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22' }}>{e.nama_event}</div>
                          {e.lokasi && <div style={{ fontSize: '9px', color: '#A0B0A4' }}>📍 {e.lokasi}</div>}
                          <Pill label="Selesai" variant="muted" />
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </main>
  )
}
