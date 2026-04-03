'use client'

import { useMemo } from 'react'
import { SaldoCard } from '@/app/components/ui/SaldoCard'
import { StatCard } from '@/app/components/ui/StatCard'
import { Card } from '@/app/components/ui/Card'
import Link from 'next/link'
import { useKas } from '@/app/hooks/useKas'
import { useEvents } from '@/app/hooks/useGaleri'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(n))
}

function fmtShort(n: number) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`
  if (n >= 1000) return `Rp ${(n / 1000).toFixed(0)}rb`
  return `Rp ${n}`
}
// Client-side HomePage using `useKas` to avoid PWA/ServiceWorker HTML caching
export default function HomePage() {
  const now = new Date()
  const currentPeriod = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  const monthPrefix = now.toISOString().substring(0, 7)

  const { transaksi, saldo, totalMasuk, totalKeluar, loading } = useKas()
  const { events: latestEvents = [], loading: eventsLoading } = useEvents()

  const totalFoto = 0 // kept for layout parity; galeri count not critical here
  const totalAnggota = 0

  const PLACEHOLDER_COLORS = ['#6366F1', '#4F46E5', '#818CF8']

  const monthMasuk = useMemo(() => {
    if (!transaksi) return 0
    return transaksi
      .filter((t: any) => t.tanggal && t.tanggal.startsWith(monthPrefix) && t.jenis === 'pemasukan')
      .reduce((acc: number, t: any) => acc + t.jumlah, 0)
  }, [transaksi, monthPrefix])

  const recentTransaksi = (transaksi || []).slice(0, 5)

  function getOptimizedCoverUrl(url: string) {
    if (!url) return ''
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/w_500,c_scale,q_auto/')
    }
    return url
  }

  // Skeleton component (same visual footprint as dashboard to prevent CLS)
  function DashboardSkeleton() {
    return (
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ height: '160px', borderRadius: '24px', background: '#E5E7EB' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ height: '80px', borderRadius: '12px', background: '#E5E7EB' }} />
          <div style={{ height: '80px', borderRadius: '12px', background: '#E5E7EB' }} />
          <div style={{ height: '80px', borderRadius: '12px', background: '#E5E7EB' }} />
          <div style={{ height: '80px', borderRadius: '12px', background: '#E5E7EB' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ height: '80px', borderRadius: '16px', background: '#E5E7EB' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 24px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#111827', letterSpacing: '-1.5px', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>Basyar-14</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '6px', fontWeight: 600, letterSpacing: '-0.2px' }}>Angkatan 14 PP Al-Hamid</p>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {(loading || eventsLoading) ? (
          <DashboardSkeleton />
        ) : (
          <>
            <SaldoCard saldo={saldo} masuk={totalMasuk} keluar={totalKeluar} monthlyIncome={monthMasuk} period={currentPeriod} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <StatCard label="Total Anggota" value={totalAnggota} icon={<UserIcon />} />
              <StatCard label="Total Galeri" value={totalFoto} icon={<GalleryIcon />} iconBg="#F5F3FF" />
              <StatCard label="Pemasukan Total" value={fmtShort(totalMasuk)} icon={<IncomeIcon />} iconBg="#ECFDF5" />
              <StatCard label="Pengeluaran Total" value={fmtShort(totalKeluar)} icon={<OutcomeIcon />} iconBg="#FFF1F2" />
            </div>

            {/* Riwayat Kas */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Riwayat Kas</h2>
                <Link href="/kas" style={{ fontSize: '13px', fontWeight: 700, color: '#6366F1', textDecoration: 'none' }}>Lihat Semua</Link>
              </div>
              <Card style={{ padding: '8px 16px', border: '1px solid #F3F4F6' }}>
                {recentTransaksi.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#9CA3AF', textAlign: 'center', padding: '24px 0' }}>Belum ada transaksi</p>
                ) : (
                  recentTransaksi.map((t: any, i: number) => (
                    <TransactionRow key={t.id} t={t} isLast={i === recentTransaksi.length - 1} />
                  ))
                )}
              </Card>
            </div>

            {/* Gallery Grid */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Momen Terkini</h2>
                <Link href="/galeri" style={{ fontSize: '13px', fontWeight: 700, color: '#6366F1', textDecoration: 'none' }}>Lihat Galeri</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {latestEvents.map((event: any, i: number) => (
                  <Link key={event.id} href={`/galeri/${event.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ height: '160px', borderRadius: '20px', overflow: 'hidden', position: 'relative', background: PLACEHOLDER_COLORS[i % 3] }}>
                      {event.foto_cover_url && (
                        <img
                          src={getOptimizedCoverUrl(event.foto_cover_url)}
                          alt={event.nama_event}
                          loading={i === 0 ? "eager" : "lazy"} // [MARK: Gambar pertama di-load cepat, sisanya ditunda]
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(to top, rgba(17,24,39,0.8), transparent)' }}>
                        <div style={{ color: 'white', fontSize: '14px', fontWeight: 800 }}>{event.nama_event}</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 600 }}>{new Date(event.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function TransactionRow({ t, isLast }: { t: any, isLast: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: isLast ? 'none' : '1px solid #F3F4F6' }}>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: t.jenis === 'pemasukan' ? '#ECFDF5' : '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={t.jenis === 'pemasukan' ? '#10B981' : '#EF4444'} style={{ width: '18px', height: '18px' }} strokeWidth={2.5}>
            {t.jenis === 'pemasukan' ? <path d="M7 10l5 5 5-5" /> : <path d="M17 14l-5-5-5 5" />}
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{t.keterangan}</div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '14px', fontWeight: 800, color: t.jenis === 'pemasukan' ? '#10B981' : '#EF4444', fontFamily: 'Space Grotesk, monospace' }}>
          {t.jenis === 'pemasukan' ? '+' : '-'}{fmt(t.jumlah).replace('Rp', '').trim()}
        </div>
      </div>
    </div>
  )
}

const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
const GalleryIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
const IncomeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
const OutcomeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>