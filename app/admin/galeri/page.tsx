'use client'

import { useState } from 'react'
import { Card } from '@/app/components/ui/Card'
import { PageHeader } from '@/app/components/ui/PageHeader'

const DUMMY_ALBUMS = [
  {
    id: '1',
    nama: 'Bukber Ramadan 2025',
    jumlah: 4,
    fotos: [
      'linear-gradient(135deg, #D4EDDE, #A8C4B0)',
      'linear-gradient(135deg, #C8DDD0, #8FBA9F)',
      'linear-gradient(135deg, #b8d4c0, #7eaa8e)',
      'linear-gradient(135deg, #E2D9C8, #C8DDD0)',
    ],
  },
]

export default function AdminGaleriPage() {
  const [albums] = useState(DUMMY_ALBUMS)

  return (
    <main className="pb-32">
      <div className="px-4 pt-5 pb-2 animate-in delay-1">
        <PageHeader
          title="Kelola Galeri"
          action={
            <button className="text-[10px] font-bold text-white bg-[var(--acc)] px-4 py-2 rounded-full">
              + Upload
            </button>
          }
        />
      </div>

      <div className="px-4 flex flex-col gap-4 animate-in delay-2">
        {albums.map(album => (
          <Card key={album.id}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[12px] font-bold text-[var(--txt)]">{album.nama}</span>
              <span className="text-[10px] text-[var(--mut)]">{album.jumlah} foto</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {album.fotos.map((color, i) => (
                <div key={i} className="relative">
                  <div className="h-12 rounded-lg" style={{ background: color }} />
                  <button className="absolute top-1 right-1 w-3.5 h-3.5 bg-[rgba(192,57,43,0.85)] rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Upload Area */}
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[var(--bord)] rounded-2xl bg-[var(--bg)] cursor-pointer hover:border-[var(--acc)] transition-colors">
          <input type="file" multiple accept="image/*" className="hidden" />
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--acc)" className="w-7 h-7 mb-2" strokeWidth={1.8}>
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span className="text-[11px] font-bold text-[var(--acc)]">Upload Foto Baru</span>
          <span className="text-[9px] text-[var(--mut)] mt-0.5">JPG, PNG maks. 5MB per foto</span>
        </label>
      </div>
    </main>
  )
}
