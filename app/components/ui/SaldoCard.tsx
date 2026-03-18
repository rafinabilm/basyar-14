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
  }).format(amount)
}

export function SaldoCard({ saldo, masuk, keluar }: SaldoCardProps) {
  return (
    <div style={{
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #1a5c3a 0%, #2E7D52 55%, #3a9465 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '130px', height: '130px', background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-20px', left: '10px', width: '90px', height: '90px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', fontFamily: 'monospace', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Total Saldo Kas
        </div>
        <div style={{ fontSize: '32px', fontWeight: 700, color: 'white', letterSpacing: '-1.5px', lineHeight: 1, fontFamily: 'Space Grotesk, monospace', marginBottom: '16px' }}>
          {formatRupiah(saldo)}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '14px' }} />

        {/* Masuk & Keluar */}
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Masuk
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#7FEBA1', fontFamily: 'Space Grotesk, monospace' }}>
              {formatRupiah(masuk)}
            </div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 16px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Keluar
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFB3A7', fontFamily: 'Space Grotesk, monospace' }}>
              {formatRupiah(keluar)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}