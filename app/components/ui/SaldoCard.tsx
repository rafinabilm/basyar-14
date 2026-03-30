import Link from 'next/link'

interface SaldoCardProps {
  saldo: number
  masuk: number
  keluar: number
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Math.abs(amount))
}

export function SaldoCard({ saldo, masuk, keluar }: SaldoCardProps) {
  return (
    <div style={{
      borderRadius: '24px',
      background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-30px', left: '10px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ padding: '4px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" style={{ width: '12px', height: '12px' }} strokeWidth={2.5}>
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.5px' }}>
            Saldo Kas Alumni
          </span>
        </div>

        <div style={{ fontSize: '36px', fontWeight: 800, color: 'white', letterSpacing: '-1.5px', lineHeight: 1, fontFamily: 'Space Grotesk, monospace', marginBottom: '12px' }}>
          {formatRupiah(saldo)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" style={{ width: '12px', height: '12px' }} strokeWidth={3}>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
            +{formatRupiah(1200000)} bulan ini ↗
          </span>
        </div>

        <Link href="/iuran" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            padding: '12px',
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" style={{ width: '16px', height: '16px' }} strokeWidth={2.5}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Quick Deposit
          </button>
        </Link>
      </div>
    </div>
  )
}