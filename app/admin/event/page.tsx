'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { Pill } from '@/app/components/ui/Pill'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { useEvents, insertEvent, updateEvent, hapusEvent } from '@/app/hooks/useGaleri'
import { uploadFile } from '@/app/hooks/useUpload'
import { useDialog } from '@/app/providers/DialogProvider'

function getDaysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default function AdminEventPage() {
  const { events, loading, refetch } = useEvents()
  const { showAlert, showConfirm } = useDialog()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nama_event: '', tanggal: '', lokasi: '', deskripsi: '' })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ nama_event: '', tanggal: '', lokasi: '', deskripsi: '' })
    setCoverFile(null)
    setPreviewUrl(null)
    setCurrentCoverUrl(null)
  }

  function handleEdit(e: any) {
    setEditingId(e.id)
    setForm({
      nama_event: e.nama_event,
      tanggal: e.tanggal,
      lokasi: e.lokasi || '',
      deskripsi: e.deskripsi || ''
    })
    setCurrentCoverUrl(e.foto_cover_url || null)
    setPreviewUrl(null)
    setCoverFile(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  async function handleSave() {
    if (!form.nama_event || !form.tanggal) return
    setSaving(true)
    
    let foto_cover_url: string | undefined
    if (coverFile) {
      const url = await uploadFile(coverFile, 'basyar14/events')
      if (url) foto_cover_url = url
    } else if (!previewUrl && !currentCoverUrl) {
      foto_cover_url = ''
    }

    const payload = { ...form, ...(foto_cover_url !== undefined ? { foto_cover_url } : {}) }

    let res;
    if (editingId) {
      res = await updateEvent(editingId, payload)
    } else {
      res = await insertEvent(payload)
    }

    setSaving(false)
    if (res.error) { showAlert('Gagal: ' + res.error.message); return }
    
    resetForm()
    refetch()
    showAlert(editingId ? 'Event berhasil diperbarui!' : 'Event berhasil dibuat!')
  }

  async function handleHapus(id: string, nama: string) {
    const isConfirmed = await showConfirm({
      title: 'Hapus Event',
      message: `Anda yakin ingin menghapus event "${nama}"? Semua data gallery didalamnya mungkin akan tetap ada di storage.`,
      isDestructive: true
    })
    if (!isConfirmed) return
    const { error } = await hapusEvent(id)
    if (error) showAlert('Gagal hapus: ' + error.message)
    else refetch()
  }

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageHeader title="Kelola Event" subtitle="Manajemen jadwal dan lokasi acara." />
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)} 
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
          {showForm ? 'Batal' : '+ Event'}
        </button>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {showForm && (
          <Card className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '2px solid #EEF2FF' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>
              {editingId ? 'Edit Event' : 'Buat Event Baru'}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Nama Event</div>
              <input type="text" placeholder="Buka Puasa Bersama, Santunan, dll" value={form.nama_event} onChange={e => setForm(p => ({ ...p, nama_event: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '14px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Tanggal</div>
                <input type="date" value={form.tanggal} onChange={e => setForm(p => ({ ...p, tanggal: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Lokasi</div>
                <input type="text" placeholder="Nama Tempat/Kota" value={form.lokasi} onChange={e => setForm(p => ({ ...p, lokasi: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Thumbnail Event</div>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px', border: '2px dashed #E5E7EB', borderRadius: '18px', background: '#F9FAFB', cursor: 'pointer', transition: 'all 0.2s', overflow: 'hidden', position: 'relative' }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                
                {previewUrl || currentCoverUrl ? (
                  <div style={{ width: '100%', height: '140px', position: 'relative' }}>
                    <img src={previewUrl || currentCoverUrl || ''} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} className="hover-overlay-upload">
                      <span style={{ color: 'white', fontSize: '12px', fontWeight: 800 }}>Klik untuk Ganti</span>
                    </div>
                    {(previewUrl || currentCoverUrl) && (
                      <button 
                         onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCoverFile(null); setPreviewUrl(null); setCurrentCoverUrl(null); }}
                         style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', border: 'none', width: '24px', height: '24px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5 }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <span style={{ fontSize: '24px' }}>🖼️</span>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700, marginTop: '8px' }}>Upload Cover (Opsional)</div>
                    <div style={{ fontSize: '10px', color: '#CBD5E1', marginTop: '2px' }}>Rekomendasi Landscape 16:9</div>
                  </div>
                )}
              </label>
            </div>

            <button onClick={handleSave} disabled={saving || !form.nama_event || !form.tanggal} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#6366F1', color: 'white', border: 'none', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', opacity: (saving || !form.nama_event || !form.tanggal) ? 0.5 : 1 }}>
              {saving ? 'Proses menyimpan...' : editingId ? 'Simpan Perubahan' : 'Simpan Event'}
            </button>
          </Card>
        )}

        <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF' }}>Agenda Terdaftar</p>
          <div style={{ width: '40px', height: '1px', background: '#F3F4F6' }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat data agenda...</div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '32px', height: '32px' }} strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
            title="Belum ada event"
            description="Mulai tambahkan kegiatan rutin atau spesial."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map((e, i) => {
              const isUpcoming = e.tanggal >= today
              const days = getDaysUntil(e.tanggal)
              const d = new Date(e.tanggal)
              return (
                <Card key={e.id} style={{ animationDelay: `${i * 0.05}s`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isUpcoming ? 1 : 0.6, padding: '14px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: isUpcoming ? '#EEF2FF' : '#F9FAFB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: isUpcoming ? '1px solid #E0E7FF' : '1px solid #F3F4F6' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: isUpcoming ? '#6366F1' : '#9CA3AF', fontFamily: 'Space Grotesk, monospace', lineHeight: 1 }}>{d.getDate()}</span>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: isUpcoming ? '#6366F1' : '#9CA3AF', textTransform: 'uppercase', marginTop: '2px' }}>{d.toLocaleDateString('id-ID', { month: 'short' })}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>{e.nama_event}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                        {e.lokasi && <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600 }}>📍 {e.lokasi}</div>}
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <Pill label={isUpcoming ? 'Akan Datang' : 'Selesai'} variant={isUpcoming ? 'accent' : 'muted'} />
                          {isUpcoming && days >= 0 && days <= 7 && (
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#F59E0B', background: '#FFFBEB', padding: '2px 8px', borderRadius: '20px' }}>Mulai dlm {days} Hari</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleEdit(e)} 
                      style={{ 
                        background: '#EEF2FF', 
                        border: 'none', 
                        cursor: 'pointer', 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '10px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s'
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" style={{ width: '16px', height: '16px' }} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleHapus(e.id, e.nama_event)} 
                      style={{ 
                        background: '#FFF1F2', 
                        border: 'none', 
                        cursor: 'pointer', 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '10px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s'
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" style={{ width: '16px', height: '16px' }} strokeWidth={2.5}>
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

