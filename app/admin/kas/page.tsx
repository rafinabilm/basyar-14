'use client'

import { useState } from 'react'
import { SaldoCard } from '@/app/components/ui/SaldoCard'
import { Card } from '@/app/components/ui/Card'
import { PageHeader } from '@/app/components/ui/PageHeader'

const DUMMY = [
  { id: '1', label: 'Konsumsi Bukber', by: 'Admin1', tanggal: '15 Mar', jumlah: -350000 },
  { id: '2', label: 'Iuran April', by: 'Bendahara', tanggal: '12 Mar', jumlah: 500000 },
  { id: '3', label: 'Hadiah Guru', by: 'Admin1', tanggal: '10 Mar', jumlah: -200000 },
]

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(n))
}

export default function AdminKasPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <main className="pb-32">
      <div className="px-4 pt-5 pb-2 animate-in delay-1">
        <PageHeader
          title="Kelola Kas"
          action={
            <button onClick={() => setShowForm(!showForm)} className="text-[10px] font-bold text-white bg-[var(--acc)] px-4 py-2 rounded-full">
              + Tambah
            </button>
          }
        />
      </div>

      <div className="px-4 flex flex-col gap-4">
        <div className="animate-in delay-1">
          <SaldoCard saldo={1250000} masuk={3500000} keluar={2250000} />
        </div>

        {showForm && (
          <Card className="animate-in delay-1 flex flex-col gap-3">
            <div className="text-[13px] font-bold text-[var(--txt)]">Tambah Transaksi</div>
            <select className="w-full bg-[var(--bg)] border border-[var(--bord)] rounded-xl px-3 py-2.5 text-[11px] text-[var(--txt)]">
              <option>Pemasukan</option>
              <option>Pengeluaran</option>
            </select>
            <input type="number" placeholder="Jumlah (Rp)" className="w-full bg-[var(--bg)] border border-[var(--bord)] rounded-xl px-3 py-2.5 text-[11px]" />
            <input type="text" placeholder="Keterangan" className="w-full bg-[var(--bg)] border border-[var(--bord)] rounded-xl px-3 py-2.5 text-[11px]" />
            <select className="w-full bg-[var(--bg)] border border-[var(--bord)] rounded-xl px-3 py-2.5 text-[11px] text-[var(--txt)]">
              <option>Iuran</option>
              <option>Konsumsi</option>
              <option>Hadiah Guru</option>
              <option>Transportasi</option>
              <option>Lainnya</option>
            </select>
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-[var(--bord)] rounded-xl bg-[var(--bg)] cursor-pointer">
              <input type="file" accept="image/*" className="hidden" />
              <span className="text-[10px] text-[var(--mut)]">📎 Upload bukti (opsional)</span>
            </label>
            <button className="w-full py-3 rounded-xl text-[13px] font-bold text-white bg-[var(--acc)]">
              Simpan Transaksi
            </button>
          </Card>
        )}

        <div className="animate-in delay-2 flex flex-col gap-3">
          {DUMMY.map(t => (
            <Card key={t.id} className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: t.jumlah > 0 ? '#EAF7EE' : 'var(--acsl)', border: `1px solid ${t.jumlah > 0 ? '#B8E0C4' : 'var(--acs)'}` }}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke={t.jumlah > 0 ? 'var(--ok)' : 'var(--acc)'} className="w-3.5 h-3.5">
                    {t.jumlah > 0
                      ? <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>
                      : <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>}
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[var(--txt)]">{t.label}</div>
                  <div className="text-[9px] text-[var(--mut)]">{t.by} · {t.tanggal}</div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[11px] font-bold font-mono-num" style={{ color: t.jumlah > 0 ? 'var(--ok)' : 'var(--err)' }}>
                  {t.jumlah > 0 ? '+' : '-'}{formatRupiah(t.jumlah)}
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--mut)" className="w-3.5 h-3.5 cursor-pointer" strokeWidth={2}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
