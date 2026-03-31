'use client'

import Link from 'next/link'
import { Card } from '@/app/components/ui/Card'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { useEvents } from '@/app/hooks/useGaleri'

export default function EventPage() {
  const { events, loading } = useEvents()

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px' }}>
        <PageHeader title="Agenda & Event" subtitle="Kegiatan angkata Basyar-14." />
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat agenda...</div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '32px', height: '32px' }} strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
            title="Belum ada agenda"
            description="Agenda dan kegiatan baru akan muncul di sini."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map((event, i) => (
              <Link key={event.id} href={`/galeri/${event.id}`} style={{ textDecoration: 'none' }} className="animate-in">
                <Card style={{ 
                  animationDelay: `${i * 0.05}s`,
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px',
                  border: '1px solid #F3F4F6'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ background: '#EEF2FF', color: '#6366F1', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                      {new Date(event.tanggal).toLocaleDateString('id-ID', { month: 'short' })} {new Date(event.tanggal).getFullYear()}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#111827', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {new Date(event.tanggal).getDate()}
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{event.nama_event}</h3>
                    <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>Lihat dokumentasi dan detail kegiatan ini di galeri.</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6366F1', fontSize: '13px', fontWeight: 700 }}>
                    Lihat Detail 
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px' }} strokeWidth={3}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
