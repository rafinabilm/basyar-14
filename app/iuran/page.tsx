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

function TagihanCard({ tagihan, onBayar, index }: { tagihan: any, onBayar: (t: any) => void, index: number }) {
  const { count, total } = usePembayaranCount(tagihan.id)
  const pct = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <Card style={{ animationDelay: `${index * 0.1}s`, borderLeft: '4px solid #6366F1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>{tagihan.judul}</div>
          {tagihan.batas_bayar && <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Deadline: {new Date(tagihan.batas_bayar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>}
        </div>
        <Pill label={tagihan.tipe === 'rutin' ? 'Rutin' : 'Event'} variant={tagihan.tipe === 'rutin' ? 'green' : 'accent'} />
      </div>
      
      <div style={{ position: 'relative', marginTop: '16px' }}>
        <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #4f46e5, #6366f1)', borderRadius: '4px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>
        <span style={{ position: 'absolute', right: 0, top: '-20px', fontSize: '11px', fontWeight: 800, color: '#6366F1', fontFamily: 'Space Grotesk, monospace' }}>{pct}%</span>
      </div>
      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px', fontWeight: 500 }}>{count} dari {total} orang sudah bayar</div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
        <span style={{ fontSize: '18px', fontWeight: 800, color: '#111827', fontFamily: 'Space Grotesk, monospace' }}>{fmt(tagihan.nominal)}</span>
        <button onClick={() => onBayar(tagihan)} style={{ background: '#6366F1', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}>
          Bayar
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
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px' }}>
        <PageHeader title="Iuran & Kas" subtitle="Pilih tagihan aktif untuk setor iuran." />
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF' }}>Tagihan Aktif</p>
          <div style={{ width: '40px', height: '1px', background: '#F3F4F6' }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat tagihan...</div>
        ) : tagihan.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '32px', height: '32px' }} strokeWidth={2}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
            title="Belum ada tagihan"
            description="Semua tagihan sudah terbayar atau belum ada tagihan baru."
          />
        ) : (
          tagihan.map((t, i) => <TagihanCard key={t.id} tagihan={t} onBayar={handleOpen} index={i} />)
        )}
      </div>

      <BottomSheet isOpen={!!selected} onClose={() => setSelected(null)} title="Konfirmasi Pembayaran" subtitle={selected?.judul}>
        {submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '48px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" style={{ width: '32px', height: '32px' }} strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ textAlign: 'center' }}>
               <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Bukti Terkirim!</div>
               <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Menunggu verifikasi dari bendahara.</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>Pilih Nama Anggota</div>
              <select 
                value={anggotaId} 
                onChange={e => setAnggotaId(e.target.value)} 
                style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '14px', padding: '14px', fontSize: '14px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none', appearance: 'none' }}
              >
                <option value="">Pilih namamu...</option>
                {anggota.map(a => <option key={a.id} value={a.id}>{a.nama}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>Jumlah Dibayar</div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#6366F1', fontSize: '14px' }}>Rp</span>
                <input 
                  type="number" 
                  value={jumlah} 
                  onChange={e => setJumlah(e.target.value)} 
                  style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '14px', padding: '14px 14px 14px 40px', fontSize: '18px', fontWeight: 800, color: '#111827', fontFamily: 'Space Grotesk, monospace', outline: 'none' }} 
                />
              </div>
              <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px', fontWeight: 500 }}>Sesuai nominal tagihan: {fmt(selected?.nominal || 0)}</p>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>Bukti Transfer</div>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '120px', border: '2px dashed #E5E7EB', borderRadius: '16px', background: '#F9FAFB', cursor: 'pointer', transition: 'all 0.2s' }}>
                <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
                {file ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#6366F1' }}>✓ Berhasil dipilih</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{file.name}</div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>📸</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#4B5563' }}>Upload Bukti Bayar</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>Format JPG, PNG atau PDF</div>
                  </div>
                )}
              </label>
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={!anggotaId || !file || !jumlah || submitting} 
              style={{ width: '100%', padding: '16px', borderRadius: '16px', background: '#6366F1', color: 'white', border: 'none', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', opacity: (!anggotaId || !file || !jumlah || submitting) ? 0.5 : 1, transition: 'all 0.2s' }}
            >
              {submitting ? 'Mengirim data...' : 'Konfirmasi Pembayaran'}
            </button>
          </div>
        )}
      </BottomSheet>

      <BottomNav />
    </main>
  )
}

