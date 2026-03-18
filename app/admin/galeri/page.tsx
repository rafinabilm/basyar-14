'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { useEvents, useFotoByEvent, insertFoto, hapusFoto } from '@/app/hooks/useGaleri'
import { uploadFile } from '@/app/hooks/useUpload'

function AlbumCard({ event }: { event: any }) {
  const { foto, loading, refetch } = useFotoByEvent(event.id)
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
    if (error) alert('Gagal hapus')
    else refetch()
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22' }}>{event.nama_event}</span>
        <span style={{ fontSize: '10px', color: '#A0B0A4' }}>{loading ? '...' : `${foto.length} foto`}</span>
      </div>

      {foto.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '4px', marginBottom: '10px' }}>
          {foto.map((f, i) => (
            <div key={f.id} style={{ position: 'relative' }}>
              <div style={{ height: '52px', borderRadius: '8px', overflow: 'hidden', background: '#E2D9C8' }}>
                <img src={f.foto_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <button onClick={() => handleHapus(f.id)} style={{ position: 'absolute', top: '3px', right: '3px', width: '16px', height: '16px', background: 'rgba(192,57,43,0.85)', borderRadius: '50%', border: 'none', color: 'white', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>×</button>
            </div>
          ))}
        </div>
      )}

      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px', border: '2px dashed #E2D9C8', borderRadius: '10px', background: '#FBF8F3', cursor: 'pointer', gap: '6px' }}>
        <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} disabled={uploading} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#2E7D52' }}>{uploading ? 'Mengupload...' : '+ Upload Foto'}</span>
      </label>
    </Card>
  )
}

export default function AdminGaleriPage() {
  const { events, loading } = useEvents()

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px' }}>
        <PageHeader title="Kelola Galeri" subtitle="Upload foto per event di bawah ini." />
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Buat event dulu sebelum upload foto.</div>
        ) : (
          events.map(e => <AlbumCard key={e.id} event={e} />)
        )}
      </div>
    </main>
  )
}
