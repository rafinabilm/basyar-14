'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BottomNav } from '@/app/components/ui/BottomNav'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { PageHeader } from '@/app/components/ui/PageHeader'

const TAHUN_FILTERS = ['Semua', '2025', '2024', '2023']

const DUMMY_ALBUMS = [
  { id: '1', nama: 'Bukber Ramadan 2025', tahun: '2025', jumlah_foto: 24, cover_color: 'linear-gradient(135deg, #2E7D52, #5aac7e)', featured: true },
  { id: '2', nama: 'Silaturahmi ke Guru', tahun: '2025', jumlah_foto: 18, cover_color: 'linear-gradient(135deg, #C8DDD0, #8FBA9F)', featured: false },
  { id: '3', nama: 'Reuni Kecil 2024', tahun: '2024', jumlah_foto: 32, cover_color: 'linear-gradient(135deg, #b8d4c0, #7eaa8e)', featured: false },
  { id: '4', nama: 'Bukber Ramadan 2024', tahun: '2024', jumlah_foto: 21, cover_color: 'linear-gradient(135deg, #A8C4B0, #6a9e80)', featured: false },
]

export default function GaleriPage() {
  const [activeTahun, setActiveTahun] = useState('Semua')

  const filtered = DUMMY_ALBUMS.filter(a =>
    activeTahun === 'Semua' ? true : a.tahun === activeTahun
  )

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <main className="pb-32">
      <div className="px-4 pt-5 pb-2 animate-in delay-1">
        <PageHeader title="Galeri Kenangan" />
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Filter Tahun */}
        <div className="flex gap-2 overflow-x-auto pb-1 animate-in delay-1">
          {TAHUN_FILTERS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTahun(t)}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all"
              style={{
                background: activeTahun === t ? 'var(--acc)' : 'transparent',
                color: activeTahun === t ? 'white' : 'var(--sec)',
                borderColor: activeTahun === t ? 'var(--acc)' : 'var(--bord)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--acc)" className="w-7 h-7" strokeWidth={1.8}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            }
            title="Belum ada foto nih"
            description="Momen kebersamaan kalian akan muncul di sini."
          />
        ) : (
          <>
            {/* Featured Album */}
            {featured && (
              <Link href={`/galeri/${featured.id}`} className="animate-in delay-2">
                <div className="rounded-2xl overflow-hidden relative cursor-pointer hover:opacity-95 transition-opacity">
                  <div className="h-36" style={{ background: featured.cover_color }} />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[rgba(20,40,28,0.85)] to-transparent">
                    <div className="text-[14px] font-extrabold text-white tracking-tight">{featured.nama}</div>
                    <div className="text-[9px] text-white/75">{featured.jumlah_foto} foto · {featured.tahun}</div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid Albums */}
            <div className="grid grid-cols-2 gap-2 animate-in delay-3">
              {rest.map(album => (
                <Link key={album.id} href={`/galeri/${album.id}`}>
                  <div className="rounded-xl overflow-hidden relative cursor-pointer hover:opacity-95 transition-opacity">
                    <div className="h-20" style={{ background: album.cover_color }} />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-[rgba(20,40,28,0.82)] to-transparent">
                      <div className="text-[11px] font-bold text-white">{album.nama}</div>
                      <div className="text-[8px] text-white/75">{album.jumlah_foto} foto</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
