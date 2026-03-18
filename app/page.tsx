import { BottomNav } from '@/app/components/ui/BottomNav'
import { SaldoCard } from '@/app/components/ui/SaldoCard'
import { Card } from '@/app/components/ui/Card'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const MOMEN_COLORS = [
  'linear-gradient(135deg, #D4EDDE, #A8C4B0)',
  'linear-gradient(135deg, #C8DDD0, #8FBA9F)',
  'linear-gradient(135deg, #b8d4c0, #7eaa8e)',
  'linear-gradient(135deg, #E2D9C8, #C8DDD0)',
  'linear-gradient(135deg, #D4EDDE, #8FBA9F)',
  'linear-gradient(135deg, #F5F0E8, #C8DDD0)',
]

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(n))
}

function getDaysUntil(dateStr: string): number {
  const today = new Date()
  const target = new Date(dateStr)
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export const revalidate = 60

export default async function HomePage() {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() // 0-indexed

  const [transaksiRes, eventRes, fotoRes, kasChartRes] = await Promise.all([
    supabase.from('transaksi_kas').select('*').order('tanggal', { ascending: false }),
    supabase.from('event').select('*').order('tanggal', { ascending: true }).gte('tanggal', new Date().toISOString().split('T')[0]).limit(1),
    supabase.from('galeri_foto').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('transaksi_kas').select('tanggal, jenis, jumlah').gte('tanggal', `${currentYear}-01-01`).lte('tanggal', `${currentYear}-12-31`),
  ])

  const transaksi = transaksiRes.data || []
  const events = eventRes.data || []
  const fotos = fotoRes.data || []
  const kasChart = kasChartRes.data || []

  // Hitung saldo per bulan (net = masuk - keluar)
  const monthlyNet: number[] = Array(12).fill(0)
  for (const t of kasChart) {
    const m = new Date(t.tanggal).getMonth()
    if (t.jenis === 'pemasukan') monthlyNet[m] += t.jumlah
    else monthlyNet[m] -= t.jumlah
  }

  // Ambil hanya bulan yang relevan (sampai bulan ini)
  const relevantMonths = monthlyNet.slice(0, currentMonth + 1)
  const maxVal = Math.max(...relevantMonths.map(Math.abs), 1)
  const MAX_BAR = 64
  const barHeights = relevantMonths.map(v => Math.max(4, Math.round((Math.abs(v) / maxVal) * MAX_BAR)))
  const barLabels = MONTH_LABELS.slice(0, currentMonth + 1)

  const saldo = transaksi.reduce((acc: number, t: any) => t.jenis === 'pemasukan' ? acc + t.jumlah : acc - t.jumlah, 0)
  const totalMasuk = transaksi.filter((t: any) => t.jenis === 'pemasukan').reduce((acc: number, t: any) => acc + t.jumlah, 0)
  const totalKeluar = transaksi.filter((t: any) => t.jenis === 'pengeluaran').reduce((acc: number, t: any) => acc + t.jumlah, 0)
  const recentTransaksi = transaksi.slice(0, 3)
  const nextEvent = events[0]

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#2E7D52' }}>🌿 Selamat datang</p>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Basyar-14</h1>
            <p style={{ fontSize: '11px', color: '#A0B0A4', fontStyle: 'italic', marginTop: '2px' }}>PP Al-Hamid</p>
          </div>
          <Link href="/iuran" style={{ textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EAF6EE', border: '1px solid #D4EDDE', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Bayar Iuran">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2E7D52" style={{ width: '16px', height: '16px' }} strokeWidth={2}>
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SaldoCard saldo={saldo} masuk={totalMasuk} keluar={totalKeluar} />

        {/* Chart — data real per bulan tahun ini */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4' }}>Kas per Bulan</span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#2E7D52', fontFamily: 'monospace' }}>{currentYear}</span>
          </div>
          {barHeights.length === 0 || barHeights.every(h => h <= 4) ? (
            <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '11px', color: '#A0B0A4' }}>Belum ada transaksi tahun ini</div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '64px' }}>
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}px`,
                      borderRadius: '3px 3px 0 0',
                      background: i === currentMonth ? '#2E7D52' : (monthlyNet[i] < 0 ? '#FFB3A7' : '#E2D9C8'),
                      transition: 'height 0.3s',
                    }}
                    title={`${barLabels[i]}: ${monthlyNet[i] >= 0 ? '+' : ''}${fmt(monthlyNet[i])}`}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {barLabels.map((m, i) => (
                  <span key={m} style={{ flex: 1, textAlign: 'center', fontSize: '7px', fontFamily: 'monospace', color: i === currentMonth ? '#2E7D52' : '#A0B0A4', fontWeight: i === currentMonth ? 700 : 400 }}>{m}</span>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Transaksi */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Transaksi Terakhir</span>
            <Link href="/kas" style={{ fontSize: '10px', fontWeight: 700, color: '#2E7D52', textDecoration: 'none' }}>Lihat semua →</Link>
          </div>
          {recentTransaksi.length === 0 ? (
            <Card><p style={{ fontSize: '12px', color: '#A0B0A4', textAlign: 'center', padding: '16px 0' }}>Belum ada transaksi</p></Card>
          ) : (
            <Card>
              {recentTransaksi.map((t: any, i: number) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < recentTransaksi.length - 1 ? '1px solid #E2D9C8' : 'none' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: t.jenis === 'pemasukan' ? '#EAF7EE' : '#EAF6EE', border: `1px solid ${t.jenis === 'pemasukan' ? '#B8E0C4' : '#D4EDDE'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={t.jenis === 'pemasukan' ? '#1E7B3A' : '#2E7D52'} style={{ width: '14px', height: '14px' }} strokeWidth={2.5}>
                        {t.jenis === 'pemasukan' ? <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></> : <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>}
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>{t.keterangan}</div>
                      <div style={{ fontSize: '9px', color: '#A0B0A4' }}>{new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: t.jenis === 'pemasukan' ? '#1E7B3A' : '#C0392B', fontFamily: 'Space Grotesk, monospace', flexShrink: 0 }}>
                    {t.jenis === 'pemasukan' ? '+' : '-'}{fmt(t.jumlah)}
                  </span>
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* Event */}
        {nextEvent && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Event Terdekat</span>
              <Link href="/event" style={{ fontSize: '10px', fontWeight: 700, color: '#2E7D52', textDecoration: 'none' }}>Lihat semua →</Link>
            </div>
            <Card>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#EAF6EE', border: '1px solid #D4EDDE', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#2E7D52', fontFamily: 'Space Grotesk, monospace', lineHeight: 1 }}>
                    {new Date(nextEvent.tanggal).getDate()}
                  </span>
                  <span style={{ fontSize: '8px', fontWeight: 700, color: '#2E7D52' }}>
                    {new Date(nextEvent.tanggal).toLocaleDateString('id-ID', { month: 'short' })}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22' }}>{nextEvent.nama_event}</div>
                  {nextEvent.lokasi && <div style={{ fontSize: '9px', color: '#A0B0A4' }}>{nextEvent.lokasi}</div>}
                </div>
                {getDaysUntil(nextEvent.tanggal) >= 0 && (
                  <span style={{ fontSize: '9px', fontWeight: 700, color: 'white', background: '#2E7D52', padding: '3px 8px', borderRadius: '20px', fontFamily: 'Space Grotesk, monospace', flexShrink: 0 }}>
                    H-{getDaysUntil(nextEvent.tanggal)}
                  </span>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Momen */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Momen Terbaru</span>
            <Link href="/galeri" style={{ fontSize: '10px', fontWeight: 700, color: '#2E7D52', textDecoration: 'none' }}>Lihat semua →</Link>
          </div>
          {fotos.length === 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4px' }}>
              <div style={{ height: '100px', borderRadius: '12px', background: MOMEN_COLORS[0], position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '9px', fontWeight: 700, color: 'rgba(28,43,34,0.7)' }}>Segera hadir</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ flex: 1, borderRadius: '12px', background: MOMEN_COLORS[1], minHeight: '48px' }} />
                <div style={{ flex: 1, borderRadius: '12px', background: MOMEN_COLORS[2], minHeight: '48px' }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
              {fotos.map((f: any, i: number) => (
                <div key={f.id} style={{ height: '80px', borderRadius: '10px', overflow: 'hidden', background: MOMEN_COLORS[i % MOMEN_COLORS.length] }}>
                  <img src={f.foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
