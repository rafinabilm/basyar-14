'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { ImageViewer } from '@/app/components/ui/ImageViewer'
import { useKas, archiveTransaksi, TransaksiKas } from '@/app/hooks/useKas'
import { useDialog } from '@/app/providers/DialogProvider'
import { TransactionFormModal } from '@/app/components/admin/TransactionFormModal'
import { purgeAppCache } from '@/app/actions/cache'
import { useEffect } from 'react'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(n))
}

export default function AdminKasPage() {
  const { transaksi, saldo, totalMasuk, totalKeluar, loading, refetch } = useKas()
  const { showAlert, showConfirm } = useDialog()
  const router = useRouter()
  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [selectedTitle, setSelectedTitle] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<TransaksiKas | null>(null)
  const [visibleCount, setVisibleCount] = useState(10)

  useEffect(() => {
    // reset editing transaction when modal closes
    if (!isModalOpen) setEditingTransaction(null)
  }, [isModalOpen])

  async function handleArchive(id: string) {
    const conf = await showConfirm({ title: 'Arsipkan?', message: 'Data akan dipindahkan ke folder arsip (pembatalan). Lanjutkan?', isDestructive: true })
    if (!conf) return
    const { error } = await archiveTransaksi(id)
    if (error) showAlert('Gagal arsip: ' + error.message)
    else {
      showAlert('Transaksi berhasil diarsipkan')
      refetch()
      await purgeAppCache()
      router.refresh()
    }
  }

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageHeader title="Daftar Transaksi Kas" subtitle="Riwayat semua transaksi kas." />
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: '#F3F4F6',
              color: '#6B7280',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            ← Kembali
          </button>
        </Link>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Saldo Card */}
        <div className="animate-in" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 55%, #818cf8 100%)', padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Total Kas Saat Ini</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'white', fontFamily: 'Space Grotesk, monospace', letterSpacing: '-1.5px', marginBottom: '20px' }}>{fmt(saldo)}</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase' }}>Pemasukan</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#A7F3D0', fontFamily: 'Space Grotesk, monospace', marginTop: '2px' }}>{fmt(totalMasuk).replace('Rp', '').trim()}</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase' }}>Pengeluaran</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#FECACA', fontFamily: 'Space Grotesk, monospace', marginTop: '2px' }}>{fmt(totalKeluar).replace('Rp', '').trim()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Memuat data...</div>
        ) : transaksi.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '24px', height: '24px' }} strokeWidth={2.5}><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="9" /></svg>}
            title="Belum Ada Transaksi"
            description="Mulai catat transaksi pertama kamu dari dashboard."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transaksi.slice(0, visibleCount).map((t) => (
              <Card key={t.id} style={{ padding: '16px', border: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: t.jenis === 'pemasukan' ? '#ECFDF5' : '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={t.jenis === 'pemasukan' ? '#10B981' : '#EF4444'} style={{ width: '20px', height: '20px' }} strokeWidth={2.5}>
                        {t.jenis === 'pemasukan' ? <path d="M7 10l5 5 5-5" /> : <path d="M17 14l-5-5-5 5" />}
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>{t.keterangan}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>{new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: t.jenis === 'pemasukan' ? '#10B981' : '#EF4444', fontFamily: 'Space Grotesk, monospace' }}>
                      {t.jenis === 'pemasukan' ? '+' : '-'}{fmt(t.jumlah).replace('Rp', '').trim()}
                    </div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{t.jenis}</div>

                    {t.foto_bukti_urls && t.foto_bukti_urls.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedImages(t.foto_bukti_urls)
                          setSelectedTitle(t.keterangan)
                          setTimeout(() => setImageViewerOpen(true), 0)
                        }}
                        style={{ marginTop: '8px', padding: '4px 8px', borderRadius: '8px', background: '#F3F4F6', border: 'none', color: '#6366F1', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Lihat Bukti {t.foto_bukti_urls.length > 1 ? `(${t.foto_bukti_urls.length})` : ''}
                      </button>
                    )}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setEditingTransaction(t)
                          setIsModalOpen(true)
                        }}
                        style={{ padding: '4px 8px', borderRadius: '8px', background: '#EEF2FF', border: 'none', color: '#4F46E5', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleArchive(t.id)}
                        style={{ padding: '4px 8px', borderRadius: '8px', background: '#FEF2F2', border: 'none', color: '#EF4444', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Arsip
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {visibleCount < transaksi.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                style={{
                  marginTop: '12px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#F9FAFB',
                  color: '#4B5563',
                  border: '1px solid #E5E7EB',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Tampilkan Lebih Banyak
              </button>
            )}
          </div>
        )}
      </div>

      <ImageViewer
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        images={selectedImages}
        title="Bukti Transaksi"
        description={selectedTitle}
      />

      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch()
          showAlert('Transaksi berhasil diperbarui')
        }}
        editingTransaction={editingTransaction}
        showAlert={showAlert}
      />
    </main>
  )
}
