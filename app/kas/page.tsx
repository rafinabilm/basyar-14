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

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <SaldoCard saldo={saldo} masuk={totalMasuk} keluar={totalKeluar} />

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', margin: '0 -20px', paddingLeft: '20px', paddingRight: '20px' }}>
          {FILTERS.map((f, i) => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f)} 
              className="animate-in"
              style={{ 
                padding: '10px 20px', 
                borderRadius: '20px', 
                fontSize: '13px', 
                fontWeight: 700, 
                whiteSpace: 'nowrap', 
                border: '1px solid', 
                borderColor: activeFilter === f ? '#6366F1' : '#F3F4F6', 
                background: activeFilter === f ? '#6366F1' : '#FFFFFF', 
                color: activeFilter === f ? 'white' : '#6B7280', 
                cursor: 'pointer', 
                fontFamily: 'Nunito, sans-serif', 
                transition: 'all 0.2s',
                animationDelay: `${i * 0.05}s`
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat riwayat...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '32px', height: '32px' }} strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
            title="Belum ada transaksi"
            description="Transaksi kas akan muncul di sini setelah dicatat."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((t, i) => (
              <Card key={t.id} style={{ animationDelay: `${i * 0.05}s`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: t.jenis === 'pemasukan' ? '#ECFDF5' : '#FFF1F2', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0 
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={t.jenis === 'pemasukan' ? '#10B981' : '#EF4444'} style={{ width: '18px', height: '18px' }} strokeWidth={2.5}>
                      {t.jenis === 'pemasukan' ? <path d="M7 10l5 5 5-5" /> : <path d="M17 14l-5-5-5 5" />}
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{t.keterangan}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                      <span style={{ fontWeight: 600, color: '#6366F1' }}>{t.kategori}</span> · {new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    {t.foto_bukti_url && (
                      <a href={t.foto_bukti_url} target="_blank" rel="noreferrer" style={{ 
                        fontSize: '10px', 
                        fontWeight: 700, 
                        color: '#6366F1', 
                        background: '#EEF2FF', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        marginTop: '6px', 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        gap: '4px',
                        textDecoration: 'none' 
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '10px', height: '10px' }} strokeWidth={3}>
                          <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Lihat Bukti
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: t.jenis === 'pemasukan' ? '#10B981' : '#EF4444', fontFamily: 'Space Grotesk, monospace' }}>
                    {t.jenis === 'pemasukan' ? '+' : '-'}{fmt(t.jumlah).replace('Rp', '').trim()}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>
                    {t.jenis === 'pemasukan' ? 'In' : 'Out'}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
