'use client'

import { useState } from 'react'
import { Card } from '@/app/components/ui/Card'
import { insertTransaksi, updateTransaksi, TransaksiKas } from '@/app/hooks/useKas'
import { uploadFile } from '@/app/hooks/useUpload'

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

  const initialForm = {
    jenis: 'pengeluaran' as const,
    jumlah: '',
    keterangan: '',
    kategori: 'lainnya',
    tanggal: new Date().toISOString().split('T')[0],
  }

  const [form, setForm] = useState(
    editingTransaction
      ? {
          jenis: editingTransaction.jenis,
          jumlah: String(editingTransaction.jumlah),
          keterangan: editingTransaction.keterangan,
          kategori: editingTransaction.kategori,
          tanggal: editingTransaction.tanggal,
        }
      : initialForm
  )

  if (!isOpen) return null

  const handleSave = async () => {
    if (!form.jumlah || !form.keterangan) {
      showAlert('Mohon isi jumlah dan keterangan')
      return
    }
    setSaving(true)

    let foto_bukti_urls: string[] = existingBukti ? [existingBukti] : []

    // Upload all selected files
    if (files.length > 0) {
      const uploadedUrls: string[] = []
      for (const file of files) {
        const url = await uploadFile(file, 'basyar14/kas')
        if (url) uploadedUrls.push(url)
      }
      foto_bukti_urls = uploadedUrls.length > 0 ? uploadedUrls : foto_bukti_urls
    }

    const payload = {
      ...form,
      jumlah: parseInt(form.jumlah.replace(/\./g, '')),
      foto_bukti_urls,
    } as any

    let res
    if (editingTransaction) {
      res = await updateTransaksi(editingTransaction.id, payload)
    } else {
      res = await insertTransaksi(payload)
    }

    setSaving(false)
    if (res.error) {
      showAlert('Gagal: ' + res.error.message)
      return
    }

    onSuccess()
    handleClose()
  }

  const handleClose = () => {
    setForm(initialForm)
    setFiles([])
    setExistingBukti(null)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '100%',
          maxHeight: '90vh',
          background: 'white',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>
            {editingTransaction ? 'Edit Transaksi' : 'Catat Transaksi Baru'}
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#9CA3AF',
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
              {(['pengeluaran', 'pemasukan'] as const).map((j) => (
                <button
                  key={j}
                  onClick={() => setForm((p) => ({ ...p, jenis: j }))}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: form.jenis === j ? (j === 'pemasukan' ? '#ECFDF5' : '#FEF2F2') : '#F9FAFB',
                    border: form.jenis === j ? `2px solid ${j === 'pemasukan' ? '#10B981' : '#EF4444'}` : '1px solid #F3F4F6',
                    color: form.jenis === j ? (j === 'pemasukan' ? '#10B981' : '#EF4444') : '#6B7280',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {j}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>
              Tanggal
            </label>
            <input
              type="date"
              value={form.tanggal}
              onChange={(e) => setForm((p) => ({ ...p, tanggal: e.target.value }))}
              style={{
                width: '100%',
                background: '#F9FAFB',
                border: '1px solid #F3F4F6',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '13px',
                color: '#111827',
                fontFamily: 'Nunito, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          {/* Jumlah */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>
              Jumlah
            </label>
            <input
              type="text"
              placeholder="0"
              value={form.jumlah}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '')
                setForm((p) => ({ ...p, jumlah: raw ? new Intl.NumberFormat('id-ID').format(parseInt(raw)) : '' }))
              }}
              style={{
                width: '100%',
                background: '#F9FAFB',
                border: '1px solid #F3F4F6',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '13px',
                color: '#111827',
                fontFamily: 'Nunito, sans-serif',
                outline: 'none',
              }}
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
              onChange={(e) => setForm((p) => ({ ...p, keterangan: e.target.value }))}
              style={{
                width: '100%',
                background: '#F9FAFB',
                border: '1px solid #F3F4F6',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '13px',
                color: '#111827',
                fontFamily: 'Nunito, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          {/* Kategori */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', display: 'block', marginBottom: '8px' }}>
              Kategori
            </label>
            <select
              value={form.kategori}
              onChange={(e) => setForm((p) => ({ ...p, kategori: e.target.value }))}
              style={{
                width: '100%',
                background: '#F9FAFB',
                border: '1px solid #F3F4F6',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '13px',
                color: '#111827',
                fontFamily: 'Nunito, sans-serif',
                outline: 'none',
              }}
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
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80px',
                border: '2px dashed #6366F1',
                borderRadius: '14px',
                background: '#F5F7FF',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
              <div style={{ fontSize: '12px', color: '#6366F1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                {files.length > 0 ? (
                  <span>✓ {files.length} foto dipilih</span>
                ) : (
                  <span>📸 Upload Bukti - Bisa Lebih dari 1 Foto</span>
                )}
              </div>
            </label>

            {/* File list */}
            {files.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {files.map((file, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#EEF2FF', borderRadius: '8px', fontSize: '12px' }}>
                    <span style={{ color: '#4F46E5', fontWeight: 600 }}>{file.name}</span>
                    <button
                      onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 800 }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving || !form.jumlah || !form.keterangan}
            style={{
              width: '100%',
              padding: '14px',
              background: saving || !form.jumlah || !form.keterangan ? '#D1D5DB' : '#6366F1',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: saving || !form.jumlah || !form.keterangan ? 'not-allowed' : 'pointer',
              fontFamily: 'Nunito, sans-serif',
              marginTop: '8px',
            }}
          >
            {saving ? 'Menyimpan...' : editingTransaction ? 'Perbarui' : 'Catat Transaksi'}
          </button>
        </div>

        <style>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
