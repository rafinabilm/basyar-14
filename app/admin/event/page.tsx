'use client'

import { useState } from 'react'

const DUMMY = [
  { id: '1', nama: 'Buka Puasa Bersama', tanggal: '28', bulan: 'Mar', tahun: '2025', status: 'upcoming', countdown: 'H-10' },
  { id: '2', nama: 'Lebaran ke Guru', tanggal: '10', bulan: 'Apr', tahun: '2025', status: 'upcoming', countdown: 'H-23' },
  { id: '3', nama: 'Reuni Kecil 2024', tanggal: '12', bulan: 'Des', tahun: '2024', status: 'selesai' },
]

export default function AdminEventPage() {
  const [events, setEvents] = useState(DUMMY)

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.5px' }}>Kelola Event</h1>
        <button style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
          + Event
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {events.map(e => (
          <div key={e.id} style={{ background: '#FFFFFF', borderRadius: '14px', padding: '14px', border: '1px solid #E2D9C8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: e.status === 'selesai' ? 0.6 : 1 }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: e.status === 'upcoming' ? '#EAF6EE' : '#F5F0E8', border: `1px solid ${e.status === 'upcoming' ? '#D4EDDE' : '#E2D9C8'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: e.status === 'upcoming' ? '#2E7D52' : '#5A6E5E', fontFamily: 'Space Grotesk, monospace', lineHeight: 1 }}>{e.tanggal}</span>
                <span style={{ fontSize: '8px', fontWeight: 700, color: e.status === 'upcoming' ? '#2E7D52' : '#5A6E5E' }}>{e.bulan}</span>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22' }}>{e.nama}</div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: e.status === 'upcoming' ? '#EAF7EE' : '#F5F0E8', color: e.status === 'upcoming' ? '#1E7B3A' : '#5A6E5E' }}>
                    {e.status === 'upcoming' ? 'Upcoming' : 'Selesai'}
                  </span>
                  {'countdown' in e && e.countdown && (
                    <span style={{ fontSize: '9px', fontWeight: 700, color: 'white', background: '#2E7D52', padding: '2px 8px', borderRadius: '20px', fontFamily: 'Space Grotesk, monospace' }}>
                      {e.countdown}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#A0B0A4" style={{ width: '16px', height: '16px', cursor: 'pointer' }} strokeWidth={2}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <button onClick={() => setEvents(ev => ev.filter(x => x.id !== e.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#C0392B" style={{ width: '16px', height: '16px' }} strokeWidth={2}>
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
