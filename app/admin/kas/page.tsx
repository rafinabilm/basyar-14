'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { useKas, insertTransaksi } from '@/app/hooks/useKas'
import { uploadFile } from '@/app/hooks/useUpload'
import { useDialog } from '@/app/providers/DialogProvider'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(n))
}

export default function AdminKasPage() {
  const { transaksi, saldo, totalMasuk, totalKeluar, loading, refetch } = useKas()
  const { showAlert } = useDialog()
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ jenis: 'pengeluaran', jumlah: '', keterangan: '', kategori: 'lainnya', tanggal: new Date().toISOString().split('T')[0] })
  const [file, setFile] = useState<File | null>(null)

  async function handleSave() {
    if (!form.jumlah || !form.keterangan) return
    setSaving(true)
    let foto_bukti_url: string | undefined
    if (file) {
      const url = await uploadFile(file, 'basyar14/kas')
      if (url) foto_bukti_url = url
    }
    const { error } = await insertTransaksi({ ...form, jumlah: parseInt(form.jumlah), foto_bukti_url })
    setSaving(false)
    if (error) { showAlert('Gagal: ' + error.message); return }
    setShowForm(false)
    setForm({ jenis: 'pengeluaran', jumlah: '', keterangan: '', kategori: 'lainnya', tanggal: new Date().toISOString().split('T')[0] })
    setFile(null)
    refetch()
  }

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <PageHeader title="Kelola Kas" />
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', flexShrink: 0 }}>
          {showForm ? '× Tutup' : '+ Tambah'}
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Saldo */}
        <div style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #1a5c3a 0%, #2E7D52 55%, #3a9465 100%)', padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Saldo Kas</div>
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, monospace', letterSpacing: '-1px', marginBottom: '14px' }}>{fmt(saldo)}</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '12px' }} />
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', textTransform: 'uppercase' }}>Masuk</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#7FEBA1', fontFamily: 'Space Grotesk, monospace', marginTop: '2px' }}>{fmt(totalMasuk)}</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 14px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', textTransform: 'uppercase' }}>Keluar</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFB3A7', fontFamily: 'Space Grotesk, monospace', marginTop: '2px' }}>{fmt(totalKeluar)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Tambah Transaksi</div>
            {[
              { label: 'Tanggal', key: 'tanggal', type: 'date' },
              { label: 'Keterangan', key: 'keterangan', type: 'text' },
              { label: 'Jumlah (Rp)', key: 'jumlah', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '5px' }}>{f.label}</div>
                <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '5px' }}>Jenis</div>
              <select value={form.jenis} onChange={e => setForm(p => ({ ...p, jenis: e.target.value }))} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }}>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '5px' }}>Kategori</div>
              <select value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }}>
                <option value="iuran">Iuran</option>
                <option value="konsumsi">Konsumsi</option>
                <option value="hadiah_guru">Hadiah Guru</option>
                <option value="transportasi">Transportasi</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '72px', border: '2px dashed #E2D9C8', borderRadius: '10px', background: '#FBF8F3', cursor: 'pointer' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
              <span style={{ fontSize: '10px', color: file ? '#2E7D52' : '#A0B0A4', fontWeight: file ? 700 : 400 }}>{file ? `✓ ${file.name}` : '📎 Upload bukti (opsional)'}</span>
            </label>
            <button onClick={handleSave} disabled={saving || !form.jumlah || !form.keterangan} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#2E7D52', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: (saving || !form.jumlah || !form.keterangan) ? 0.5 : 1 }}>
              {saving ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </Card>
        )}

        {/* List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat...</div>
        ) : transaksi.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Belum ada transaksi. Tambahkan yang pertama!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transaksi.map(t => (
              <Card key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: t.jenis === 'pemasukan' ? '#EAF7EE' : '#EAF6EE', border: `1px solid ${t.jenis === 'pemasukan' ? '#B8E0C4' : '#D4EDDE'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={t.jenis === 'pemasukan' ? '#1E7B3A' : '#2E7D52'} style={{ width: '16px', height: '16px' }} strokeWidth={2.5}>
                      {t.jenis === 'pemasukan' ? <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></> : <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>}
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>{t.keterangan}</div>
                    <div style={{ fontSize: '9px', color: '#A0B0A4' }}>{new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    {t.foto_bukti_url && <a href={t.foto_bukti_url} target="_blank" rel="noreferrer" style={{ fontSize: '9px', fontWeight: 700, color: '#2E7D52', background: '#EAF6EE', padding: '2px 8px', borderRadius: '20px', display: 'inline-block', textDecoration: 'none', marginTop: '2px' }}>Bukti</a>}
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: t.jenis === 'pemasukan' ? '#1E7B3A' : '#C0392B', fontFamily: 'Space Grotesk, monospace' }}>
                  {t.jenis === 'pemasukan' ? '+' : '-'}{fmt(t.jumlah)}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
