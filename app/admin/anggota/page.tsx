'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { supabase } from '@/app/lib/supabase'
import { useAnggota } from '@/app/hooks/useIuran'
import { useDialog } from '@/app/providers/DialogProvider'

export default function AdminAnggotaPage() {
  const { anggota, loading } = useAnggota()
  const { showAlert, showConfirm } = useDialog()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [nama, setNama] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNama, setEditNama] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const filtered = anggota.filter(a => a.nama.toLowerCase().includes(search.toLowerCase()))

  async function handleTambah() {
    if (!nama.trim()) return
    setSaving(true)
    const { error } = await supabase.from('anggota').insert([{ nama: nama.trim() }])
    setSaving(false)
    if (error) { showAlert('Gagal: ' + error.message); return }
    setNama('')
    setShowForm(false)
    setRefreshKey(k => k + 1)
    window.location.reload()
  }

  async function handleHapus(id: string, namaAnggota: string) {
    const isConfirmed = await showConfirm({
      title: 'Hapus Anggota',
      message: `Hapus anggota "${namaAnggota}"?\nSemua data terkait (pembayaran) akan ikut terhapus.`,
      isDestructive: true
    })
    if (!isConfirmed) return
    
    setDeleting(id)
    const { error } = await supabase.from('anggota').delete().eq('id', id)
    setDeleting(null)
    if (error) { showAlert('Gagal hapus: ' + error.message); return }
    window.location.reload()
  }

  async function handleEdit(id: string) {
    if (!editNama.trim()) return
    setSaving(true)
    const { error } = await supabase.from('anggota').update({ nama: editNama.trim() }).eq('id', id)
    setSaving(false)
    if (error) { showAlert('Gagal edit: ' + error.message); return }
    setEditingId(null)
    setEditNama('')
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
            <input type="text" placeholder="Nama lengkap anggota" value={nama} onChange={e => setNama(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleTambah()} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
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
            <Card key={a.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {editingId === a.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    value={editNama}
                    onChange={e => setEditNama(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleEdit(a.id)}
                    autoFocus
                    style={{ width: '100%', background: '#FBF8F3', border: '1px solid #2E7D52', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setEditingId(null); setEditNama('') }} style={{ flex: 1, padding: '7px', borderRadius: '8px', background: '#F5F0E8', color: '#5A6E5E', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                      Batal
                    </button>
                    <button onClick={() => handleEdit(a.id)} disabled={saving || !editNama.trim()} style={{ flex: 1, padding: '7px', borderRadius: '8px', background: '#2E7D52', color: 'white', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: (saving || !editNama.trim()) ? 0.5 : 1 }}>
                      {saving ? '...' : 'Simpan'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#2E7D52' }}>{a.nama[0]}</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>{a.nama}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {/* Edit */}
                    <button
                      onClick={() => { setEditingId(a.id); setEditNama(a.nama) }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      title="Edit nama"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#5A6E5E" style={{ width: '15px', height: '15px' }} strokeWidth={2}>
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    {/* Hapus */}
                    <button
                      onClick={() => handleHapus(a.id, a.nama)}
                      disabled={deleting === a.id}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', opacity: deleting === a.id ? 0.5 : 1 }}
                      title="Hapus anggota"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#C0392B" style={{ width: '15px', height: '15px' }} strokeWidth={2}>
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
