'use client'

import { useState } from 'react'

const DUMMY = [
  { id: '1', nama: 'Budi Santoso', tagihan: 'Iuran Bukber', jumlah: 50000, status: 'menunggu' },
  { id: '2', nama: 'Siti Rahayu', tagihan: 'Kas Rutin Apr', jumlah: 20000, status: 'menunggu' },
  { id: '3', nama: 'Ahmad Fauzi', tagihan: 'Iuran Bukber', jumlah: 75000, status: 'lunas', extra: 25000 },
  { id: '4', nama: 'Dewi Lestari', tagihan: 'Kas Rutin Apr', jumlah: 20000, status: 'lunas' },
]

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function AdminIuranPage() {
  const [items, setItems] = useState(DUMMY)

  function verifikasi(id: string) {
    setItems(p => p.map(x => x.id === id ? { ...x, status: 'lunas' } : x))
  }

  const menunggu = items.filter(p => p.status === 'menunggu')

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.5px' }}>Kelola Iuran</h1>
        <button style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
          + Tagihan
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {menunggu.length > 0 && (
          <div style={{ background: '#FFFBEB', border: '1px solid #E5C04A', borderRadius: '14px', padding: '12px 14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#B8860B' }}>⏳ {menunggu.length} Pembayaran Menunggu Verifikasi</div>
          </div>
        )}

        {items.map(p => (
          <div key={p.id} style={{ background: '#FFFFFF', borderRadius: '14px', padding: '14px', border: '1px solid #E2D9C8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22' }}>{p.nama}</div>
                <div style={{ fontSize: '10px', color: '#A0B0A4', marginTop: '2px' }}>{p.tagihan}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#2E7D52', fontFamily: 'Space Grotesk, monospace', marginTop: '4px' }}>
                  {fmt(p.jumlah)}
                  {'extra' in p && p.extra && (
                    <span style={{ fontSize: '10px', color: '#1E7B3A', marginLeft: '6px' }}>(+{fmt(p.extra as number)})</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: p.status === 'menunggu' ? '#FFFBEB' : '#EAF7EE', color: p.status === 'menunggu' ? '#B8860B' : '#1E7B3A' }}>
                  {p.status === 'menunggu' ? 'Menunggu' : 'Lunas'}
                </span>
                {p.status === 'menunggu' && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => verifikasi(p.id)} style={{ fontSize: '10px', fontWeight: 700, background: '#EAF7EE', color: '#1E7B3A', border: 'none', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                      ✓ Verif
                    </button>
                    <button style={{ fontSize: '10px', fontWeight: 700, background: '#EAF6EE', color: '#2E7D52', border: 'none', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                      Bukti
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
