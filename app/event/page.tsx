import { BottomNav } from '@/app/components/ui/BottomNav'
import { Card } from '@/app/components/ui/Card'
import { Pill } from '@/app/components/ui/Pill'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { PageHeader } from '@/app/components/ui/PageHeader'

const UPCOMING = [
  { id: '1', nama: 'Buka Puasa Bersama', tanggal: '28', bulan: 'Mar', tahun: '2025', lokasi: 'Bandung', countdown: 'H-10' },
  { id: '2', nama: 'Lebaran ke Guru', tanggal: '10', bulan: 'Apr', tahun: '2025', lokasi: 'Cimahi', countdown: 'H-23' },
]

const SELESAI = [
  { id: '3', nama: 'Reuni Kecil 2024', tanggal: '12', bulan: 'Des', tahun: '2024', lokasi: 'Jakarta' },
  { id: '4', nama: 'Bukber Ramadan 2024', tanggal: '15', bulan: 'Mar', tahun: '2024', lokasi: 'Bandung' },
]

export default function EventPage() {
  return (
    <main className="pb-32">
      <div className="px-4 pt-5 pb-2 animate-in delay-1">
        <PageHeader title="Event Angkatan" />
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Upcoming */}
        <div className="animate-in delay-2">
          <p className="text-[9px] font-mono tracking-widest uppercase text-[var(--mut)] mb-2">
            Akan Datang
          </p>
          {UPCOMING.length === 0 ? (
            <EmptyState
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--acc)" className="w-7 h-7" strokeWidth={1.8}>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
              title="Belum ada event"
              description="Event mendatang akan muncul di sini."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {UPCOMING.map(e => (
                <Card key={e.id} className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl bg-[var(--acsl)] border border-[var(--acs)] flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[15px] font-bold font-mono-num text-[var(--acc)]">{e.tanggal}</span>
                    <span className="text-[7px] font-bold text-[var(--acc)]">{e.bulan}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] font-bold text-[var(--txt)]">{e.nama}</div>
                    <div className="text-[9px] text-[var(--mut)]">📍 {e.lokasi}</div>
                    <Pill label="Upcoming" variant="green" className="mt-1" />
                  </div>
                  <span className="text-[9px] font-bold text-white bg-[var(--acc)] px-2 py-0.5 rounded-full font-mono-num flex-shrink-0">
                    {e.countdown}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Selesai */}
        <div className="animate-in delay-3">
          <p className="text-[9px] font-mono tracking-widest uppercase text-[var(--mut)] mb-2">
            Sudah Lewat
          </p>
          <div className="flex flex-col gap-3">
            {SELESAI.map(e => (
              <Card key={e.id} className="flex gap-3 items-center opacity-60">
                <div className="w-12 h-12 rounded-xl bg-[var(--surf)] border border-[var(--bord)] flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[15px] font-bold font-mono-num text-[var(--sec)]">{e.tanggal}</span>
                  <span className="text-[7px] font-bold text-[var(--sec)]">{e.bulan}</span>
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-bold text-[var(--txt)]">{e.nama}</div>
                  <div className="text-[9px] text-[var(--mut)]">📍 {e.lokasi}</div>
                  <Pill label="Selesai" variant="muted" className="mt-1" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
