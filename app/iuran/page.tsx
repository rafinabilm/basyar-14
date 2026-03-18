'use client'

import { useState } from 'react'
import { BottomNav } from '@/app/components/ui/BottomNav'
import { BottomSheet } from '@/app/components/ui/BottomSheet'
import { Card } from '@/app/components/ui/Card'
import { Pill } from '@/app/components/ui/Pill'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { PageHeader } from '@/app/components/ui/PageHeader'

const DUMMY_TAGIHAN = [
  {
    id: '1',
    judul: 'Iuran Bukber Ramadan 2025',
    nominal: 50000,
    tipe: 'per_acara',
    batas_bayar: '25 Mar 2025',
    sudah_bayar: 32,
    total_anggota: 47,
  },
  {
    id: '2',
    judul: 'Kas Rutin April 2025',
    nominal: 20000,
    tipe: 'rutin',
    batas_bayar: '30 Apr 2025',
    sudah_bayar: 21,
    total_anggota: 47,
  },
]

const DUMMY_ANGGOTA = [
  { id: '1', nama: 'Ahmad Fauzi' },
  { id: '2', nama: 'Budi Santoso' },
  { id: '3', nama: 'Citra Dewi' },
  { id: '4', nama: 'Dian Permata' },
  { id: '5', nama: 'Eko Prasetyo' },
]

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function IuranPage() {
  const [selectedTagihan, setSelectedTagihan] = useState<typeof DUMMY_TAGIHAN[0] | null>(null)
  const [selectedAnggota, setSelectedAnggota] = useState('')
  const [jumlah, setJumlah] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleOpen(tagihan: typeof DUMMY_TAGIHAN[0]) {
    setSelectedTagihan(tagihan)
    setJumlah(String(tagihan.nominal))
    setSelectedAnggota('')
    setFile(null)
    setSubmitted(false)
  }

  function handleClose() {
    setSelectedTagihan(null)
  }

  function handleSubmit() {
    setSubmitted(true)
    setTimeout(() => {
      handleClose()
    }, 1500)
  }

  return (
    <main className="pb-32">
      <div className="px-4 pt-5 pb-2 animate-in delay-1">
        <PageHeader
          title="Bayar Iuran"
          subtitle="Pilih tagihan yang ingin dibayar."
        />
      </div>

      <div className="px-4 flex flex-col gap-4">
        <p className="text-[9px] font-mono tracking-widest uppercase text-[var(--mut)] animate-in delay-1">
          Tagihan Aktif
        </p>

        {DUMMY_TAGIHAN.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--acc)" className="w-7 h-7" strokeWidth={1.8}>
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            title="Belum ada tagihan"
            description="Tagihan iuran akan muncul di sini."
          />
        ) : (
          DUMMY_TAGIHAN.map((t, i) => {
            const pct = Math.round((t.sudah_bayar / t.total_anggota) * 100)
            return (
              <Card
                key={t.id}
                className={`animate-in delay-${i + 2} border-l-[3px] border-l-[var(--acc)]`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <div className="text-[12px] font-bold text-[var(--txt)]">{t.judul}</div>
                    <div className="text-[9px] text-[var(--mut)] mt-0.5">
                      Deadline: {t.batas_bayar}
                    </div>
                  </div>
                  <Pill
                    label={t.tipe === 'rutin' ? 'Rutin' : 'Per Acara'}
                    variant={t.tipe === 'rutin' ? 'green' : 'accent'}
                  />
                </div>

                {/* Progress Bar */}
                <div className="relative mt-3">
                  <div className="h-1.5 bg-[var(--bord)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--acc)] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="absolute -top-4 right-0 text-[9px] font-bold text-[var(--acc)] font-mono-num">
                    {pct}%
                  </span>
                </div>
                <p className="text-[9px] text-[var(--mut)] mt-1.5">
                  {t.sudah_bayar} dari {t.total_anggota} orang sudah bayar
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-[16px] font-bold text-[var(--acc)] font-mono-num">
                    {formatRupiah(t.nominal)}
                  </span>
                  <button
                    onClick={() => handleOpen(t)}
                    className="text-[10px] font-bold text-white bg-[var(--acc)] px-4 py-2 rounded-full active:opacity-80 transition-opacity"
                  >
                    Bayar →
                  </button>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Bottom Sheet Form */}
      <BottomSheet
        isOpen={!!selectedTagihan}
        onClose={handleClose}
        title="Konfirmasi Pembayaran"
        subtitle={selectedTagihan?.judul}
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-14 h-14 rounded-full bg-[#EAF7EE] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--ok)" className="w-7 h-7" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="text-[14px] font-bold text-[var(--txt)]">Bukti terkirim!</div>
            <div className="text-[11px] text-[var(--mut)] text-center">
              Menunggu verifikasi dari bendahara.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Pilih Nama */}
            <div>
              <label className="text-[9px] font-mono tracking-widest uppercase text-[var(--mut)] mb-1 block">
                Pilih Nama
              </label>
              <select
                value={selectedAnggota}
                onChange={e => setSelectedAnggota(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--bord)] rounded-xl px-3 py-2.5 text-[11px] text-[var(--txt)] appearance-none"
              >
                <option value="">Pilih namamu...</option>
                {DUMMY_ANGGOTA.map(a => (
                  <option key={a.id} value={a.id}>{a.nama}</option>
                ))}
              </select>
            </div>

            {/* Jumlah */}
            <div>
              <label className="text-[9px] font-mono tracking-widest uppercase text-[var(--mut)] mb-1 block">
                Jumlah Dibayar
              </label>
              <input
                type="number"
                value={jumlah}
                onChange={e => setJumlah(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--bord)] rounded-xl px-3 py-2.5 text-[13px] font-bold text-[var(--txt)] font-mono-num"
              />
              <p className="text-[9px] text-[var(--mut)] mt-1">
                Minimal {formatRupiah(selectedTagihan?.nominal ?? 0)} · boleh lebih ✓
              </p>
            </div>

            {/* Upload Bukti */}
            <div>
              <label className="text-[9px] font-mono tracking-widest uppercase text-[var(--mut)] mb-1 block">
                Upload Bukti Transfer
              </label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[var(--bord)] rounded-xl bg-[var(--bg)] cursor-pointer">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="text-center">
                    <div className="text-[12px] font-bold text-[var(--acc)]">✓ {file.name}</div>
                    <div className="text-[9px] text-[var(--mut)] mt-1">Tap untuk ganti</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-lg mb-1">📎</div>
                    <div className="text-[10px] text-[var(--mut)]">Tap untuk upload foto</div>
                    <div className="text-[9px] text-[var(--mut)]">JPG, PNG, PDF maks. 5MB</div>
                  </div>
                )}
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!selectedAnggota || !file || !jumlah}
              className="w-full py-3 rounded-xl text-[13px] font-bold text-white bg-[var(--acc)] disabled:opacity-40 active:opacity-80 transition-opacity mt-1"
            >
              Submit Bukti Pembayaran
            </button>
          </div>
        )}
      </BottomSheet>

      <BottomNav />
    </main>
  )
}
