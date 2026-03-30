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

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat jadwal...</div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '32px', height: '32px' }} strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
            title="Belum ada event"
            description="Jadwal kegiatan angkatan akan muncul di sini."
          />
        ) : (
          <>
            {upcoming.length > 0 && (
              <div>
                <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF' }}>Mendatang</p>
                  <div style={{ width: '40px', height: '1px', background: '#F3F4F6' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {upcoming.map((e, i) => {
                    const days = getDaysUntil(e.tanggal)
                    const d = new Date(e.tanggal)
                    return (
                      <Card key={e.id} style={{ animationDelay: `${i * 0.1}s`, display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#EEF2FF', border: '1px solid #E0E7FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#6366F1', fontFamily: 'Space Grotesk, monospace', lineHeight: 1 }}>{d.getDate()}</span>
                          <span style={{ fontSize: '9px', fontWeight: 800, color: '#6366F1', textTransform: 'uppercase' }}>{d.toLocaleDateString('id-ID', { month: 'short' })}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>{e.nama_event}</div>
                          {e.lokasi && <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '12px', height: '12px' }} strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                             {e.lokasi}
                          </div>}
                          <Pill label="Upcoming" variant="green" styleOverride={{ marginTop: '8px' }} />
                        </div>
                        {days >= 0 && (
                          <div style={{ textAlign: 'right' }}>
                             <div style={{ fontSize: '12px', fontWeight: 800, color: 'white', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', padding: '4px 10px', borderRadius: '10px', fontFamily: 'Space Grotesk, monospace' }}>
                              H-{days}
                             </div>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '12px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF' }}>Telah Lewat</p>
                  <div style={{ width: '40px', height: '1px', background: '#F3F4F6' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {past.map((e, i) => {
                    const d = new Date(e.tanggal)
                    return (
                      <Card key={e.id} style={{ animationDelay: `${i * 0.05}s`, display: 'flex', gap: '16px', alignItems: 'center', opacity: 0.7 }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#F9FAFB', border: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#6B7280', fontFamily: 'Space Grotesk, monospace', lineHeight: 1 }}>{d.getDate()}</span>
                          <span style={{ fontSize: '9px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>{d.toLocaleDateString('id-ID', { month: 'short' })}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#4B5563' }}>{e.nama_event}</div>
                          {e.lokasi && <div style={{ fontSize: '12px', color: '#9CA3AF' }}>📍 {e.lokasi}</div>}
                          <Pill label="Selesai" variant="muted" styleOverride={{ marginTop: '8px' }} />
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
