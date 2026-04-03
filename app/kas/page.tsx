'use client'

import { useState } from 'react'
import { SaldoCard } from '@/app/components/ui/SaldoCard'
import { Card } from '@/app/components/ui/Card'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { ImageViewer } from '@/app/components/ui/ImageViewer'
import { useKas } from '@/app/hooks/useKas'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(n))
}

export default function KasPage() {
  const { transaksi, loading, saldo, totalMasuk, totalKeluar } = useKas()
  const [filter, setFilter] = useState<'semua' | 'pemasukan' | 'pengeluaran'>('semua')
  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [selectedTitle, setSelectedTitle] = useState('')
  const [visibleCount, setVisibleCount] = useState(10) 

  const handleFilterChange = (newFilter: 'semua' | 'pemasukan' | 'pengeluaran') => {
    setFilter(newFilter)
    setVisibleCount(10)
  }

  const filtered = transaksi.filter(t => filter === 'semua' ? true : t.jenis === filter)
  const visibleTransactions = filtered.slice(0, visibleCount)

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#111827', letterSpacing: '-1.5px', marginBottom: '8px' }}>Laporan Kas</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: 600 }}>Detail transaksi pemasukan dan pengeluaran.</p>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-in">
        
        {/* [MARK: Conditional render - Tampilkan Skeleton jika masih loading, cegah flash angka 0] */}
        {loading ? (
          <KasSkeleton />
        ) : (
          <>
            <SaldoCard saldo={saldo} masuk={totalMasuk} keluar={totalKeluar} />

            {/* Filter */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
               {(['semua', 'pemasukan', 'pengeluaran'] as const).map((f) => (
                 <button 
                   key={f}
                   onClick={() => handleFilterChange(f)}
                   style={{ 
                     padding: '8px 20px', 
                     borderRadius: '14px', 
                     background: filter === f ? '#6366F1' : 'white', 
                     color: filter === f ? 'white' : '#6B7280',
                     border: filter === f ? 'none' : '1px solid #F3F4F6',
                     fontSize: '13px',
                     fontWeight: 800,
                     cursor: 'pointer',
                     textTransform: 'capitalize',
                     whiteSpace: 'nowrap',
                     boxShadow: filter === f ? '0 10px 15px -3px rgba(99, 102, 241, 0.4)' : 'none'
                   }}
                 >
                   {f}
                 </button>
               ))}
            </div>

            {filtered.length === 0 ? (
              <EmptyState 
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '24px', height: '24px' }} strokeWidth={2.5}><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="9" /></svg>}
                title="Belum Ada Transaksi" 
                description="Filter yang kamu pilih tidak memiliki data apapun." 
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {visibleTransactions.map((t) => (
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
                        <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.status === 'archived' ? 'Arsip' : t.jenis}</div>
                        
                        {t.foto_bukti_urls && t.foto_bukti_urls.length > 0 && t.foto_bukti_urls[0] && t.foto_bukti_urls[0] !== "" && (
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
                      </div>
                    </div>
                  </Card>
                ))}
                
                {visibleCount < filtered.length && (
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 10)}
                    style={{
                      marginTop: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      background: '#F9FAFB',
                      color: '#4B5563',
                      border: '1px solid #E5E7EB',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Tampilkan Lebih Banyak
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <ImageViewer
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        images={selectedImages}
        title="Bukti Transaksi"
        description={selectedTitle}
      />
    </main>
  )
}

// [MARK: Komponen UI Skeleton untuk UX loading yang smooth]
function KasSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
      {/* Skeleton SaldoCard */}
      <div style={{ height: '180px', borderRadius: '24px', background: '#E5E7EB' }} />
      
      {/* Skeleton Filter */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ height: '36px', width: '80px', borderRadius: '14px', background: '#E5E7EB' }} />
        <div style={{ height: '36px', width: '100px', borderRadius: '14px', background: '#E5E7EB' }} />
        <div style={{ height: '36px', width: '100px', borderRadius: '14px', background: '#E5E7EB' }} />
      </div>

      {/* Skeleton List Transaksi */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ height: '80px', borderRadius: '16px', background: '#E5E7EB' }} />
        ))}
      </div>
    </div>
  )
}