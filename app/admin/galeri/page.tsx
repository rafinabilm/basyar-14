'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { useEvents, useFotoByEvent, insertFoto, hapusFoto } from '@/app/hooks/useGaleri'
import { uploadFile } from '@/app/hooks/useUpload'
import { useDialog } from '@/app/providers/DialogProvider'

function AlbumCard({ event, index }: { event: any, index: number }) {
  const { foto, loading, refetch } = useFotoByEvent(event.id)
  const { showAlert } = useDialog()
  const [uploading, setUploading] = useState(false)

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
    const { error } = await hapusFoto(id)
    if (error) showAlert('Gagal hapus')
    else refetch()
  }

  return (
    <Card style={{ animationDelay: `${index * 0.1}s`, padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>{event.nama_event}</div>
          <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px', fontWeight: 500 }}>{new Date(event.tanggal).getFullYear()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <span style={{ fontSize: '11px', fontWeight: 800, color: '#6366F1', background: '#EEF2FF', padding: '4px 10px', borderRadius: '20px' }}>
            {loading ? '...' : `${foto.length} Foto`}
           </span>
        </div>
      </div>

      {foto.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: '8px', marginBottom: '16px' }}>
          {foto.map((f, i) => (
            <div key={f.id} style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', background: '#F3F4F6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <img src={f.foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <button 
                onClick={() => handleHapus(f.id)} 
                style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  right: '-4px', 
                  width: '20px', 
                  height: '20px', 
                  background: '#EF4444', 
                  borderRadius: '50%', 
                  border: '2px solid white', 
                  color: 'white', 
                  fontSize: '12px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 800,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                ×
              </button>
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
  const { events, loading } = useEvents()

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
          events.map((e, index) => <AlbumCard key={e.id} event={e} index={index} />)
        )}
      </div>
    </main>
  )
}

