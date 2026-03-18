'use client'

const COLORS = [
  'linear-gradient(135deg, #D4EDDE, #A8C4B0)',
  'linear-gradient(135deg, #C8DDD0, #8FBA9F)',
  'linear-gradient(135deg, #b8d4c0, #7eaa8e)',
  'linear-gradient(135deg, #E2D9C8, #C8DDD0)',
]

export default function AdminGaleriPage() {
  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.5px' }}>Kelola Galeri</h1>
        <button style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
          + Upload
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Upload Area */}
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100px', border: '2px dashed #E2D9C8', borderRadius: '16px', background: '#FBF8F3', cursor: 'pointer' }}>
          <input type="file" multiple accept="image/*" style={{ display: 'none' }} />
          <svg viewBox="0 0 24 24" fill="none" stroke="#2E7D52" style={{ width: '28px', height: '28px', marginBottom: '8px' }} strokeWidth={1.8}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#2E7D52' }}>Upload Foto Baru</span>
          <span style={{ fontSize: '10px', color: '#A0B0A4', marginTop: '2px' }}>JPG, PNG maks. 5MB per foto</span>
        </label>

        {/* Album */}
        <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '14px', border: '1px solid #E2D9C8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22' }}>Bukber Ramadan 2025</span>
            <span style={{ fontSize: '10px', color: '#A0B0A4' }}>4 foto</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '4px' }}>
            {COLORS.map((color, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ height: '52px', borderRadius: '8px', background: color }} />
                <button style={{ position: 'absolute', top: '3px', right: '3px', width: '16px', height: '16px', background: 'rgba(192,57,43,0.85)', borderRadius: '50%', border: 'none', color: 'white', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
