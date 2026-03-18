'use client'

import { useState } from 'react'
import { Card } from '@/app/components/ui/Card'
import { Pill } from '@/app/components/ui/Pill'
import { PageHeader } from '@/app/components/ui/PageHeader'

const DUMMY_PEMBAYARAN = [
  { id: '1', nama: 'Budi Santoso', tagihan: 'Iuran Bukber', jumlah: 50000, status: 'menunggu' },
  { id: '2', nama: 'Siti Rahayu', tagihan: 'Kas Rutin Apr', jumlah: 20000, status: 'menunggu' },
  { id: '3', nama: 'Ahmad Fauzi', tagihan: 'Iuran Bukber', jumlah: 75000, status: 'lunas', extra: 25000 },
]

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function AdminIuranPage() {
  const [pembayaran, setPembayaran] = useState(DUMMY_PEMBAYARAN)

  function verifikasi(id: string) {
    setPembayaran(p => p.map(x => x.id === id ? { ...x, status: 'lunas' } : x))
  }

  const menunggu = pembayaran.filter(p => p.status === 'menunggu')

  return (
    <main className="pb-32">
      <div className="px-4 pt-5 pb-2 animate-in delay-1">
        <PageHeader
          title="Kelola Iuran"
          action={
            <button className="text-[10px] font-bold text-white bg-[var(--acc)] px-4 py-2 rounded-full">
              + Tagihan
            </button>
          }
        />
      </div>

      <div className="px-4 flex flex-col gap-4">
        {menunggu.length > 0 && (
          <div className="bg-[#FFFBEB] border border-[#E5C04A] rounded-xl px-4 py-3 animate-in delay-1">
            <div className="text-[11px] font-bold text-[var(--warn)]">
              ⏳ {menunggu.length} Pembayaran Menunggu Verifikasi
            </div>
          </div>
        )}

        <div className="animate-in delay-2 flex flex-col gap-3">
          {pembayaran.map(p => (
            <Card key={p.id}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[12px] font-bold text-[var(--txt)]">{p.nama}</div>
                  <div className="text-[9px] text-[var(--mut)]">{p.tagihan}</div>
                  <div className="text-[11px] font-bold text-[var(--acc)] font-mono-num mt-0.5">
                    {formatRupiah(p.jumlah)}
                    {p.extra && (
                      <span className="text-[9px] text-[var(--ok)] ml-1">
                        (+{formatRupiah(p.extra)})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                  <Pill
                    label={p.status === 'menunggu' ? 'Menunggu' : 'Lunas'}
                    variant={p.status === 'menunggu' ? 'warn' : 'green'}
                  />
                  {p.status === 'menunggu' && (
                    <div className="flex gap-1.5 mt-1">
                      <button
                        onClick={() => verifikasi(p.id)}
                        className="text-[9px] font-bold bg-[#EAF7EE] text-[var(--ok)] px-2.5 py-1 rounded-full"
                      >
                        ✓ Verif
                      </button>
                      <button className="text-[9px] font-bold bg-[var(--acsl)] text-[var(--acc)] px-2.5 py-1 rounded-full">
                        Bukti
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
