import { BottomNav } from '@/app/components/ui/BottomNav'
import { SaldoCard } from '@/app/components/ui/SaldoCard'
import { Card } from '@/app/components/ui/Card'
import Link from 'next/link'

const TRANSAKSI = [
  { label: 'Konsumsi Bukber', date: '15 Mar', amount: -350000 },
  { label: 'Iuran April', date: '12 Mar', amount: 500000 },
  { label: 'Hadiah Guru', date: '10 Mar', amount: -200000 },
]

const BAR_HEIGHTS = [30, 48, 36, 58, 40, 64, 50]
const BAR_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul']

const MOMEN_COLORS = [
  'linear-gradient(135deg, #D4EDDE, #A8C4B0)',
  'linear-gradient(135deg, #C8DDD0, #8FBA9F)',
  'linear-gradient(135deg, #b8d4c0, #7eaa8e)',
  'linear-gradient(135deg, #E2D9C8, #C8DDD0)',
  'linear-gradient(135deg, #D4EDDE, #8FBA9F)',
  'linear-gradient(135deg, #F5F0E8, #C8DDD0)',
]

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(n))
}

export default function HomePage() {
  return (
    <main style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <div className="animate-in delay-1" style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#2E7D52' }}>
              🌿 Selamat datang
            </p>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              Basyar-14
            </h1>
            <p style={{ fontSize: '11px', color: '#A0B0A4', fontStyle: 'italic', marginTop: '2px' }}>
              PP Al-Hamid
            </p>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EAF6EE', border: '1px solid #D4EDDE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#2E7D52" style={{ width: '16px', height: '16px' }} strokeWidth={2}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Saldo */}
        <div className="animate-in delay-1">
          <SaldoCard saldo={1250000} masuk={3500000} keluar={2250000} />
        </div>

        {/* Chart */}
        <div className="animate-in delay-2">
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4' }}>Kas per Bulan</span>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#2E7D52', fontFamily: 'monospace' }}>2025</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '48px' }}>
              {BAR_HEIGHTS.map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}px`, borderRadius: '3px 3px 0 0', background: i === 5 ? '#2E7D52' : '#E2D9C8' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {BAR_LABELS.map((m, i) => (
                <span key={m} style={{ flex: 1, textAlign: 'center', fontSize: '7px', fontFamily: 'monospace', color: i === 5 ? '#2E7D52' : '#A0B0A4', fontWeight: i === 5 ? 700 : 400 }}>
                  {m}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Transaksi Terakhir */}
        <div className="animate-in delay-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Transaksi Terakhir</span>
            <Link href="/kas" style={{ fontSize: '10px', fontWeight: 700, color: '#2E7D52', textDecoration: 'none' }}>Lihat semua →</Link>
          </div>
          <Card>
            {TRANSAKSI.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid #E2D9C8' : 'none' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: t.amount > 0 ? '#EAF7EE' : '#EAF6EE', border: `1px solid ${t.amount > 0 ? '#B8E0C4' : '#D4EDDE'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={t.amount > 0 ? '#1E7B3A' : '#2E7D52'} style={{ width: '14px', height: '14px' }} strokeWidth={2.5}>
                      {t.amount > 0
                        ? <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>
                        : <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>
                      }
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>{t.label}</div>
                    <div style={{ fontSize: '9px', color: '#A0B0A4' }}>{t.date}</div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: t.amount > 0 ? '#1E7B3A' : '#C0392B', fontFamily: 'Space Grotesk, monospace', flexShrink: 0 }}>
                  {t.amount > 0 ? '+' : '-'}{formatRupiah(t.amount)}
                </span>
              </div>
            ))}
          </Card>
        </div>

        {/* Event Terdekat */}
        <div className="animate-in delay-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Event Terdekat</span>
            <Link href="/event" style={{ fontSize: '10px', fontWeight: 700, color: '#2E7D52', textDecoration: 'none' }}>Lihat semua →</Link>
          </div>
          <Card>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#EAF6EE', border: '1px solid #D4EDDE', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#2E7D52', fontFamily: 'Space Grotesk, monospace', lineHeight: 1 }}>28</span>
                <span style={{ fontSize: '8px', fontWeight: 700, color: '#2E7D52' }}>Mar</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22' }}>Buka Puasa Bersama</div>
                <div style={{ fontSize: '9px', color: '#A0B0A4' }}>Restoran Padang Jaya</div>
              </div>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'white', background: '#2E7D52', padding: '3px 8px', borderRadius: '20px', fontFamily: 'Space Grotesk, monospace', flexShrink: 0 }}>
                H-10
              </span>
            </div>
          </Card>
        </div>

        {/* Momen Terbaru */}
        <div className="animate-in delay-5">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Momen Terbaru</span>
            <Link href="/galeri" style={{ fontSize: '10px', fontWeight: 700, color: '#2E7D52', textDecoration: 'none' }}>Lihat semua →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4px' }}>
            <div style={{ height: '100px', borderRadius: '12px', background: MOMEN_COLORS[0], position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '9px', fontWeight: 700, color: 'rgba(28,43,34,0.7)' }}>Bukber 2025</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ flex: 1, borderRadius: '12px', background: MOMEN_COLORS[1], minHeight: '48px' }} />
              <div style={{ flex: 1, borderRadius: '12px', background: MOMEN_COLORS[2], minHeight: '48px' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginTop: '4px' }}>
            {MOMEN_COLORS.slice(3).map((c, i) => (
              <div key={i} style={{ height: '72px', borderRadius: '12px', background: c }} />
            ))}
          </div>
        </div>

      </div>
      <BottomNav />
    </main>
  )
}
