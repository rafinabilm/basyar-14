'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { supabase } from '@/app/lib/supabase'
import { useAnggota } from '@/app/hooks/useIuran'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function AdminAnggotaPage() {
  const { anggota, loading } = useAnggota()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [nama, setNama] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = anggota.filter(a => a.nama.toLowerCase().includes(search.toLowerCase()))

  async function handleTambah() {
    if (!nama.trim()) return
    setSaving(true)
    const { error } = await supabase.from('anggota').insert([{ nama: nama.trim() }])
    setSaving(false)
    if (error) { alert('Gagal: ' + error.message); return }
    setNama('')
    setShowForm(false)
    window.location.reload()
  }

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <PageHeader title="Kelola Anggota" />
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', flexShrink: 0 }}>
          {showForm ? '× Tutup' : '+ Anggota'}
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {showForm && (
          <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Tambah Anggota</div>
            <input type="text" placeholder="Nama lengkap anggota" value={nama} onChange={e => setNama(e.target.value)} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
            <button onClick={handleTambah} disabled={saving || !nama.trim()} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#2E7D52', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: (saving || !nama.trim()) ? 0.5 : 1 }}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </Card>
        )}

        <Card style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#A0B0A4" style={{ width: '16px', height: '16px', flexShrink: 0 }} strokeWidth={2}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" placeholder="Cari nama anggota..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, fontSize: '12px', background: 'transparent', border: 'none', outline: 'none', color: '#1C2B22', fontFamily: 'Nunito, sans-serif' }} />
        </Card>

        <p style={{ fontSize: '10px', color: '#A0B0A4' }}>{filtered.length} anggota ditemukan</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Belum ada anggota. Tambahkan dulu!</div>
        ) : (
          filtered.map(a => (
            <Card key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#2E7D52' }}>{a.nama[0]}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>{a.nama}</div>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
