'use client'

import { useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { useAllPembayaran, verifikasiPembayaran } from '@/app/hooks/useIuran'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

export default function AdminIuranPage() {
  const { pembayaran, loading, refetch } = useAllPembayaran()
  const [verifying, setVerifying] = useState<string | null>(null)

  const menunggu = pembayaran.filter(p => p.status === 'menunggu')

  async function handleVerifikasi(id: string) {
    setVerifying(id)
    const { error } = await verifikasiPembayaran(id)
    if (error) alert('Gagal verifikasi: ' + error.message)
    else refetch()
    setVerifying(null)
  }

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <PageHeader title="Kelola Iuran" />
        <button style={{ background: '#2E7D52', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', flexShrink: 0 }}>
          + Tagihan
        </button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
