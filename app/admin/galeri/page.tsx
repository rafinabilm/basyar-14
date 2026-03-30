'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { useEvents, useFotoByEvent, insertFoto, hapusFoto, updateEvent } from '@/app/hooks/useGaleri'
import { uploadFile } from '@/app/hooks/useUpload'
import { useDialog } from '@/app/providers/DialogProvider'

function AlbumCard({ event, index, onRefresh }: { event: any, index: number, onRefresh: () => void }) {
  const { foto, loading, refetch } = useFotoByEvent(event.id)
  const { showAlert, showConfirm } = useDialog()
  const [uploading, setUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ nama_event: event.nama_event, tanggal: event.tanggal })

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const url = await uploadFile(file, `basyar14/galeri/${event.id}`)
      if (url) await insertFoto({ event_id: event.id, foto_url: url })
    }
    setUploading(false)
    refetch()
  }

  async function handleHapus(id: string) {
    const conf = await showConfirm({ title: 'Hapus Foto?', message: 'Foto akan dihapus permanen.', isDestructive: true })
    if (!conf) return
    const { error } = await hapusFoto(id)
    if (error) showAlert('Gagal hapus')
    else refetch()
  }

  async function handleSaveEvent() {
    const { error } = await updateEvent(event.id, editForm)
    if (error) showAlert('Gagal update event')
    else {
      setIsEditing(false)
      onRefresh()
      showAlert('Event diperbarui')
    }
  }

  async function handleSetThumbnail(url: string) {
    const { error } = await updateEvent(event.id, { foto_cover_url: url })
    if (error) showAlert('Gagal set thumbnail')
    else {
      onRefresh()
      showAlert('Thumbnail diperbarui')
    }
  }

  return (
    <Card style={{ animationDelay: `${index * 0.1}s`, padding: '20px', border: isEditing ? '2px solid #6366F1' : '1px solid #F3F4F6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                value={editForm.nama_event} 
                onChange={e => setEditForm(p => ({ ...p, nama_event: e.target.value }))}
                style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', fontSize: '15px', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}
              />
              <input 
                type="date" 
                value={editForm.tanggal} 
                onChange={e => setEditForm(p => ({ ...p, tanggal: e.target.value }))}
                style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontFamily: 'Nunito, sans-serif' }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button onClick={handleSaveEvent} style={{ padding: '6px 16px', background: '#6366F1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>Simpan</button>
                <button onClick={() => setIsEditing(false)} style={{ padding: '6px 16px', background: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>Batal</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#111827' }}>{event.nama_event}</div>
                <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" style={{ width: '16px', height: '16px' }} strokeWidth={2.5}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
              </div>
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px', fontWeight: 600 }}>
                {new Date(event.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
           <span style={{ fontSize: '11px', fontWeight: 800, color: '#6366F1', background: '#EEF2FF', padding: '5px 12px', borderRadius: '20px', border: '1px solid #E0E7FF' }}>
            {loading ? '...' : `${foto.length} Foto`}
           </span>
        </div>
      </div>

      {foto.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginBottom: '16px' }}>
          {foto.map((f, i) => (
            <div key={f.id} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', group: 'true' } as any}>
              <div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', background: '#F3F4F6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: event.foto_cover_url === f.foto_url ? '3px solid #6366F1' : 'none' }}>
                <img src={f.foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              
              <div style={{ position: 'absolute', top: '-6px', right: '-6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button 
                  onClick={() => handleHapus(f.id)} 
                  style={{ width: '22px', height: '22px', background: '#EF4444', borderRadius: '50%', border: '2px solid white', color: 'white', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                  ×
                </button>
              </div>

              {event.foto_cover_url === f.foto_url ? (
                <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: '#6366F1', color: 'white', fontSize: '8px', fontWeight: 900, padding: '2px 6px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>COVER</div>
              ) : (
                <button 
                  onClick={() => handleSetThumbnail(f.foto_url)}
                  style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(255,255,255,0.9)', color: '#6366F1', fontSize: '8px', fontWeight: 900, padding: '2px 6px', borderRadius: '8px', border: '1px solid #E0E7FF', cursor: 'pointer', opacity: 0.8 }}
                >
                  SET COVER
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '52px', border: '2px dashed #E5E7EB', borderRadius: '14px', background: '#F9FAFB', cursor: 'pointer', gap: '8px', transition: 'all 0.2s' }}>
        <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} disabled={uploading} />
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#6366F1', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{uploading ? '⌛' : '📸'}</span>
          <span>{uploading ? 'Sedang Mengupload...' : 'Tambah Koleksi Foto'}</span>
        </div>
      </label>
    </Card>
  )
}

export default function AdminGaleriPage() {
  const { events, loading, refetch } = useEvents()

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px' }}>
        <PageHeader title="Kelola Galeri" subtitle="Upload momen kebersamaan di tiap event." />
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF' }}>Daftar Event</p>
          <div style={{ width: '40px', height: '1px', background: '#F3F4F6' }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat data galeri...</div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '32px', height: '32px' }} strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
            title="Event masih kosong"
            description="Buat event terlebih dahulu di modul Event."
          />
        ) : (
          events.map((e, index) => <AlbumCard key={e.id} event={e} index={index} onRefresh={refetch} />)
        )}
      </div>
    </main>
  )
}

