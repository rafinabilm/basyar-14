import Link from 'next/link'

const STATS = [
  { label: 'Total Anggota', value: '47', unit: 'orang', progress: null },
  { label: 'Saldo Kas', value: '1,25jt', unit: 'rupiah', progress: null },
  { label: 'Lunas Iuran', value: '32', unit: '/47', progress: 68 },
  { label: 'Event Aktif', value: '2', unit: 'upcoming', progress: null },
]

const QUICK_ACTIONS = [
  { label: 'Tambah Transaksi', href: '/admin/kas', icon: '+' },
  { label: 'Verifikasi Iuran', href: '/admin/iuran', icon: '✓' },
  { label: 'Upload Foto', href: '/admin/galeri', icon: '📸' },
  { label: 'Buat Event', href: '/admin/event', icon: '📅' },
]

export default function AdminDashboardPage() {
  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#2E7D52' }}>Admin Panel</p>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Dashboard</h1>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#C0392B', background: '#FEE2E2', padding: '4px 10px', borderRadius: '20px' }}>3 perlu aksi</span>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Alert */}
        <Link href="/admin/iuran" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#FFFBEB', border: '1px solid #E5C04A', borderRadius: '14px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#B8860B' }}>⏳ 3 Pembayaran Menunggu Verifikasi</div>
              <div style={{ fontSize: '10px', color: '#5A6E5E', marginTop: '2px' }}>Tap untuk review →</div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="#B8860B" style={{ width: '16px', height: '16px', flexShrink: 0 }} strokeWidth={2}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </Link>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: '#FFFFFF', borderRadius: '14px', padding: '14px', border: '1px solid #E2D9C8' }}>
              <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#2E7D52', fontFamily: 'Space Grotesk, monospace', marginTop: '4px', letterSpacing: '-0.5px', lineHeight: 1 }}>
                {s.value}
                <span style={{ fontSize: '11px', color: '#A0B0A4', fontFamily: 'Nunito, sans-serif', marginLeft: '3px' }}>{s.unit}</span>
              </div>
              {s.progress && (
                <div style={{ height: '4px', background: '#E2D9C8', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.progress}%`, background: '#2E7D52', borderRadius: '2px' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <p style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '10px' }}>Quick Action</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '14px', border: '1px solid #E2D9C8', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#EAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                    {a.icon}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1C2B22' }}>{a.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
