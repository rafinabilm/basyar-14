'use client'

import { useEffect, useState } from 'react'
import { useDialog } from '@/app/providers/DialogProvider'
import { restoreTransaksi, deletePermanently, getArchivedKas } from '@/app/hooks/useKas'
import { Card } from '@/app/components/ui/Card'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Pill } from '@/app/components/ui/Pill'
import Link from 'next/link'

interface ArchivedTransaction {
  id: string
  tanggal: string
  jenis: 'pemasukan' | 'pengeluaran'
  keterangan: string
  jumlah: number
  kategori: string
  foto_bukti_url: string | null
}

export default function ArsipPage() {
  const { showAlert, showConfirm } = useDialog()
  
  const [archived, setArchived] = useState<ArchivedTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchArchived()
  }, [])

  async function fetchArchived() {
    setLoading(true)
    const { data, error } = await getArchivedKas()
    if (error) {
      showAlert('Gagal memuat arsip: ' + error.message)
    } else {
      setArchived(data || [])
    }
    setLoading(false)
  }

  async function handleRestore(id: string, keterangan: string) {
    const conf = await showConfirm({ 
      title: 'Kembalikan Transaksi?', 
      message: `Transaksi "${keterangan}" akan dikembalikan ke daftar aktif.`,
    })
    if (!conf) return
    
    setRestoring(id)
    const { error } = await restoreTransaksi(id)
    setRestoring(null)
    
    if (error) {
      showAlert('Gagal dikembalikan: ' + error.message)
    } else {
      showAlert('Transaksi berhasil dikembalikan')
      fetchArchived()
    }
  }

  async function handleDelete(id: string, keterangan: string) {
    const conf = await showConfirm({ 
      title: 'Hapus Permanen?', 
      message: `Transaksi "${keterangan}" akan dihapus selamanya. Tindakan ini tidak bisa dibatalkan.`,
      isDestructive: true,
    })
    if (!conf) return
    
    setDeleting(id)
    const { error } = await deletePermanently(id)
    setDeleting(null)
    
    if (error) {
      showAlert('Gagal dihapus: ' + error.message)
    } else {
      showAlert('Transaksi berhasil dihapus permanen')
      fetchArchived()
    }
  }

  const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)

  return (
    <main style={{ paddingBottom: '120px' }}>
      <PageHeader title="Arsip Transaksi" subtitle="Transaksi yang sudah diarsipkan" />
      
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#9CA3AF', fontSize: '14px' }}>Memuat data...</div>
        ) : archived.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📦</div>
            <div style={{ color: '#6B7280', fontSize: '14px' }}>Tidak ada transaksi yang diarsipkan</div>
            <Link href="/admin/kas" style={{ display: 'inline-block', marginTop: '16px', color: '#6366F1', fontSize: '13px', fontWeight: 800, textDecoration: 'none' }}>
              Kembali ke Kas
            </Link>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {archived.map(tx => (
              <Card key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#6B7280' }}>
                      {new Date(tx.tanggal).toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <Pill variant={tx.jenis === 'pemasukan' ? 'green' : 'warn'} label={tx.jenis === 'pemasukan' ? 'Masuk' : 'Keluar'} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{tx.keterangan}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Kategori: {tx.kategori}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: tx.jenis === 'pemasukan' ? '#10B981' : '#EF4444' }}>
                    {tx.jenis === 'pemasukan' ? '+' : '-'}{fmt(tx.jumlah).replace('Rp', '').trim()}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleRestore(tx.id, tx.keterangan)}
                      disabled={restoring === tx.id}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#DBEAFE',
                        color: '#0284C7',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: restoring === tx.id ? 'not-allowed' : 'pointer',
                        opacity: restoring === tx.id ? 0.5 : 1,
                      }}
                    >
                      {restoring === tx.id ? 'Memproses...' : 'Kembalikan'}
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id, tx.keterangan)}
                      disabled={deleting === tx.id}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#FEE2E2',
                        color: '#EF4444',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: deleting === tx.id ? 'not-allowed' : 'pointer',
                        opacity: deleting === tx.id ? 0.5 : 1,
                      }}
                    >
                      {deleting === tx.id ? 'Menghapus...' : 'Hapus'}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
