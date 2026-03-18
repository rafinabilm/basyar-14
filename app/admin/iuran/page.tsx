'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { useAllPembayaran, verifikasiPembayaran, useAllTagihan } from '@/app/hooks/useIuran'
import { supabase } from '@/app/lib/supabase'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function AdminIuranPage() {
  const { pembayaran, loading: pembLoading, refetch: refetchPembayaran } = useAllPembayaran()
  const { tagihan, loading: tagihanLoading, refetch: refetchTagihan } = useAllTagihan()
  
  const [tab, setTab] = useState<'pembayaran'|'tagihan'>('pembayaran')
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
  const [editId, setEditId] = useState<string | null>(null)

  const menunggu = pembayaran.filter(p => p.status === 'menunggu')

  async function handleVerifikasi(id: string) {
    setVerifying(id)
    const { error } = await verifikasiPembayaran(id)
    if (error) alert('Gagal verifikasi: ' + error.message)
    else refetchPembayaran()
    setVerifying(null)
  }

  function handleTutupForm() {
    setShowForm(false)
    setEditId(null)
    setForm({ judul: '', nominal: '', tipe: 'rutin', batas_bayar: '', visibilitas: 'publik' })
  }

  function handleEditTagihan(t: any) {
    setForm({
      judul: t.judul,
      nominal: t.nominal.toString(),
      tipe: t.tipe,
      batas_bayar: t.batas_bayar || '',
      visibilitas: t.visibilitas,
    })
    setEditId(t.id)
    setShowForm(true)
    setTab('tagihan')
  }

  async function handleHapusTagihan(t: any) {
    if (!confirm(`Hapus tagihan "${t.judul}"?\n\nPerhatian: Jika sudah ada yang mentransfer untuk tagihan ini, tagihan tidak bisa dihapus.`)) return
    
    // Optimistic / Simple Delete
    const { error } = await supabase.from('tagihan').delete().eq('id', t.id)
    if (error) {
      alert('Gagal menghapus tagihan. Pastikan tidak ada pembayaran pada tagihan ini (Anda bisa mengarsipkan/menutup dengan mengganti ke Visibilitas Privat).')
    } else {
      refetchTagihan()
      alert('Tagihan terhapus!')
    }
  }

  async function handleSimpanTagihan() {
    if (!form.judul || !form.nominal) return
    setSaving(true)
    
    let error;
    if (editId) {
      const res = await supabase.from('tagihan').update({
        judul: form.judul,
        nominal: parseInt(form.nominal),
        tipe: form.tipe,
        batas_bayar: form.batas_bayar || null,
        visibilitas: form.visibilitas,
      }).eq('id', editId)
      error = res.error
    } else {
      const res = await supabase.from('tagihan').insert([{
        judul: form.judul,
        nominal: parseInt(form.nominal),
        tipe: form.tipe,
        batas_bayar: form.batas_bayar || null,
        visibilitas: form.visibilitas,
      }])
      error = res.error
    }

    setSaving(false)
    if (error) { alert('Gagal: ' + error.message); return }
    handleTutupForm()
    refetchTagihan()
    setTab('tagihan') // Pindah otomatis biar kelihatan
    alert(editId ? 'Tagihan berhasil diupdate!' : 'Tagihan berhasil ditambahkan!')
  }

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <PageHeader title="Kelola Iuran" />
        <button onClick={() => showForm ? handleTutupForm() : setShowForm(true)} style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', flexShrink: 0 }}>
          {showForm ? '× Tutup' : '+ Tagihan'}
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* TAB Beli Navigasi */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2D9C8', paddingBottom: '2px', marginBottom: '4px' }}>
          <button onClick={() => setTab('pembayaran')} style={{ flex: 1, padding: '8px', background: 'transparent', border: 'none', borderBottom: tab === 'pembayaran' ? '2px solid #2E7D52' : '2px solid transparent', color: tab === 'pembayaran' ? '#1C2B22' : '#A0B0A4', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
            Bukti Bayar {menunggu.length > 0 && <span style={{ background: '#C0392B', color: 'white', padding: '1px 5px', borderRadius: '10px', fontSize: '9px', marginLeft: '4px' }}>{menunggu.length}</span>}
          </button>
          <button onClick={() => setTab('tagihan')} style={{ flex: 1, padding: '8px', background: 'transparent', border: 'none', borderBottom: tab === 'tagihan' ? '2px solid #2E7D52' : '2px solid transparent', color: tab === 'tagihan' ? '#1C2B22' : '#A0B0A4', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
            Master Tagihan
          </button>
        </div>

        {/* Form Tambah Tagihan */}
        {showForm && (
          <Card style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B22' }}>{editId ? 'Edit Tagihan' : 'Tambah Tagihan Baru'}</div>
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
                <option value="privat">Privat (Hanya Admin / Tutup Tagihan)</option>
              </select>
            </div>
            <button onClick={handleSimpanTagihan} disabled={saving || !form.judul || !form.nominal} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#2E7D52', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: (saving || !form.judul || !form.nominal) ? 0.5 : 1 }}>
              {saving ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Simpan Tagihan Baru')}
            </button>
          </Card>
        )}

        {/* TAMPILAN TAB PEMBAYARAN */}
        {tab === 'pembayaran' && (
          <>
            {menunggu.length > 0 && (
              <div style={{ background: '#FFFBEB', border: '1px solid #E5C04A', borderRadius: '14px', padding: '12px 14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#B8860B' }}>⏳ {menunggu.length} Pembayaran Menunggu Verifikasi</div>
              </div>
            )}

            {pembLoading ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat...</div>
            ) : pembayaran.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Belum ada pembayaran masuk.</div>
            ) : (
              pembayaran.map((p) => (
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
          </>
        )}

        {/* TAMPILAN TAB TAGIHAN */}
        {tab === 'tagihan' && (
          <>
            {tagihanLoading ? (
               <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat data tagihan...</div>
            ) : tagihan.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Belum ada master tagihan yang dibuat. Tekan tombol + Tagihan di atas.</div>
            ) : (
               tagihan.map(t => (
                 <Card key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22' }}>{t.judul}</div>
                     <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                        <span style={{ fontSize: '9px', background: '#F5F0E8', color: '#5A6E5E', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>
                          {t.tipe === 'rutin' ? 'Rutin' : 'Sekali'}
                        </span>
                        <span style={{ fontSize: '9px', background: t.visibilitas === 'publik' ? '#EAF7EE' : '#FEE2E2', color: t.visibilitas === 'publik' ? '#1E7B3A' : '#C0392B', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>
                          {t.visibilitas === 'publik' ? 'Vis: Publik' : 'Vis: Privat'}
                        </span>
                     </div>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                     <div style={{ fontSize: '14px', fontWeight: 700, color: '#2E7D52', fontFamily: 'Space Grotesk, monospace' }}>
                       {fmt(t.nominal)}
                     </div>
                     <div style={{ display: 'flex', gap: '4px' }}>
                       <button onClick={() => handleEditTagihan(t)} style={{ background: '#EAF6EE', color: '#2E7D52', border: 'none', padding: '4px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                       <button onClick={() => handleHapusTagihan(t)} style={{ background: '#FEE2E2', color: '#C0392B', border: 'none', padding: '4px 8px', borderRadius: '12px', fontSize: '9px', fontWeight: 700, cursor: 'pointer' }}>Hapus</button>
                     </div>
                   </div>
                 </Card>
               ))
            )}
          </>
        )}
      </div>
    </main>
  )
}
