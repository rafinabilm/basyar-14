'use client'

import { useState } from 'react'

const DUMMY = [
  { id: '1', label: 'Konsumsi Bukber', by: 'Admin1', tanggal: '15 Mar', jumlah: -350000 },
  { id: '2', label: 'Iuran April', by: 'Bendahara', tanggal: '12 Mar', jumlah: 500000 },
  { id: '3', label: 'Hadiah Guru', by: 'Admin1', tanggal: '10 Mar', jumlah: -200000 },
]

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(n))
}

export default function AdminKasPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.5px' }}>Kelola Kas</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
          + Tambah
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Saldo Card */}
        <div style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #1a5c3a 0%, #2E7D52 55%, #3a9465 100%)', padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Saldo Kas</div>
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, monospace', letterSpacing: '-1px', marginBottom: '14px' }}>Rp 1.250.000</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '12px' }} />
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', textTransform: 'uppercase' }}>Masuk</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#7FEBA1', fontFamily: 'Space Grotesk, monospace', marginTop: '2px' }}>Rp 3.500.000</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 14px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', textTransform: 'uppercase' }}>Keluar</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFB3A7', fontFamily: 'Space Grotesk, monospace', marginTop: '2px' }}>Rp 2.250.000</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '16px', border: '1px solid #E2D9C8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Tambah Transaksi</div>
            {['Jenis', 'Jumlah (Rp)', 'Keterangan', 'Kategori'].map((label, i) => (
              <div key={label}>
                <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '4px' }}>{label}</div>
                {i === 0 ? (
                  <select style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif' }}>
                    <option>Pemasukan</option><option>Pengeluaran</option>
                  </select>
                ) : i === 3 ? (
                  <select style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif' }}>
                    <option>Iuran</option><option>Konsumsi</option><option>Hadiah Guru</option><option>Transportasi</option><option>Lainnya</option>
                  </select>
                ) : (
                  <input type={i === 1 ? 'number' : 'text'} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
                )}
              </div>
            ))}
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '72px', border: '2px dashed #E2D9C8', borderRadius: '10px', background: '#FBF8F3', cursor: 'pointer' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} />
              <span style={{ fontSize: '10px', color: '#A0B0A4' }}>📎 Upload bukti (opsional)</span>
            </label>
            <button style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#2E7D52', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
              Simpan Transaksi
            </button>
          </div>
        )}

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {DUMMY.map(t => (
            <div key={t.id} style={{ background: '#FFFFFF', borderRadius: '14px', padding: '12px', border: '1px solid #E2D9C8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: t.jumlah > 0 ? '#EAF7EE' : '#EAF6EE', border: `1px solid ${t.jumlah > 0 ? '#B8E0C4' : '#D4EDDE'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={t.jumlah > 0 ? '#1E7B3A' : '#2E7D52'} style={{ width: '16px', height: '16px' }} strokeWidth={2.5}>
                    {t.jumlah > 0 ? <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></> : <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>}
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>{t.label}</div>
                  <div style={{ fontSize: '9px', color: '#A0B0A4' }}>{t.by} · {t.tanggal}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: t.jumlah > 0 ? '#1E7B3A' : '#C0392B', fontFamily: 'Space Grotesk, monospace' }}>
                  {t.jumlah > 0 ? '+' : '-'}{fmt(t.jumlah)}
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="#A0B0A4" style={{ width: '14px', height: '14px', cursor: 'pointer' }} strokeWidth={2}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
