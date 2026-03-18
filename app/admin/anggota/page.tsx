'use client'

import { useState } from 'react'
import { Card } from '@/app/components/ui/Card'
import { PageHeader } from '@/app/components/ui/PageHeader'

const DUMMY_ANGGOTA = [
  { id: '1', nama: 'Ahmad Fauzi', total: 350000 },
  { id: '2', nama: 'Budi Santoso', total: 200000 },
  { id: '3', nama: 'Citra Dewi', total: 420000 },
  { id: '4', nama: 'Dian Permata', total: 150000 },
  { id: '5', nama: 'Eko Prasetyo', total: 300000 },
]

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function AdminAnggotaPage() {
  const [search, setSearch] = useState('')

  const filtered = DUMMY_ANGGOTA.filter(a =>
    a.nama.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="pb-32">
      <div className="px-4 pt-5 pb-2 animate-in delay-1">
        <PageHeader
          title="Kelola Anggota"
          action={
            <button className="text-[10px] font-bold text-white bg-[var(--acc)] px-4 py-2 rounded-full">
              + Anggota
            </button>
          }
        />
      </div>

      <div className="px-4 flex flex-col gap-4">
        <Card className="flex items-center gap-2 animate-in delay-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--mut)" className="w-4 h-4 flex-shrink-0" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Cari nama anggota..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-[11px] bg-transparent outline-none text-[var(--txt)] placeholder:text-[var(--mut)]"
          />
        </Card>

        <p className="text-[10px] text-[var(--mut)] animate-in delay-1">
          {filtered.length} anggota ditemukan
        </p>

        <div className="flex flex-col gap-3 animate-in delay-2">
          {filtered.map(a => (
            <Card key={a.id} className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--acsl)] flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-bold text-[var(--acc)]">{a.nama[0]}</span>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[var(--txt)]">{a.nama}</div>
                  <div className="text-[9px] text-[var(--mut)] font-mono-num">Total: {formatRupiah(a.total)}</div>
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--mut)" className="w-3.5 h-3.5 cursor-pointer" strokeWidth={2}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
