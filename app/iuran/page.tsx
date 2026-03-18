'use client'

import { useState } from 'react'
import { BottomNav } from '@/app/components/ui/BottomNav'
import { BottomSheet } from '@/app/components/ui/BottomSheet'
import { Card } from '@/app/components/ui/Card'
import { Pill } from '@/app/components/ui/Pill'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { useTagihan, useAnggota, usePembayaranCount, submitPembayaran } from '@/app/hooks/useIuran'
import { uploadFile } from '@/app/hooks/useUpload'
import { useDialog } from '@/app/providers/DialogProvider'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

function TagihanCard({ tagihan, onBayar }: { tagihan: any, onBayar: (t: any) => void }) {
  const { count, total } = usePembayaranCount(tagihan.id)
  const pct = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <Card style={{ borderLeft: '3px solid #2E7D52' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>{tagihan.judul}</div>
          {tagihan.batas_bayar && <div style={{ fontSize: '9px', color: '#A0B0A4', marginTop: '2px' }}>Deadline: {new Date(tagihan.batas_bayar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>}
        </div>
        <Pill label={tagihan.tipe === 'rutin' ? 'Rutin' : 'Per Acara'} variant={tagihan.tipe === 'rutin' ? 'green' : 'accent'} />
      </div>
      <div style={{ position: 'relative', marginTop: '10px' }}>
        <div style={{ height: '6px', background: '#E2D9C8', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#2E7D52', borderRadius: '3px', transition: 'width 0.3s' }} />
        </div>
        <span style={{ position: 'absolute', right: 0, top: '-14px', fontSize: '9px', fontWeight: 700, color: '#2E7D52', fontFamily: 'Space Grotesk, monospace' }}>{pct}%</span>
      </div>
      <div style={{ fontSize: '9px', color: '#A0B0A4', marginTop: '4px' }}>{count} dari {total} orang sudah bayar</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#2E7D52', fontFamily: 'Space Grotesk, monospace' }}>{fmt(tagihan.nominal)}</span>
        <button onClick={() => onBayar(tagihan)} style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '7px 18px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
          Bayar →
        </button>
      </div>
    </Card>
  )
}

export default function IuranPage() {
  const { tagihan, loading } = useTagihan()
  const { anggota } = useAnggota()
  const { showAlert } = useDialog()
  const [selected, setSelected] = useState<any>(null)
  const [anggotaId, setAnggotaId] = useState('')
  const [jumlah, setJumlah] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleOpen(t: any) {
    setSelected(t)
    setJumlah(String(t.nominal))
    setAnggotaId('')
    setFile(null)
    setSubmitted(false)
  }

  async function handleSubmit() {
    if (!anggotaId || !file || !jumlah || !selected) return
    setSubmitting(true)

    const url = await uploadFile(file, 'basyar14/iuran')
    if (!url) { setSubmitting(false); showAlert('Gagal upload foto'); return }

    const { error } = await submitPembayaran({
      anggota_id: anggotaId,
      tagihan_id: selected.id,
      jumlah_bayar: parseInt(jumlah),
      foto_bukti_url: url,
    })

    setSubmitting(false)
    if (error) { showAlert('Gagal submit: ' + error.message); return }
    setSubmitted(true)
    setTimeout(() => setSelected(null), 2000)
  }

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px' }}>
        <PageHeader title="Bayar Iuran" subtitle="Pilih tagihan yang ingin dibayar." />
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4' }}>Tagihan Aktif</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat...</div>
        ) : tagihan.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2E7D52" style={{ width: '28px', height: '28px' }} strokeWidth={1.8}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
            title="Belum ada tagihan"
            description="Tagihan iuran akan muncul di sini."
          />
        ) : (
          tagihan.map(t => <TagihanCard key={t.id} tagihan={t} onBayar={handleOpen} />)
        )}
      </div>

      <BottomSheet isOpen={!!selected} onClose={() => setSelected(null)} title="Konfirmasi Pembayaran" subtitle={selected?.judul}>
        {submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '32px 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#EAF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#1E7B3A" style={{ width: '28px', height: '28px' }} strokeWidth={2.5}><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Bukti terkirim!</div>
            <div style={{ fontSize: '11px', color: '#A0B0A4', textAlign: 'center' }}>Menunggu verifikasi dari bendahara.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '6px' }}>Pilih Nama</div>
              <select value={anggotaId} onChange={e => setAnggotaId(e.target.value)} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '12px', padding: '11px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }}>
                <option value="">Pilih namamu...</option>
                {anggota.map(a => <option key={a.id} value={a.id}>{a.nama}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '6px' }}>Jumlah Dibayar</div>
              <input type="number" value={jumlah} onChange={e => setJumlah(e.target.value)} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '12px', padding: '11px 12px', fontSize: '14px', fontWeight: 700, color: '#1C2B22', fontFamily: 'Space Grotesk, monospace', outline: 'none' }} />
              <p style={{ fontSize: '9px', color: '#A0B0A4', marginTop: '4px' }}>Minimal {fmt(selected?.nominal || 0)} · boleh lebih ✓</p>
            </div>
            <div>
              <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '6px' }}>Upload Bukti Transfer</div>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '90px', border: '2px dashed #E2D9C8', borderRadius: '12px', background: '#FBF8F3', cursor: 'pointer' }}>
                <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
                {file ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#2E7D52' }}>✓ {file.name}</div>
                    <div style={{ fontSize: '9px', color: '#A0B0A4', marginTop: '2px' }}>Tap untuk ganti</div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>📎</div>
                    <div style={{ fontSize: '10px', color: '#A0B0A4' }}>Tap untuk upload foto</div>
                    <div style={{ fontSize: '9px', color: '#A0B0A4' }}>JPG, PNG, PDF maks. 5MB</div>
                  </div>
                )}
              </label>
            </div>
            <button onClick={handleSubmit} disabled={!anggotaId || !file || !jumlah || submitting} style={{ width: '100%', padding: '13px', borderRadius: '12px', background: '#2E7D52', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: (!anggotaId || !file || !jumlah || submitting) ? 0.5 : 1, transition: 'opacity 0.15s' }}>
              {submitting ? 'Mengupload...' : 'Submit Bukti Pembayaran'}
            </button>
          </div>
        )}
      </BottomSheet>

      <BottomNav />
    </main>
  )
}
