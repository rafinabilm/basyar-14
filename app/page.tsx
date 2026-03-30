import { BottomNav } from '@/app/components/ui/BottomNav'
import { SaldoCard } from '@/app/components/ui/SaldoCard'
import { StatCard } from '@/app/components/ui/StatCard'
import { Card } from '@/app/components/ui/Card'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(n))
}

function fmtShort(n: number) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`
  if (n >= 1000) return `Rp ${(n / 1000).toFixed(0)}rb`
  return `Rp ${n}`
}

export const revalidate = 60

export default async function HomePage() {
  const now = new Date()
  const currentPeriod = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  const monthPrefix = now.toISOString().substring(0, 7) // format "YYYY-MM"

  const [transaksiRes, fotoCountRes, fotoRes, anggotaRes, latestEventsRes] = await Promise.all([
    supabase.from('transaksi_kas').select('*').order('tanggal', { ascending: false }),
    supabase.from('galeri_foto').select('id', { count: 'exact', head: true }),
    supabase.from('galeri_foto').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('anggota').select('id', { count: 'exact' }),
    supabase.from('event').select('*').order('tanggal', { ascending: false }).limit(3)
  ])

  // Filter archived in JS as source of truth
  const transaksi = (transaksiRes.data || []).filter((t: any) => t.status !== 'archived')
  
  const totalFoto = fotoCountRes.count || 0
  const fotos = fotoRes.data || []
  const totalAnggota = anggotaRes.count || 0
  const latestEvents = latestEventsRes.data || []

  // Main balance logic
  const saldo = transaksi.reduce((acc: number, t: any) => t.jenis === 'pemasukan' ? acc + t.jumlah : acc - t.jumlah, 0)
  const totalMasuk = transaksi.filter((t: any) => t.jenis === 'pemasukan').reduce((acc: number, t: any) => acc + t.jumlah, 0)
  const totalKeluar = transaksi.filter((t: any) => t.jenis === 'pengeluaran').reduce((acc: number, t: any) => acc + t.jumlah, 0)
  
  // Monthly stats derived from the same source of truth (transaksi)
  // Use .startsWith to handle both "YYYY-MM-DD" and "YYYY-MM-DD HH:mm:ss"
  const monthData = transaksi.filter((t: any) => t.tanggal && t.tanggal.startsWith(monthPrefix))
  
  const monthMasuk = monthData.filter((t: any) => t.jenis === 'pemasukan').reduce((acc: number, t: any) => acc + t.jumlah, 0)
  const monthKeluar = monthData.filter((t: any) => t.jenis === 'pengeluaran').reduce((acc: number, t: any) => acc + t.jumlah, 0)

  const recentTransaksi = transaksi.slice(0, 5)

  const PLACEHOLDER_COLORS = ['#6366F1', '#4F46E5', '#818CF8']

  return (
    <main style={{ paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ padding: '32px 20px 24px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#111827', letterSpacing: '-1.5px', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>Basyar-14</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '6px', fontWeight: 600, letterSpacing: '-0.2px' }}>Angkatan 14 PP Al-Hamid</p>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Main Card */}
        <SaldoCard saldo={saldo} masuk={totalMasuk} keluar={totalKeluar} monthlyIncome={monthMasuk} period={currentPeriod} />

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <StatCard 
            label="Total Anggota" 
            value={totalAnggota} 
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
          />
          <StatCard 
            label="Total Galeri" 
            value={totalFoto} 
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>}
            iconBg="#F5F3FF"
          />
          <StatCard 
            label="Pemasukan" 
            value={fmtShort(monthMasuk)} 
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
            iconBg="#ECFDF5"
          />
          <StatCard 
            label="Pengeluaran" 
            value={fmtShort(monthKeluar)} 
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
            iconBg="#FFF1F2"
          />
        </div>

        {/* Transaksi Terakhir */}
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
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < recentTransaksi.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
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
                    <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>{t.jenis === 'pemasukan' ? 'In' : 'Out'}</div>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>

        {/* Gallery Grid (Dinamis per Event) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Momen Terkini</h2>
            <Link href="/galeri" style={{ fontSize: '13px', fontWeight: 700, color: '#6366F1', textDecoration: 'none' }}>Lihat Galeri</Link>
          </div>
          {latestEvents.length === 0 ? (
             <div style={{ height: '160px', borderRadius: '20px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '13px' }}>
               Belum ada momen dibagikan
             </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {latestEvents.map((event: any, i: number) => (
                <Link key={event.id} href={`/galeri/${event.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ height: '160px', borderRadius: '20px', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '100%', height: '100%', background: event.foto_cover_url ? undefined : PLACEHOLDER_COLORS[i % 3] }}>
                      {event.foto_cover_url && <img src={event.foto_cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(to top, rgba(17,24,39,0.8), transparent)' }}>
                       <div style={{ color: 'white', fontSize: '14px', fontWeight: 800 }}>{event.nama_event}</div>
                       <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 600 }}>{new Date(event.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
