'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { supabase } from '@/app/lib/supabase'
import { useAnggota } from '@/app/hooks/useIuran'
import { useDialog } from '@/app/providers/DialogProvider'
import { EmptyState } from '@/app/components/ui/EmptyState'

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

  const filtered = anggota.filter(a => a.nama.toLowerCase().includes(search.toLowerCase()))

  async function handleTambah() {
    if (!nama.trim()) return
    setSaving(true)
    const { error } = await supabase.from('anggota').insert([{ nama: nama.trim() }])
    setSaving(false)
    if (error) { showAlert('Gagal: ' + error.message); return }
    setNama('')
    setShowForm(false)
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
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageHeader title="Daftar Anggota" subtitle="Kelola data seluruh anggota Basyar-14." />
        <button 
          onClick={() => setShowForm(!showForm)} 
          style={{ 
            background: showForm ? '#F3F4F6' : '#6366F1', 
            color: showForm ? '#6B7280' : 'white', 
            border: 'none', 
            borderRadius: '12px', 
            padding: '10px 18px', 
            fontSize: '13px', 
            fontWeight: 800, 
            cursor: 'pointer', 
            fontFamily: 'Nunito, sans-serif', 
            flexShrink: 0,
            boxShadow: showForm ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.2)',
            transition: 'all 0.2s'
          }}
        >
          {showForm ? 'Batal' : '+ Anggota'}
        </button>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {showForm && (
          <Card className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '2px solid #EEF2FF' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Tambah Anggota Baru</div>
            <input type="text" placeholder="Nama lengkap anggota" value={nama} onChange={e => setNama(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleTambah()} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '14px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
            <button onClick={handleTambah} disabled={saving || !nama.trim()} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#6366F1', color: 'white', border: 'none', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', opacity: (saving || !nama.trim()) ? 0.5 : 1 }}>
              {saving ? 'Proses menyimpan...' : 'Simpan Anggota'}
            </button>
          </Card>
        )}

        <div className="animate-in" style={{ animationDelay: '0.1s' }}>
          <Card style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" style={{ width: '18px', height: '18px', flexShrink: 0 }} strokeWidth={2.5}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Cari anggota berdasarkan nama..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, fontSize: '14px', background: 'transparent', border: 'none', outline: 'none', color: '#111827', fontFamily: 'Nunito, sans-serif', fontWeight: 500 }} />
          </Card>
        </div>

        <div className="animate-in" style={{ animationDelay: '0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF' }}>{filtered.length} Member Terdaftar</p>
          <div style={{ width: '40px', height: '1px', background: '#F3F4F6' }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat data anggota...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '32px', height: '32px' }} strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
            title="Tidak ada anggota"
            description={search ? "Coba kata kunci pencarian lain." : "Belum ada anggota yang terdaftar."}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((a, i) => (
              <Card key={a.id} style={{ animationDelay: `${i * 0.03}s`, display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px' }}>
                {editingId === a.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                      type="text"
                      value={editNama}
                      onChange={e => setEditNama(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleEdit(a.id)}
                      autoFocus
                      style={{ width: '100%', background: '#F9FAFB', border: '2px solid #6366F1', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setEditingId(null); setEditNama('') }} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#F3F4F6', color: '#6B7280', border: 'none', fontSize: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                        Batal
                      </button>
                      <button onClick={() => handleEdit(a.id)} disabled={saving || !editNama.trim()} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#6366F1', color: 'white', border: 'none', fontSize: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: (saving || !editNama.trim()) ? 0.5 : 1 }}>
                        {saving ? 'Proses...' : 'Simpan Perubahan'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #E0E7FF' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#6366F1', fontFamily: 'Space Grotesk, sans-serif' }}>{a.nama[0]}</span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>{a.nama}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <button
                        onClick={() => { setEditingId(a.id); setEditNama(a.nama) }}
                        style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        title="Edit nama"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" style={{ width: '16px', height: '16px' }} strokeWidth={2.5}>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleHapus(a.id, a.nama)}
                        disabled={deleting === a.id}
                        style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        title="Hapus anggota"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" style={{ width: '16px', height: '16px' }} strokeWidth={2.5}>
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
