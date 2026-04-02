'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/app/lib/supabase'
import { Card } from '@/app/components/ui/Card'

interface DashboardStats {
  totalAnggota: number
  saldoKas: number
  lunasiuran: number
  totalTagihanAktif: number
  eventAktif: number
  pendingVerifikasi: number
}

function fmtKas(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace('.', ',') + 'jt'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'rb'
  return String(n)
}

const QUICK_ACTIONS = [
  { label: 'Tambah Transaksi', href: '/admin/kas', icon: '+' },
  { label: 'Lihat Arsip', href: '/admin/kas#archive', icon: '📦' },
  { label: 'Verifikasi Iuran', href: '/admin/iuran', icon: '✓' },
  { label: 'Upload Foto', href: '/admin/galeri', icon: '📸' },
  { label: 'Buat Event', href: '/admin/event', icon: '📅' },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnggota: 0,
    saldoKas: 0,
    lunasiuran: 0,
    totalTagihanAktif: 0,
    eventAktif: 0,
    pendingVerifikasi: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const [
        { count: anggotaCount },
        { data: kasData },
        { count: lunasCount },
        { count: totalAnggotaForIuran },
        { data: events },
        { count: pendingCount },
      ] = await Promise.all([
        supabase.from('anggota').select('id', { count: 'exact' }),
        supabase.from('transaksi_kas').select('jenis, jumlah'),
        supabase.from('pembayaran_iuran').select('id', { count: 'exact' }).eq('status', 'lunas'),
        supabase.from('anggota').select('id', { count: 'exact' }),
        supabase.from('event').select('tanggal').gte('tanggal', new Date().toISOString().split('T')[0]),
        supabase.from('pembayaran_iuran').select('id', { count: 'exact' }).eq('status', 'menunggu'),
      ])

      const saldo = (kasData || []).reduce((acc: number, t: any) =>
        t.jenis === 'pemasukan' ? acc + t.jumlah : acc - t.jumlah, 0)

      setStats({
        totalAnggota: anggotaCount || 0,
        saldoKas: saldo,
        lunasiuran: lunasCount || 0,
        totalTagihanAktif: totalAnggotaForIuran || 0,
        eventAktif: (events || []).length,
        pendingVerifikasi: pendingCount || 0,
      })
      setLoading(false)
    }
    loadStats()
  }, [])

  const STATS = [
    { label: 'Total Anggota', value: loading ? '...' : String(stats.totalAnggota), unit: 'Org', icon: '👥' },
    { label: 'Saldo Kas', value: loading ? '...' : fmtKas(stats.saldoKas), unit: 'IDR', icon: '💰' },
    {
      label: 'Lunas Iuran',
      value: loading ? '...' : String(stats.lunasiuran),
      unit: `/${stats.totalAnggota}`,
      progress: stats.totalAnggota > 0 ? Math.round((stats.lunasiuran / stats.totalAnggota) * 100) : 0,
      icon: '📊'
    },
    { label: 'Event Aktif', value: loading ? '...' : String(stats.eventAktif), unit: 'Next', icon: '📅' },
  ]

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#6366F1', marginBottom: '4px' }}>Admin Portal</p>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-1px', lineHeight: 1 }}>Dashboard</h1>
          </div>
          {!loading && stats.pendingVerifikasi > 0 && (
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
               <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" style={{ width: '22px', height: '22px' }} strokeWidth={2.5}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
               </svg>
               <span style={{ position: 'absolute', top: '10px', right: '12px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', border: '2px solid #FFF1F2' }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Pending Verifikasi Alert */}
        {!loading && stats.pendingVerifikasi > 0 && (
          <Link href="/admin/iuran" style={{ textDecoration: 'none' }} className="animate-in">
            <div style={{ background: 'linear-gradient(135deg, #EF4444, #F43F5E)', borderRadius: '18px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 16px -4px rgba(239, 68, 68, 0.25)' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>{stats.pendingVerifikasi} Approval Pending</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '2px', fontWeight: 500 }}>Review setoran iuran anggota →</div>
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" style={{ width: '16px', height: '16px' }} strokeWidth={3}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </Link>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {STATS.map((s, i) => (
            <Card key={s.label} style={{ animationDelay: `${i * 0.05}s`, padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF' }}>{s.label}</div>
                <span style={{ fontSize: '12px' }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827', fontFamily: 'Space Grotesk, monospace', marginTop: '6px', letterSpacing: '-0.5px', lineHeight: 1 }}>
                {s.value}
                <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Nunito, sans-serif', marginLeft: '4px', fontWeight: 600 }}>{s.unit}</span>
              </div>
              {s.progress !== null && (
                <div style={{ height: '5px', background: '#F3F4F6', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.progress}%`, background: '#6366F1', borderRadius: '3px' }} />
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF' }}>Admin Tools</p>
            <div style={{ width: '40px', height: '1px', background: '#F3F4F6' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {QUICK_ACTIONS.map((a, i) => (
              <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }} className="animate-in">
                <Card style={{ animationDelay: `${(i + 4) * 0.05}s`, padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    {a.icon}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>{a.label}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

