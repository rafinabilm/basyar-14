'use client'

import { useState } from 'react'
import { BottomNav } from '@/app/components/ui/BottomNav'
import { SaldoCard } from '@/app/components/ui/SaldoCard'
import { Card } from '@/app/components/ui/Card'
import { Pill } from '@/app/components/ui/Pill'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { PageHeader } from '@/app/components/ui/PageHeader'

const FILTERS = ['Semua', 'Pemasukan', 'Pengeluaran', 'Iuran', 'Konsumsi']

const DUMMY_TRANSAKSI = [
  { id: '1', label: 'Konsumsi Bukber', kategori: 'Konsumsi', tanggal: '15 Mar 2025', jumlah: -350000, foto_bukti_url: '#' },
  { id: '2', label: 'Iuran Bulan April', kategori: 'Iuran', tanggal: '12 Mar 2025', jumlah: 500000, foto_bukti_url: '#' },
  { id: '3', label: 'Hadiah Guru Purna', kategori: 'Hadiah Guru', tanggal: '10 Mar 2025', jumlah: -200000, foto_bukti_url: '#' },
  { id: '4', label: 'Iuran Bulan Maret', kategori: 'Iuran', tanggal: '5 Mar 2025', jumlah: 500000, foto_bukti_url: '#' },
  { id: '5', label: 'Transportasi Acara', kategori: 'Transportasi', tanggal: '1 Mar 2025', jumlah: -150000, foto_bukti_url: null },
]

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Math.abs(amount))
}

export default function KasPage() {
  const [activeFilter, setActiveFilter] = useState('Semua')

  const filtered = DUMMY_TRANSAKSI.filter(t => {
    if (activeFilter === 'Semua') return true
    if (activeFilter === 'Pemasukan') return t.jumlah > 0
    if (activeFilter === 'Pengeluaran') return t.jumlah < 0
    return t.kategori.toLowerCase().includes(activeFilter.toLowerCase())
  })

  return (
    <main className="pb-32">
      <div className="px-4 pt-5 pb-2 animate-in delay-1">
        <PageHeader title="Laporan Kas" />
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Saldo Card */}
        <div className="animate-in delay-1">
          <SaldoCard saldo={1250000} masuk={3500000} keluar={2250000} />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 animate-in delay-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all"
              style={{
                background: activeFilter === f ? 'var(--acc)' : 'transparent',
                color: activeFilter === f ? 'white' : 'var(--sec)',
                borderColor: activeFilter === f ? 'var(--acc)' : 'var(--bord)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Transaksi List */}
        <div className="animate-in delay-3">
          <p className="text-[9px] font-mono tracking-widest uppercase text-[var(--mut)] mb-2">
            Maret 2025
          </p>

          {filtered.length === 0 ? (
            <EmptyState
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--acc)" className="w-7 h-7" strokeWidth={1.8}>
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              }
              title="Belum ada transaksi"
              description="Transaksi kas akan muncul di sini."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((t) => (
                <Card key={t.id} className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                      style={{
                        background: t.jumlah > 0 ? '#EAF7EE' : 'var(--acsl)',
                        border: `1px solid ${t.jumlah > 0 ? '#B8E0C4' : 'var(--acs)'}`,
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5}
                        stroke={t.jumlah > 0 ? 'var(--ok)' : 'var(--acc)'}
                        className="w-3.5 h-3.5"
                      >
                        {t.jumlah > 0
                          ? <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>
                          : <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>
                        }
                      </svg>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[var(--txt)]">{t.label}</div>
                      <div className="text-[9px] text-[var(--mut)]">{t.kategori} · {t.tanggal}</div>
                      {t.foto_bukti_url && (
                        <button className="text-[9px] font-bold text-[var(--acc)] bg-[var(--acsl)] px-2 py-0.5 rounded-full mt-1">
                          Lihat Bukti
                        </button>
                      )}
                    </div>
                  </div>
                  <span
                    className="text-[12px] font-bold font-mono-num flex-shrink-0"
                    style={{ color: t.jumlah > 0 ? 'var(--ok)' : 'var(--err)' }}
                  >
                    {t.jumlah > 0 ? '+' : '-'}{formatRupiah(t.jumlah)}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
