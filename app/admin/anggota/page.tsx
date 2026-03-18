'use client'

import { useState } from 'react'

const DUMMY = [
  { id: '1', nama: 'Ahmad Fauzi', total: 350000 },
  { id: '2', nama: 'Budi Santoso', total: 200000 },
  { id: '3', nama: 'Citra Dewi', total: 420000 },
  { id: '4', nama: 'Dian Permata', total: 150000 },
  { id: '5', nama: 'Eko Prasetyo', total: 300000 },
]

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function AdminAnggotaPage() {
  const [search, setSearch] = useState('')
  const filtered = DUMMY.filter(a => a.nama.toLowerCase().includes(search.toLowerCase()))

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.5px' }}>Kelola Anggota</h1>
        <button style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
          + Anggota
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '12px 14px', border: '1px solid #E2D9C8', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#A0B0A4" style={{ width: '16px', height: '16px', flexShrink: 0 }} strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Cari nama anggota..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, fontSize: '12px', background: 'transparent', border: 'none', outline: 'none', color: '#1C2B22', fontFamily: 'Nunito, sans-serif' }}
          />
        </div>

        <p style={{ fontSize: '10px', color: '#A0B0A4' }}>{filtered.length} anggota ditemukan</p>

        {filtered.map(a => (
          <div key={a.id} style={{ background: '#FFFFFF', borderRadius: '14px', padding: '12px 14px', border: '1px solid #E2D9C8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#2E7D52' }}>{a.nama[0]}</span>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>{a.nama}</div>
                <div style={{ fontSize: '10px', color: '#A0B0A4', fontFamily: 'Space Grotesk, monospace' }}>Total: {fmt(a.total)}</div>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="#A0B0A4" style={{ width: '14px', height: '14px', cursor: 'pointer' }} strokeWidth={2}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
        ))}
      </div>
    </main>
  )
}
