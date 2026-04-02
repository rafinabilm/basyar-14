'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/app/components/ui/Card'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { useTagihan, useAnggota, submitPembayaran } from '@/app/hooks/useIuran'
import { uploadFile } from '@/app/hooks/useUpload'
import { useDialog } from '@/app/providers/DialogProvider'
import { supabase } from '@/app/lib/supabase'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function IuranPage() {
  const { tagihan, loading } = useTagihan()
  const { anggota } = useAnggota()
  const { showAlert } = useDialog()
  
  // Form States
  const [selectedTagihanId, setSelectedTagihanId] = useState<string>('donasi')
  const [anggotaId, setAnggotaId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [jumlah, setJumlah] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rekening, setRekening] = useState<{bank_name?: string, account_number?: string, account_name?: string} | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('value').eq('key', 'rekening_tujuan').single().then(({ data }) => {
      if (data && data.value) setRekening(data.value)
    })
  }, [])

  const handleCopy = () => {
    if (rekening?.account_number) {
      navigator.clipboard.writeText(rekening.account_number)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Filtered members based on searchTerm
  const filteredAnggota = searchTerm.trim() === '' 
    ? anggota 
    : anggota.filter(a => a.nama.toLowerCase().includes(searchTerm.toLowerCase()))

  // Function to handle choosing a member
  const handleSelectMember = (id: string, nama: string) => {
    setAnggotaId(id)
    setSearchTerm(nama)
    setIsMenuOpen(false)
  }

  // Helper to format thousand separator
  const formatIDR = (val: string) => {
    const raw = val.replace(/\D/g, '')
    if (!raw) return ''
    return new Intl.NumberFormat('id-ID').format(parseInt(raw))
  }

  // Handle Tagihan selection change
  useEffect(() => {
    if (selectedTagihanId === 'donasi') {
      setJumlah('')
    } else {
      const selected = tagihan.find(t => t.id === selectedTagihanId)
      if (selected) setJumlah(formatIDR(String(selected.nominal)))
    }
  }, [selectedTagihanId, tagihan])

  async function handleSubmit() {
    // Strip dots before parsing
    const rawJumlah = jumlah.replace(/\./g, '')
    
    if (!anggotaId || files.length === 0 || !rawJumlah) {
      showAlert('Mohon lengkapi semua data dan bukti transfer (minimal 1 foto).')
      return
    }
    setSubmitting(true)

    const uploadedUrls: string[] = []
    for (const file of files) {
      const url = await uploadFile(file, 'basyar14/iuran')
      if (url) uploadedUrls.push(url)
    }
    
    if (uploadedUrls.length === 0) { 
      setSubmitting(false)
      showAlert('Gagal upload foto bukti.')
      return 
    }

    const { error } = await submitPembayaran({
      anggota_id: anggotaId,
      tagihan_id: selectedTagihanId === 'donasi' ? (null as any) : selectedTagihanId,
      jumlah_bayar: parseInt(rawJumlah),
      foto_bukti_urls: uploadedUrls,
    })

    setSubmitting(false)
    if (error) { showAlert('Gagal mengirim data: ' + error.message); return }
    
    setSubmitted(true)
    // Clear form after success
    setTimeout(() => {
       setSubmitted(false)
       setAnggotaId('')
       setSearchTerm('')
       setJumlah('')
       setFiles([])
       setSelectedTagihanId('donasi')
    }, 4000)
  }

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px' }}>
        <PageHeader title="Iuran & Kas" subtitle="Formulir pembayaran iuran dan donasi mandiri." />
      </div>

      <div style={{ padding: '0 20px' }} className="animate-in">
        {submitted ? (
          <Card style={{ padding: '48px 24px', textAlign: 'center', border: '2px solid #10B981', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" style={{ width: '40px', height: '40px' }} strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>Laporan Terkirim!</h2>
            <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.5 }}>Terima kasih, laporan pembayaranmu sedang diproses oleh bendahara.</p>
            <button onClick={() => setSubmitted(false)} style={{ marginTop: '12px', padding: '12px 24px', borderRadius: '14px', background: '#F3F4F6', border: 'none', color: '#4B5563', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>Kirim Lagi</button>
          </Card>
        ) : (
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', borderRadius: '28px' }}>
            {/* Field: Jenis Iuran */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>Pilih Jenis Iuran / Tagihan</div>
              <div style={{ position: 'relative' }}>
                <select 
                  value={selectedTagihanId} 
                  onChange={e => setSelectedTagihanId(e.target.value)} 
                  style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '16px', padding: '16px', fontSize: '15px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none', appearance: 'none', fontWeight: 700 }}
                >
                  <option value="donasi">✨ Donasi Mandiri / Kas Umum</option>
                  {loading ? (
                     <option disabled>Memuat tagihan...</option>
                  ) : tagihan.map(t => (
                    <option key={t.id} value={t.id}>📋 {t.judul} ({fmt(t.nominal)})</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: '#F3F4F6' }} />

            {/* Field: Nama Anggota (Searchable) */}
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>Nama Anggota</div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  placeholder="Ketik namamu..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setAnggotaId('')
                    setIsMenuOpen(true)
                  }}
                  onFocus={() => setIsMenuOpen(true)}
                  style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '16px', padding: '16px', fontSize: '15px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none', fontWeight: 700 }} 
                />
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                   {loading ? (
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>...</div>
                   ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                   )}
                </div>
              </div>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <>
                  <div 
                    onClick={() => setIsMenuOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
                  />
                  <div style={{ 
                    position: 'absolute', 
                    top: 'calc(100% + 4px)', 
                    left: 0, 
                    right: 0, 
                    background: 'white', 
                    borderRadius: '16px', 
                    boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04)', 
                    maxHeight: '240px', 
                    overflowY: 'auto', 
                    zIndex: 50,
                    border: '1px solid #F3F4F6',
                    padding: '8px'
                  }}>
                    {filteredAnggota.length === 0 ? (
                      <div style={{ padding: '16px', fontSize: '13px', color: '#9CA3AF', textAlign: 'center' }}>Nama tidak ditemukan</div>
                    ) : (
                      filteredAnggota.map(a => (
                        <div 
                          key={a.id} 
                          onClick={() => handleSelectMember(a.id, a.nama)}
                          style={{ 
                            padding: '12px 16px', 
                            borderRadius: '10px', 
                            fontSize: '14px', 
                            fontWeight: 700, 
                            color: '#111827', 
                            cursor: 'pointer',
                            background: anggotaId === a.id ? '#F5F3FF' : 'transparent',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = anggotaId === a.id ? '#F5F3FF' : 'transparent')}
                        >
                          {a.nama}
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
              
              <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px', padding: '0 4px', lineHeight: 1.4, fontWeight: 600 }}>
                <span style={{ fontWeight: 800, color: '#4F46E5' }}>💡 Nama tidak terdaftar?</span> Silakan hubungi admin di WhatsApp untuk sinkronisasi data anggota.
              </p>
            </div>

            {/* Field: Nominal */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>Jumlah Yang Dibayar</div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#6366F1', fontSize: '16px' }}>Rp</span>
                <input 
                  type="text" 
                  inputMode="numeric"
                  placeholder="0"
                  value={jumlah} 
                  onChange={e => setJumlah(formatIDR(e.target.value))} 
                  style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '16px', padding: '16px 16px 16px 44px', fontSize: '20px', fontWeight: 900, color: '#111827', fontFamily: 'Space Grotesk, monospace', outline: 'none' }} 
                />
              </div>
            </div>

            {/* Tampilan Rekening Tujuan */}
            {rekening && rekening.bank_name && (
              <div style={{ background: '#EEF2FF', border: '1px solid #E0E7FF', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#6366F1' }}>Transfer Ke Sini</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>{rekening.bank_name}</span>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#4F46E5', fontFamily: 'Space Grotesk, monospace', letterSpacing: '1px', marginTop: '2px' }}>{rekening.account_number}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', marginTop: '2px' }}>a.n {rekening.account_name}</span>
                  </div>
                  <button 
                    onClick={handleCopy}
                    style={{ background: copied ? '#10B981' : '#6366F1', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {copied ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px' }} strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
                        Tersalin
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '14px', height: '14px' }} strokeWidth={2.5}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                        Salin Rekening
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Field: Bukti Transfer */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '8px' }}>Bukti Transfer</div>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '140px', border: '2px dashed #E5E7EB', borderRadius: '20px', background: '#F9FAFB', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => setFiles(Array.from(e.target.files ?? []))} />
                {files.length > 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', width: '100%' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>✓ {files.length} Foto</div>
                    <div style={{ fontSize: '13px', color: '#6366F1', fontWeight: 700, marginBottom: '12px' }}>File dipilih</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                      {files.map((f, idx) => (
                        <div key={idx} style={{ fontSize: '10px', color: '#9CA3AF', background: '#EEF2FF', padding: '6px 10px', borderRadius: '6px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.name}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '12px' }}>Klik untuk mengganti file</div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>📸</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#4B5563' }}>Upload Bukti Bayar</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>Lampirkan screenshot transfer kamu (bisa lebih dari 1 foto)</div>
                  </div>
                )}
              </label>
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={!anggotaId || files.length === 0 || !jumlah || submitting} 
              style={{ 
                width: '100%', 
                padding: '18px', 
                borderRadius: '18px', 
                background: '#6366F1', 
                color: 'white', 
                border: 'none', 
                fontSize: '16px', 
                fontWeight: 800, 
                cursor: 'pointer', 
                fontFamily: 'Nunito, sans-serif', 
                boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)', 
                opacity: (!anggotaId || files.length === 0 || !jumlah || submitting) ? 0.6 : 1, 
                transition: 'all 0.2s',
                marginTop: '10px'
              }}
            >
              {submitting ? '♻️ Mengirim data...' : '🚀 Lapor Pembayaran'}
            </button>
          </Card>
        )}
      </div>
    </main>
  )
}
