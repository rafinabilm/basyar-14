'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { Pill } from '@/app/components/ui/Pill'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { ImageViewer } from '@/app/components/ui/ImageViewer'
import { useAllPembayaran, verifikasiPembayaran, rejectPembayaranIuran, useAllTagihan } from '@/app/hooks/useIuran'
import { supabase } from '@/app/lib/supabase'
import { useDialog } from '@/app/providers/DialogProvider'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function AdminIuranPage() {
  const { pembayaran, loading: pembLoading, refetch: refetchPembayaran } = useAllPembayaran()
  const { tagihan, loading: tagihanLoading, refetch: refetchTagihan } = useAllTagihan()
  const { showAlert, showConfirm } = useDialog()
  
  const [tab, setTab] = useState<'pembayaran'|'tagihan'>('pembayaran')
  const [verifying, setVerifying] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [selectedTitle, setSelectedTitle] = useState('')
  const [form, setForm] = useState({
    judul: '',
    nominal: '',
    tipe: 'rutin',
    batas_bayar: '',
    visibilitas: 'publik',
  })
  const [editId, setEditId] = useState<string | null>(null)

  const menunggu = pembayaran.filter(p => p.status === 'menunggu')

  const [rekening, setRekening] = useState({ bank_name: '', account_number: '', account_name: '' })
  const [savingRekening, setSavingRekening] = useState(false)
  const [showRekeningForm, setShowRekeningForm] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('value').eq('key', 'rekening_tujuan').single().then(({ data }) => {
      if (data && data.value) {
        setRekening(data.value)
      }
    })
  }, [])

  async function handleSaveRekening() {
    if (!rekening.bank_name || !rekening.account_number || !rekening.account_name) {
      showAlert('Mohon isi semua field rekening yang dibutuhkan.')
      return
    }
    setSavingRekening(true)
    const { error } = await supabase.from('settings').upsert({
      key: 'rekening_tujuan',
      value: rekening
    })
    setSavingRekening(false)
    if (error) {
      showAlert('Gagal menyimpan: ' + error.message)
    } else {
      showAlert('Pengaturan rekening pembayaran berhasil disimpan!')
      setShowRekeningForm(false)
    }
  }

  async function handleVerifikasi(id: string) {
    setVerifying(id)
    const { error } = await verifikasiPembayaran(id)
    if (error) showAlert('Gagal verifikasi: ' + error.message)
    else refetchPembayaran()
    setVerifying(null)
  }

  async function handleReject(id: string, namaAnggota: string) {
    const isConfirmed = await showConfirm({
      title: 'Tolak Pembayaran',
      message: `Tolak pembayaran dari ${namaAnggota}? Mereka dapat mengirim ulang bukti pembayaran.`,
      isDestructive: true
    })
    if (!isConfirmed) return

    setRejecting(id)
    const { error } = await rejectPembayaranIuran(id)
    if (error) showAlert('Gagal menolak: ' + error.message)
    else {
      refetchPembayaran()
      showAlert('Pembayaran berhasil ditolak')
    }
    setRejecting(null)
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
    const isConfirmed = await showConfirm({
      title: 'Hapus Tagihan',
      message: `Anda yakin ingin menghapus tagihan "${t.judul}"?\n\nPerhatian: Jika sudah ada yang mentransfer untuk tagihan ini, aksi penghapusan akan ditolak.`,
      isDestructive: true
    })
    if (!isConfirmed) return
    
    const { error } = await supabase.from('tagihan').delete().eq('id', t.id)
    if (error) {
      showAlert({ title: 'Gagal Menghapus', message: 'Terdapat data pembayaran pada tagihan ini. Harap ubah visibilitas menjadi Privat untuk menutup tagihan.' })
    } else {
      refetchTagihan()
      showAlert('Tagihan terhapus!')
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
    if (error) { showAlert('Gagal: ' + error.message); return }
    handleTutupForm()
    refetchTagihan()
    setTab('tagihan')
    showAlert(editId ? 'Tagihan berhasil diupdate!' : 'Tagihan berhasil ditambahkan!')
  }

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageHeader title="Kelola Iuran" subtitle="Verifikasi setoran & master tagihan." />
        <button 
          onClick={() => showForm ? handleTutupForm() : setShowForm(true)} 
          style={{ 
            background: showForm ? '#F3F4F6' : '#6366F1', 
            color: showForm ? '#6B7280' : 'white', 
            border: 'none', 
            borderRadius: '12px', 
            padding: '10px 18px', 
            fontSize: '13px', 
            fontWeight: 800, 
            cursor: 'pointer', 
            fontFamily: 'Nunito, sans-serif', 
            flexShrink: 0,
            boxShadow: showForm ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.2)',
            transition: 'all 0.2s'
          }}
        >
          {showForm ? 'Batal' : '+ Tagihan'}
        </button>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Settings Rekening Pembayaran */}
        <div className="animate-in" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '20px', border: '1px solid #EEF2FF', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>Tujuan Pembayaran User</div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                {rekening.bank_name ? `${rekening.bank_name} - ${rekening.account_number} (a.n ${rekening.account_name})` : 'Belum dikonfigurasi'}
              </div>
            </div>
            <button 
              onClick={() => setShowRekeningForm(!showRekeningForm)} 
              style={{ padding: '8px 16px', borderRadius: '12px', background: showRekeningForm ? '#F3F4F6' : '#EEF2FF', color: showRekeningForm ? '#6B7280' : '#4F46E5', fontWeight: 800, fontSize: '12px', border: 'none', cursor: 'pointer', flexShrink: 0 }}
            >
              {showRekeningForm ? 'Batal' : 'Ubah Info'}
            </button>
          </div>
          
          {showRekeningForm && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Penyedia Layanan / Bank</div>
                <input type="text" placeholder="Cth: Bank Mandiri / DANA / BCA" value={rekening.bank_name} onChange={(e) => setRekening(p => ({ ...p, bank_name: e.target.value }))} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: 'Nunito, sans-serif' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                 <div>
                   <div style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Nomor Rekening / HP</div>
                   <input type="text" placeholder="Cth: 12345678" value={rekening.account_number} onChange={(e) => setRekening(p => ({ ...p, account_number: e.target.value }))} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: 'Nunito, sans-serif' }} />
                 </div>
                 <div>
                   <div style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Atas Nama</div>
                   <input type="text" placeholder="Cth: Budi Santoso" value={rekening.account_name} onChange={(e) => setRekening(p => ({ ...p, account_name: e.target.value }))} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: 'Nunito, sans-serif' }} />
                 </div>
              </div>
              <button 
                onClick={handleSaveRekening} 
                disabled={savingRekening || !rekening.bank_name || !rekening.account_number || !rekening.account_name} 
                style={{ marginTop: '8px', padding: '14px', borderRadius: '14px', background: '#6366F1', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: savingRekening ? 0.6 : 1 }}
              >
                {savingRekening ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="animate-in" style={{ display: 'flex', gap: '12px', background: '#F9FAFB', padding: '6px', borderRadius: '16px' }}>
          <button 
            onClick={() => setTab('pembayaran')} 
            style={{ 
              flex: 1, 
              padding: '10px', 
              background: tab === 'pembayaran' ? 'white' : 'transparent', 
              border: 'none', 
              borderRadius: '12px', 
              color: tab === 'pembayaran' ? '#6366F1' : '#9CA3AF', 
              fontWeight: 800, 
              fontSize: '13px', 
              cursor: 'pointer', 
              fontFamily: 'Nunito, sans-serif',
              boxShadow: tab === 'pembayaran' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            Approval {menunggu.length > 0 && <span style={{ background: '#EF4444', color: 'white', padding: '2px 7px', borderRadius: '8px', fontSize: '10px' }}>{menunggu.length}</span>}
          </button>
          <button 
            onClick={() => setTab('tagihan')} 
            style={{ 
              flex: 1, 
              padding: '10px', 
              background: tab === 'tagihan' ? 'white' : 'transparent', 
              border: 'none', 
              borderRadius: '12px', 
              color: tab === 'tagihan' ? '#6366F1' : '#9CA3AF', 
              fontWeight: 800, 
              fontSize: '13px', 
              cursor: 'pointer', 
              fontFamily: 'Nunito, sans-serif',
              boxShadow: tab === 'tagihan' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Master Tagihan
          </button>
        </div>

        {/* Form Editor Tagihan */}
        {showForm && (
          <Card className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '2px solid #EEF2FF' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>{editId ? 'Update Tagihan' : 'Buat Tagihan Baru'}</div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Judul Tagihan</div>
              <input type="text" placeholder="Contoh: Kas Maret 2024" value={form.judul} onChange={e => setForm(p => ({ ...p, judul: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '14px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Nominal (Rp)</div>
                <input type="number" value={form.nominal} onChange={e => setForm(p => ({ ...p, nominal: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '16px', fontWeight: 800, color: '#111827', fontFamily: 'Space Grotesk, monospace', outline: 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Batas Bayar</div>
                <input type="date" value={form.batas_bayar} onChange={e => setForm(p => ({ ...p, batas_bayar: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Tipe Tagihan</div>
                <select value={form.tipe} onChange={e => setForm(p => ({ ...p, tipe: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }}>
                  <option value="rutin">Rutin (Bulanan)</option>
                  <option value="per_acara">Event (Sekali)</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Visibilitas</div>
                <select value={form.visibilitas} onChange={e => setForm(p => ({ ...p, visibilitas: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }}>
                  <option value="publik">Publik</option>
                  <option value="privat">Privat (Hidden)</option>
                </select>
              </div>
            </div>
            <button onClick={handleSimpanTagihan} disabled={saving || !form.judul || !form.nominal} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#6366F1', color: 'white', border: 'none', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', opacity: (saving || !form.judul || !form.nominal) ? 0.5 : 1 }}>
              {saving ? 'Proses menyimpan...' : (editId ? 'Update Tagihan' : 'Simpan Tagihan Baru')}
            </button>
          </Card>
        )}

        {/* Content Tab: Approval Pembayaran */}
        {tab === 'pembayaran' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pembLoading ? (
              <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat data setoran...</div>
            ) : pembayaran.length === 0 ? (
              <EmptyState 
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '32px', height: '32px' }} strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /><polyline points="9 11 12 14 22 4" /></svg>}
                title="Belum ada setoran"
                description="Semua bukti bayar dari anggota akan muncul di sini."
              />
            ) : (
              pembayaran.map((p, i) => (
                <Card key={p.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>{p.anggota?.nama || 'Unknown'}</span>
                        <Pill 
                          label={p.status === 'menunggu' ? 'Pending' : p.status === 'lunas' ? 'Lunas' : 'Ditolak'} 
                          variant={p.status === 'menunggu' ? 'accent' : p.status === 'lunas' ? 'green' : 'err'} 
                        />
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>{p.tagihan?.judul || 'Tagihan Tanpa Judul'}</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#6366F1', fontFamily: 'Space Grotesk, monospace', marginTop: '8px' }}>
                        {fmt(p.jumlah_bayar)}
                        {p.tagihan && p.jumlah_bayar > p.tagihan.nominal && (
                          <span style={{ fontSize: '11px', color: '#10B981', marginLeft: '8px', fontWeight: 800 }}>(+{fmt(p.jumlah_bayar - p.tagihan.nominal)})</span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', fontWeight: 500 }}>{new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', marginLeft: '12px' }}>
                      {p.status === 'menunggu' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                           <button 
                            onClick={() => handleVerifikasi(p.id)} 
                            disabled={verifying === p.id} 
                            style={{ 
                              fontSize: '12px', 
                              fontWeight: 800, 
                              background: '#6366F1', 
                              color: 'white', 
                              border: 'none', 
                              padding: '8px 16px', 
                              borderRadius: '10px', 
                              cursor: 'pointer', 
                              fontFamily: 'Nunito, sans-serif',
                              boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
                              opacity: verifying === p.id ? 0.6 : 1,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {verifying === p.id ? 'Loading...' : 'Verifikasi'}
                          </button>
                          <button 
                            onClick={() => handleReject(p.id, p.anggota?.nama || 'Anggota')} 
                            disabled={rejecting === p.id} 
                            style={{ 
                              fontSize: '12px', 
                              fontWeight: 800, 
                              background: '#FEE2E2', 
                              color: '#DC2626', 
                              border: 'none', 
                              padding: '8px 16px', 
                              borderRadius: '10px', 
                              cursor: 'pointer', 
                              fontFamily: 'Nunito, sans-serif',
                              opacity: rejecting === p.id ? 0.6 : 1,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {rejecting === p.id ? 'Loading...' : 'Tolak'}
                          </button>
                          {p.foto_bukti_urls && p.foto_bukti_urls.length > 0 && (
                             <button 
                              onClick={() => {
                                setSelectedImages(p.foto_bukti_urls)
                                setSelectedTitle(`${p.anggota?.nama || 'Pembayaran'} - Rp${p.jumlah_bayar.toLocaleString('id-ID')}`)
                                setTimeout(() => setImageViewerOpen(true), 0)
                              }}
                              style={{ 
                                fontSize: '11px', 
                                fontWeight: 800, 
                                background: '#EEF2FF', 
                                color: '#6366F1', 
                                padding: '8px 16px', 
                                borderRadius: '10px', 
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'center'
                              }}
                            >
                               Cek Bukti {p.foto_bukti_urls.length > 1 ? `(${p.foto_bukti_urls.length})` : ''}
                             </button>
                          )}
                        </div>
                      ) : (
                        p.foto_bukti_urls && p.foto_bukti_urls.length > 0 && (
                           <button 
                            onClick={() => {
                              setSelectedImages(p.foto_bukti_urls)
                              setSelectedTitle(`${p.anggota?.nama || 'Pembayaran'} - Rp${p.jumlah_bayar.toLocaleString('id-ID')}`)
                              setTimeout(() => setImageViewerOpen(true), 0)
                            }}
                            style={{ 
                              fontSize: '11px', 
                              fontWeight: 800, 
                              background: '#F9FAFB', 
                              color: '#9CA3AF', 
                              padding: '6px 12px', 
                              borderRadius: '8px', 
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Lihat Bukti {p.foto_bukti_urls.length > 1 ? `(${p.foto_bukti_urls.length})` : ''}
                           </button>
                        )
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Content Tab: Master Tagihan */}
        {tab === 'tagihan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tagihanLoading ? (
               <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat master tagihan...</div>
            ) : tagihan.length === 0 ? (
               <EmptyState
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '32px', height: '32px' }} strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>}
                title="Master tagihan kosong"
                description="Buat tagihan baru agar anggota bisa mulai membayar."
               />
            ) : (
               tagihan.map((t, i) => (
                 <Card key={t.id} style={{ animationDelay: `${i * 0.05}s`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #6366F1' }}>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>{t.judul}</div>
                     <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <Pill label={t.tipe === 'rutin' ? 'Rutin' : 'Event'} variant={t.tipe === 'rutin' ? 'green' : 'accent'} />
                        <span style={{ fontSize: '10px', background: t.visibilitas === 'publik' ? '#EEF2FF' : '#FFF1F2', color: t.visibilitas === 'publik' ? '#6366F1' : '#EF4444', padding: '2px 10px', borderRadius: '20px', fontWeight: 800, textTransform: 'uppercase' }}>
                          {t.visibilitas}
                        </span>
                     </div>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', marginLeft: '12px' }}>
                     <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827', fontFamily: 'Space Grotesk, monospace' }}>
                       {fmt(t.nominal).replace('Rp', '').trim()}
                     </div>
                     <div style={{ display: 'flex', gap: '6px' }}>
                       <button onClick={() => handleEditTagihan(t)} style={{ background: '#F3F4F6', color: '#4B5563', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Edit</button>
                       <button onClick={() => handleHapusTagihan(t)} style={{ background: '#FFF1F2', color: '#EF4444', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Hapus</button>
                     </div>
                   </div>
                 </Card>
               ))
            )}
          </div>
        )}
      </div>

      <ImageViewer
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        images={selectedImages}
        title="Bukti Pembayaran"
        description={selectedTitle}
      />
    </main>
  )
}

