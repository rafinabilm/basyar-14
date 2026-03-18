'use client'

import { useState } from 'react'
import { BottomNav } from '@/app/components/ui/BottomNav'
import { SaldoCard } from '@/app/components/ui/SaldoCard'
import { Card } from '@/app/components/ui/Card'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { useKas } from '@/app/hooks/useKas'

const FILTERS = ['Semua', 'Pemasukan', 'Pengeluaran', 'Iuran', 'Konsumsi']

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(n))
}

export default function KasPage() {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const { transaksi, saldo, totalMasuk, totalKeluar, loading } = useKas()

  const filtered = transaksi.filter(t => {
    if (activeFilter === 'Semua') return true
    if (activeFilter === 'Pemasukan') return t.jenis === 'pemasukan'
    if (activeFilter === 'Pengeluaran') return t.jenis === 'pengeluaran'
    return t.kategori.toLowerCase().includes(activeFilter.toLowerCase())
  })

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px' }}>
        <PageHeader title="Laporan Kas" />
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <SaldoCard saldo={saldo} masuk={totalMasuk} keluar={totalKeluar} />

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap', border: '1px solid', borderColor: activeFilter === f ? '#2E7D52' : '#E2D9C8', background: activeFilter === f ? '#2E7D52' : 'transparent', color: activeFilter === f ? 'white' : '#5A6E5E', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', transition: 'all 0.15s' }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#A0B0A4', fontSize: '12px' }}>Memuat...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="#2E7D52" style={{ width: '28px', height: '28px' }} strokeWidth={1.8}><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
            title="Belum ada transaksi"
            description="Transaksi kas akan muncul di sini."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(t => (
              <Card key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: t.jenis === 'pemasukan' ? '#EAF7EE' : '#EAF6EE', border: `1px solid ${t.jenis === 'pemasukan' ? '#B8E0C4' : '#D4EDDE'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={t.jenis === 'pemasukan' ? '#1E7B3A' : '#2E7D52'} style={{ width: '14px', height: '14px' }} strokeWidth={2.5}>
                      {t.jenis === 'pemasukan' ? <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></> : <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>}
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>{t.keterangan}</div>
                    <div style={{ fontSize: '9px', color: '#A0B0A4' }}>{t.kategori} · {new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    {t.foto_bukti_url && (
                      <a href={t.foto_bukti_url} target="_blank" rel="noreferrer" style={{ fontSize: '9px', fontWeight: 700, color: '#2E7D52', background: '#EAF6EE', padding: '2px 8px', borderRadius: '20px', marginTop: '3px', display: 'inline-block', textDecoration: 'none' }}>
                        Lihat Bukti
                      </a>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: t.jenis === 'pemasukan' ? '#1E7B3A' : '#C0392B', fontFamily: 'Space Grotesk, monospace', flexShrink: 0 }}>
                  {t.jenis === 'pemasukan' ? '+' : '-'}{fmt(t.jumlah)}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  )
}
