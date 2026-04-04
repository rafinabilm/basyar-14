'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { insertTransaksi, updateTransaksi, TransaksiKas } from '@/app/hooks/useKas'
import { uploadFile } from '@/app/hooks/useUpload'
import { purgeAppCache } from '@/app/actions/cache'

interface TransactionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingTransaction?: TransaksiKas | null
  showAlert: (msg: string) => void
}

export function TransactionFormModal({
  isOpen,
  onClose,
  onSuccess,
  editingTransaction,
  showAlert,
}: TransactionFormModalProps) {
  const [saving, setSaving] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [existingBukti, setExistingBukti] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  type FormState = {
    jenis: 'pengeluaran' | 'pemasukan'
    jumlah: string
    keterangan: string
    kategori: string
    tanggal: string
  }

  const initialForm: FormState = {
    jenis: 'pengeluaran',
    jumlah: '',
    keterangan: '',
    kategori: 'lainnya',
    tanggal: new Date().toISOString().split('T')[0],
  }

  const [form, setForm] = useState<FormState>(initialForm)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        jenis: editingTransaction.jenis,
        jumlah: String(editingTransaction.jumlah),
        keterangan: editingTransaction.keterangan,
        kategori: editingTransaction.kategori,
        tanggal: editingTransaction.tanggal,
      })
      setExistingBukti(
        editingTransaction.foto_bukti_urls?.length > 0
          ? editingTransaction.foto_bukti_urls[0]
          : null
      )
    } else {
      setForm(initialForm)
      setExistingBukti(null)
    }
  }, [editingTransaction])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const handleSave = async () => {
    if (!form.jumlah || !form.keterangan) {
      showAlert('Mohon isi jumlah dan keterangan')
      return
    }
    setSaving(true)

    let foto_bukti_urls: string[] = existingBukti ? [existingBukti] : []

    if (files.length > 0) {
      const uploadedUrls: string[] = []
      for (const file of files) {
        const url = await uploadFile(file, 'basyar14/kas')
        if (url) uploadedUrls.push(url)
      }
      if (uploadedUrls.length > 0) foto_bukti_urls = uploadedUrls
    }

    const payload = {
      ...form,
      jumlah: parseInt(form.jumlah.replace(/\./g, '')),
      foto_bukti_urls,
    } as any

    const res = editingTransaction
      ? await updateTransaksi(editingTransaction.id, payload)
      : await insertTransaksi(payload)

    setSaving(false)
    if (res.error) {
      showAlert('Gagal: ' + res.error.message)
      return
    }

    await purgeAppCache()
    router.refresh()
    onSuccess()
    handleClose()
  }

  const handleClose = () => {
    setForm(initialForm)
    setFiles([])
    setExistingBukti(null)
    onClose()
  }

  const modal = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'tfmFadeIn 0.2s ease-out',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '92dvh',
          background: 'white',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px 40px',
          overflow: 'auto',
          animation: 'tfmSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{ width: '36px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', fontFamily: 'Space Grotesk, sans-serif' }}>
            {editingTransaction ? 'Edit Transaksi' : 'Catat Transaksi Baru'}
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: '#F3F4F6',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#6B7280',
              fontSize: '16px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Jenis */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>
              Jenis Transaksi
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {(['pengeluaran', 'pemasukan'] as const).map(j => (
                <button
                  key={j}
                  onClick={() => setForm(p => ({ ...p, jenis: j }))}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: form.jenis === j ? (j === 'pemasukan' ? '#ECFDF5' : '#FEF2F2') : '#F9FAFB',
                    border: form.jenis === j
                      ? `2px solid ${j === 'pemasukan' ? '#10B981' : '#EF4444'}`
                      : '1px solid #F3F4F6',
                    color: form.jenis === j ? (j === 'pemasukan' ? '#10B981' : '#EF4444') : '#6B7280',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontFamily: 'Nunito, sans-serif',
                  }}
                >
                  {j}
                </button>
              ))}
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>
              Tanggal
            </label>
            <input
              type="date"
              value={form.tanggal}
              onChange={e => setForm(p => ({ ...p, tanggal: e.target.value }))}
              style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }}
            />
          </div>

          {/* Jumlah */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>
              Jumlah
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={form.jumlah}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '')
                setForm(p => ({ ...p, jumlah: raw ? new Intl.NumberFormat('id-ID').format(parseInt(raw)) : '' }))
              }}
              style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '16px', fontWeight: 800, color: '#111827', fontFamily: 'Space Grotesk, monospace', outline: 'none' }}
            />
          </div>

          {/* Keterangan */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>
              Keterangan
            </label>
            <input
              type="text"
              placeholder="Gaji marbot, Beli konsumsi, dll"
              value={form.keterangan}
              onChange={e => setForm(p => ({ ...p, keterangan: e.target.value }))}
              style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }}
            />
          </div>

          {/* Kategori */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>
              Kategori
            </label>
            <select
              value={form.kategori}
              onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))}
              style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }}
            >
              <option value="lainnya">Lainnya</option>
              <option value="iuran">Iuran</option>
              <option value="donasi">Donasi</option>
            </select>
          </div>

          {/* File upload */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>
              Bukti Transfer (Opsional)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '72px', border: '2px dashed #6366F1', borderRadius: '14px', background: '#F5F7FF', cursor: 'pointer' }}>
              <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => setFiles(Array.from(e.target.files ?? []))} />
              <div style={{ fontSize: '12px', color: '#6366F1', fontWeight: 700 }}>
                {files.length > 0 ? `✓ ${files.length} foto dipilih` : '📸 Upload Bukti — bisa lebih dari 1 foto'}
              </div>
            </label>
            {files.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                {files.map((file, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#EEF2FF', borderRadius: '8px', fontSize: '12px' }}>
                    <span style={{ color: '#4F46E5', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{file.name}</span>
                    <button onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 800, flexShrink: 0 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || !form.jumlah || !form.keterangan}
            style={{
              width: '100%',
              padding: '15px',
              background: saving || !form.jumlah || !form.keterangan ? '#D1D5DB' : '#6366F1',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: saving || !form.jumlah || !form.keterangan ? 'not-allowed' : 'pointer',
              fontFamily: 'Nunito, sans-serif',
              marginTop: '4px',
              boxShadow: saving || !form.jumlah || !form.keterangan ? 'none' : '0 4px 12px rgba(99,102,241,0.25)',
            }}
          >
            {saving ? 'Menyimpan...' : editingTransaction ? 'Perbarui Transaksi' : 'Catat Transaksi'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tfmFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tfmSlideUp { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )

  return createPortal(modal, document.body)
}