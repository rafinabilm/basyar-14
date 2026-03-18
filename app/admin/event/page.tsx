'use client'

import { useState } from 'react'
import { Card } from '@/app/components/ui/Card'
import { Pill } from '@/app/components/ui/Pill'
import { PageHeader } from '@/app/components/ui/PageHeader'

const DUMMY_EVENT = [
  { id: '1', nama: 'Buka Puasa Bersama', tanggal: '28 Mar 2025', status: 'upcoming', countdown: 'H-10' },
  { id: '2', nama: 'Lebaran ke Guru', tanggal: '10 Apr 2025', status: 'upcoming', countdown: 'H-23' },
  { id: '3', nama: 'Reuni Kecil 2024', tanggal: '12 Des 2024', status: 'selesai' },
]

export default function AdminEventPage() {
  const [events, setEvents] = useState(DUMMY_EVENT)

  function hapus(id: string) {
    if (confirm('Hapus event ini?')) {
      setEvents(e => e.filter(x => x.id !== id))
    }
  }

  return (
    <main className="pb-32">
      <div className="px-4 pt-5 pb-2 animate-in delay-1">
        <PageHeader
          title="Kelola Event"
          action={
            <button className="text-[10px] font-bold text-white bg-[var(--acc)] px-4 py-2 rounded-full">
              + Event
            </button>
          }
        />
      </div>

      <div className="px-4 flex flex-col gap-3 animate-in delay-2">
        {events.map(e => (
          <Card
            key={e.id}
            className={`flex justify-between items-center ${e.status === 'selesai' ? 'opacity-60' : ''}`}
          >
            <div>
              <div className="text-[12px] font-bold text-[var(--txt)]">{e.nama}</div>
              <div className="text-[9px] text-[var(--mut)]">{e.tanggal}</div>
              <div className="flex gap-1.5 items-center mt-1">
                <Pill label={e.status === 'upcoming' ? 'Upcoming' : 'Selesai'} variant={e.status === 'upcoming' ? 'green' : 'muted'} />
                {e.countdown && (
                  <span className="text-[8px] font-bold text-white bg-[var(--acc)] px-2 py-0.5 rounded-full font-mono-num">
                    {e.countdown}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--mut)" className="w-4 h-4 cursor-pointer" strokeWidth={2}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <button onClick={() => hapus(e.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--err)" className="w-4 h-4" strokeWidth={2}>
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                </svg>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}
