import { BottomNav } from '@/app/components/ui/BottomNav'
import { SaldoCard } from '@/app/components/ui/SaldoCard'
import { StatCard } from '@/app/components/ui/StatCard'
import { Card } from '@/app/components/ui/Card'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [transaksiRes, eventRes, fotoRes, anggotaRes, currentMonthRes] = await Promise.all([
    supabase.from('transaksi_kas').select('*').order('tanggal', { ascending: false }),
    supabase.from('event').select('*', { count: 'exact' }).order('tanggal', { ascending: true }).gte('tanggal', new Date().toISOString().split('T')[0]),
    supabase.from('galeri_foto').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('anggota').select('id', { count: 'exact' }),
    supabase.from('transaksi_kas').select('jenis, jumlah').gte('tanggal', firstDayOfMonth)
  ])

  const transaksi = transaksiRes.data || []
  const events = eventRes.data || []
  const eventCount = eventRes.count || 0
  const fotos = fotoRes.data || []
  const totalAnggota = anggotaRes.count || 0
  const currentMonthData = currentMonthRes.data || []

  const saldo = transaksi.reduce((acc: number, t: any) => t.jenis === 'pemasukan' ? acc + t.jumlah : acc - t.jumlah, 0)
  const totalMasuk = transaksi.filter((t: any) => t.jenis === 'pemasukan').reduce((acc: number, t: any) => acc + t.jumlah, 0)
  const totalKeluar = transaksi.filter((t: any) => t.jenis === 'pengeluaran').reduce((acc: number, t: any) => acc + t.jumlah, 0)
  
  const monthMasuk = currentMonthData.filter((t: any) => t.jenis === 'pemasukan').reduce((acc: number, t: any) => acc + t.jumlah, 0)
  const monthKeluar = currentMonthData.filter((t: any) => t.jenis === 'pengeluaran').reduce((acc: number, t: any) => acc + t.jumlah, 0)

  const recentTransaksi = transaksi.slice(0, 5)

  return (
    <main style={{ paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ padding: '32px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-1px', lineHeight: 1 }}>Dashboard</h1>
            <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px', fontWeight: 500 }}>Selamat datang kembali, Ahmad 👋</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
               <svg viewBox="0 0 24 24" fill="none" stroke="#4B5563" style={{ width: '20px', height: '20px' }} strokeWidth={2}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <div style={{ position: 'absolute', top: '10px', right: '11px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', border: '2px solid #FFFFFF' }} />
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#EEF2FF', border: '1px solid #E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: '#6366F1' }}>
              AR
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Main Card */}
        <SaldoCard saldo={saldo} masuk={totalMasuk} keluar={totalKeluar} />

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <StatCard 
            label="Total Anggota" 
            value={totalAnggota} 
            subValue="+2 baru bulan ini"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
          />
          <StatCard 
            label="Kegiatan Terdekat" 
            value={eventCount} 
            subValue="1 mendatang"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
            iconBg="#F5F3FF"
          />
          <StatCard 
            label="Pemasukan" 
            value={fmtShort(monthMasuk)} 
            subValue="+12% dari bulan lalu"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
            iconBg="#ECFDF5"
          />
          <StatCard 
            label="Pengeluaran" 
            value={fmtShort(monthKeluar)} 
            subValue="Sesuai anggaran"
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

        {/* Gallery Grid (Dynamic Masonry-ish) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Kegiatan Terbaru</h2>
            <Link href="/galeri" style={{ fontSize: '13px', fontWeight: 700, color: '#6366F1', textDecoration: 'none' }}>Lihat Semua</Link>
          </div>
          {fotos.length === 0 ? (
             <div style={{ height: '160px', borderRadius: '20px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '13px' }}>
               Belum ada momen dibagikan
             </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ height: '200px', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
                  <img src={fotos[0].foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
                     <div style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>Reuni Akbar 2026</div>
                     <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>15 Mar 2026</div>
                  </div>
                </div>
                {fotos[2] && (
                  <div style={{ height: '140px', borderRadius: '20px', overflow: 'hidden' }}>
                    <img src={fotos[2].foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fotos[1] && (
                   <div style={{ height: '140px', borderRadius: '20px', overflow: 'hidden' }}>
                    <img src={fotos[1].foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                {fotos[3] && (
                   <div style={{ height: '100px', borderRadius: '20px', overflow: 'hidden' }}>
                    <img src={fotos[3].foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                 {fotos[4] && (
                   <div style={{ height: '100px', borderRadius: '20px', overflow: 'hidden' }}>
                    <img src={fotos[4].foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
