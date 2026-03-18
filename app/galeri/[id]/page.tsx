import Link from 'next/link'
import { BottomNav } from '@/app/components/ui/BottomNav'

const DUMMY_FOTO = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  url: null,
  caption: `Foto ${i + 1}`,
  color: [
    'linear-gradient(135deg, #D4EDDE, #A8C4B0)',
    'linear-gradient(135deg, #C8DDD0, #8FBA9F)',
    'linear-gradient(135deg, #b8d4c0, #7eaa8e)',
    'linear-gradient(135deg, #E2D9C8, #C8DDD0)',
  ][i % 4],
}))

export default function GaleriDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="pb-32">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 animate-in delay-1">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/galeri" className="text-[var(--acc)] font-bold text-lg leading-none">←</Link>
          <div>
            <h1 className="text-[17px] font-extrabold text-[var(--txt)] tracking-tight">
              Bukber Ramadan 2025
            </h1>
            <p className="text-[9px] text-[var(--mut)]">24 foto · Maret 2025</p>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="px-4 animate-in delay-2">
        <div className="grid grid-cols-3 gap-1">
          {DUMMY_FOTO.map(foto => (
            <div
              key={foto.id}
              className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: foto.color }}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
