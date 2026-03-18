'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { Pill } from '@/app/components/ui/Pill'
import { useEvents, insertEvent, hapusEvent } from '@/app/hooks/useGaleri'
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
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nama_event: '', tanggal: '', lokasi: '', deskripsi: '' })
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const today = new Date().toISOString().split('T')[0]

  async function handleSave() {
    if (!form.nama_event || !form.tanggal) return
    setSaving(true)
    let foto_cover_url: string | undefined
    if (coverFile) {
      const url = await uploadFile(coverFile, 'basyar14/events')
      if (url) foto_cover_url = url
    }
    const { error } = await insertEvent({ ...form, foto_cover_url })
    setSaving(false)
    if (error) { showAlert('Gagal: ' + error.message); return }
    setShowForm(false)
    setForm({ nama_event: '', tanggal: '', lokasi: '', deskripsi: '' })
    setCoverFile(null)
    refetch()
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
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <PageHeader title="Kelola Event" />
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', flexShrink: 0 }}>
          {showForm ? '× Tutup' : '+ Event'}
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {showForm && (
          <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Tambah Event</div>
            {[
              { label: 'Nama Event', key: 'nama_event', type: 'text', placeholder: 'Buka Puasa Bersama 2025' },
              { label: 'Tanggal', key: 'tanggal', type: 'date', placeholder: '' },
              { label: 'Lokasi', key: 'lokasi', type: 'text', placeholder: 'Bandung' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '5px' }}>{f.label}</div>
                <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
              </div>
            ))}
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '72px', border: '2px dashed #E2D9C8', borderRadius: '10px', background: '#FBF8F3', cursor: 'pointer' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setCoverFile(e.target.files?.[0] ?? null)} />
              <span style={{ fontSize: '10px', color: coverFile ? '#2E7D52' : '#A0B0A4', fontWeight: coverFile ? 700 : 400 }}>{coverFile ? `✓ ${coverFile.name}` : '🖼️ Upload foto cover (opsional)'}</span>
            </label>
            <button onClick={handleSave} disabled={saving || !form.nama_event || !form.tanggal} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#2E7D52', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: (saving || !form.nama_event || !form.tanggal) ? 0.5 : 1 }}>
              {saving ? 'Menyimpan...' : 'Simpan Event'}
            </button>
          </Card>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Belum ada event. Tambahkan yang pertama!</div>
        ) : (
          events.map(e => {
            const isUpcoming = e.tanggal >= today
            const days = getDaysUntil(e.tanggal)
            const d = new Date(e.tanggal)
            return (
              <Card key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isUpcoming ? 1 : 0.6 }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: isUpcoming ? '#EAF6EE' : '#F5F0E8', border: `1px solid ${isUpcoming ? '#D4EDDE' : '#E2D9C8'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: isUpcoming ? '#2E7D52' : '#5A6E5E', fontFamily: 'Space Grotesk, monospace', lineHeight: 1 }}>{d.getDate()}</span>
                    <span style={{ fontSize: '7px', fontWeight: 700, color: isUpcoming ? '#2E7D52' : '#5A6E5E' }}>{d.toLocaleDateString('id-ID', { month: 'short' })}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22' }}>{e.nama_event}</div>
                    {e.lokasi && <div style={{ fontSize: '9px', color: '#A0B0A4' }}>📍 {e.lokasi}</div>}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '3px', alignItems: 'center' }}>
                      <Pill label={isUpcoming ? 'Upcoming' : 'Selesai'} variant={isUpcoming ? 'green' : 'muted'} />
                      {isUpcoming && days >= 0 && (
                        <span style={{ fontSize: '9px', fontWeight: 700, color: 'white', background: '#2E7D52', padding: '2px 7px', borderRadius: '20px', fontFamily: 'Space Grotesk, monospace' }}>H-{days}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleHapus(e.id, e.nama_event)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C0392B" style={{ width: '16px', height: '16px' }} strokeWidth={2}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /></svg>
                </button>
              </Card>
            )
          })
        )}
      </div>
    </main>
  )
}
