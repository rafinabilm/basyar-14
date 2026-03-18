'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { useAllPembayaran, verifikasiPembayaran } from '@/app/hooks/useIuran'
import { supabase } from '@/app/lib/supabase'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function AdminIuranPage() {
  const { pembayaran, loading, refetch } = useAllPembayaran()
  const [verifying, setVerifying] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    judul: '',
    nominal: '',
    tipe: 'rutin',
    batas_bayar: '',
    visibilitas: 'publik',
  })

  const menunggu = pembayaran.filter(p => p.status === 'menunggu')

  async function handleVerifikasi(id: string) {
    setVerifying(id)
    const { error } = await verifikasiPembayaran(id)
    if (error) alert('Gagal verifikasi: ' + error.message)
    else refetch()
    setVerifying(null)
  }

  async function handleTambahTagihan() {
    if (!form.judul || !form.nominal) return
    setSaving(true)
    const { error } = await supabase.from('tagihan').insert([{
      judul: form.judul,
      nominal: parseInt(form.nominal),
      tipe: form.tipe,
      batas_bayar: form.batas_bayar || null,
      visibilitas: form.visibilitas,
    }])
    setSaving(false)
    if (error) { alert('Gagal: ' + error.message); return }
    setShowForm(false)
    setForm({ judul: '', nominal: '', tipe: 'rutin', batas_bayar: '', visibilitas: 'publik' })
    alert('Tagihan berhasil ditambahkan!')
  }

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <PageHeader title="Kelola Iuran" />
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', flexShrink: 0 }}>
          {showForm ? '× Tutup' : '+ Tagihan'}
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Form Tambah Tagihan */}
        {showForm && (
          <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>Tambah Tagihan Baru</div>
            {[
              { label: 'Judul Tagihan', key: 'judul', type: 'text', placeholder: 'Iuran Bulan Maret' },
              { label: 'Nominal (Rp)', key: 'nominal', type: 'number', placeholder: '50000' },
              { label: 'Batas Bayar (opsional)', key: 'batas_bayar', type: 'date', placeholder: '' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '5px' }}>{f.label}</div>
                <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '5px' }}>Tipe</div>
              <select value={form.tipe} onChange={e => setForm(p => ({ ...p, tipe: e.target.value }))} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }}>
                <option value="rutin">Rutin</option>
                <option value="per_acara">Per Acara</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '5px' }}>Visibilitas</div>
              <select value={form.visibilitas} onChange={e => setForm(p => ({ ...p, visibilitas: e.target.value }))} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }}>
                <option value="publik">Publik</option>
                <option value="privat">Privat (hanya admin)</option>
              </select>
            </div>
            <button onClick={handleTambahTagihan} disabled={saving || !form.judul || !form.nominal} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#2E7D52', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: (saving || !form.judul || !form.nominal) ? 0.5 : 1 }}>
              {saving ? 'Menyimpan...' : 'Simpan Tagihan'}
            </button>
          </Card>
        )}

        {menunggu.length > 0 && (
          <div style={{ background: '#FFFBEB', border: '1px solid #E5C04A', borderRadius: '14px', padding: '12px 14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#B8860B' }}>⏳ {menunggu.length} Pembayaran Menunggu Verifikasi</div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat...</div>
        ) : pembayaran.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Belum ada pembayaran masuk.</div>
        ) : (
          pembayaran.map(p => (
            <Card key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22' }}>{p.anggota?.nama || 'Anggota'}</div>
                  <div style={{ fontSize: '10px', color: '#A0B0A4', marginTop: '2px' }}>{p.tagihan?.judul || 'Tagihan'}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#2E7D52', fontFamily: 'Space Grotesk, monospace', marginTop: '4px' }}>
                    {fmt(p.jumlah_bayar)}
                    {p.tagihan && p.jumlah_bayar > p.tagihan.nominal && (
                      <span style={{ fontSize: '10px', color: '#1E7B3A', marginLeft: '6px' }}>(+{fmt(p.jumlah_bayar - p.tagihan.nominal)})</span>
                    )}
                  </div>
                  <div style={{ fontSize: '9px', color: '#A0B0A4', marginTop: '2px' }}>{new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: p.status === 'menunggu' ? '#FFFBEB' : '#EAF7EE', color: p.status === 'menunggu' ? '#B8860B' : '#1E7B3A' }}>
                    {p.status === 'menunggu' ? 'Menunggu' : 'Lunas'}
                  </span>
                  {p.status === 'menunggu' && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleVerifikasi(p.id)} disabled={verifying === p.id} style={{ fontSize: '10px', fontWeight: 700, background: '#EAF7EE', color: '#1E7B3A', border: 'none', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: verifying === p.id ? 0.6 : 1 }}>
                        {verifying === p.id ? '...' : '✓ Verif'}
                      </button>
                      {p.foto_bukti_url && (
                        <a href={p.foto_bukti_url} target="_blank" rel="noreferrer" style={{ fontSize: '10px', fontWeight: 700, background: '#EAF6EE', color: '#2E7D52', padding: '5px 10px', borderRadius: '20px', textDecoration: 'none' }}>
                          Bukti
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
