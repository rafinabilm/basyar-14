import Link from 'next/link'
import { Card } from '@/app/components/ui/Card'

const STATS = [
  { label: 'Total Anggota', value: '47', unit: 'orang' },
  { label: 'Saldo Kas', value: '1,25jt', unit: 'rupiah' },
  { label: 'Lunas Iuran', value: '32', unit: '/47', progress: 68 },
  { label: 'Event Aktif', value: '2', unit: 'upcoming' },
]

const QUICK_ACTIONS = [
  { label: 'Tambah Transaksi', href: '/admin/kas', icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: 'Verifikasi Iuran', href: '/admin/iuran', icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg> },
  { label: 'Upload Foto', href: '/admin/galeri', icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { label: 'Buat Event', href: '/admin/event', icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
]

export default function AdminDashboardPage() {
  return (
    <main className="pb-32">
      <div className="px-4 pt-5 pb-2 animate-in delay-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[9px] font-mono tracking-widest uppercase text-[var(--acc)]">Admin Panel</p>
            <h1 className="text-[22px] font-extrabold text-[var(--txt)] tracking-tight">Dashboard</h1>
          </div>
          <span className="text-[10px] font-bold text-[var(--err)] bg-[#FEE2E2] px-2.5 py-1 rounded-full">
            3 perlu aksi
          </span>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Alert */}
        <Link href="/admin/iuran" className="animate-in delay-1">
          <div className="bg-[#FFFBEB] border border-[#E5C04A] rounded-xl px-4 py-3 flex justify-between items-center">
            <div>
              <div className="text-[11px] font-bold text-[var(--warn)]">⏳ 3 Pembayaran Menunggu Verifikasi</div>
              <div className="text-[10px] text-[var(--sec)] mt-0.5">Tap untuk review →</div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--warn)" className="w-4 h-4" strokeWidth={2}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 animate-in delay-2">
          {STATS.map((s) => (
            <Card key={s.label}>
              <div className="text-[9px] font-mono tracking-widest uppercase text-[var(--mut)]">{s.label}</div>
              <div className="text-[20px] font-bold text-[var(--acc)] font-mono-num mt-1 tracking-tight leading-none">
                {s.value}
                {s.unit && <span className="text-[11px] text-[var(--mut)] ml-1 font-sans">{s.unit}</span>}
              </div>
              {s.progress && (
                <div className="h-1.5 bg-[var(--bord)] rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-[var(--acc)] rounded-full" style={{ width: `${s.progress}%` }} />
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="animate-in delay-3">
          <p className="text-[9px] font-mono tracking-widest uppercase text-[var(--mut)] mb-2">Quick Action</p>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.href} href={a.href}>
                <Card className="flex items-center gap-2 cursor-pointer hover:border-[var(--acc)] transition-colors">
                  <span style={{ color: 'var(--acc)' }}>{a.icon}</span>
                  <span className="text-[10px] font-bold text-[var(--txt)]">{a.label}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
