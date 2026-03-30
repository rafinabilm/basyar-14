'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Stats',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#6366F1' : '#9CA3AF'} style={{ width: '20px', height: '20px' }} strokeWidth={2.5}>
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/admin/kas',
    label: 'Kas',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#6366F1' : '#9CA3AF'} style={{ width: '20px', height: '20px' }} strokeWidth={2.5}>
        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    href: '/admin/iuran',
    label: 'Iuran',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#6366F1' : '#9CA3AF'} style={{ width: '20px', height: '20px' }} strokeWidth={2.5}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: '/admin/anggota',
    label: 'More',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#6366F1' : '#9CA3AF'} style={{ width: '20px', height: '20px' }} strokeWidth={3}>
        <circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="12" r="1.5" />
      </svg>
    ),
  },
]

const LAINNYA_PATHS = ['/admin/anggota', '/admin/event', '/admin/galeri', '/admin/settings']

export function AdminNav() {
  const pathname = usePathname()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    supabase
      .from('pembayaran_iuran')
      .select('id', { count: 'exact' })
      .eq('status', 'menunggu')
      .then(({ count }) => setPendingCount(count || 0))
  }, [])

  const isActiveTab = (href: string) => {
    if (href === '/admin/anggota') return LAINNYA_PATHS.includes(pathname)
    if (href === '/admin') return pathname === '/admin'
    return pathname === href
  }

  return (
    <>
      {/* Admin Banner */}
      <div style={{ 
        background: '#6366F1', 
        padding: '8px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(99, 102, 241, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, color: 'white', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk, monospace' }}>ADMIN MODE</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/" target="_blank" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', fontWeight: 800, textDecoration: 'none', fontFamily: 'Nunito, sans-serif' }}>Portal Publik ↗</Link>
          <Link href="/admin/settings" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', fontWeight: 800, textDecoration: 'none', fontFamily: 'Nunito, sans-serif' }}>Settings</Link>
        </div>
      </div>

      {/* Bottom Nav Admin */}
      <nav style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '100%', 
        maxWidth: '430px', 
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #F3F4F6', 
        zIndex: 30,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 6px 20px' }}>
          {NAV_ITEMS.map((item) => {
            const active = isActiveTab(item.href)
            const showBadge = item.label === 'Iuran' && pendingCount > 0
            return (
              <Link key={item.href} href={item.href} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '4px', 
                padding: '6px 14px', 
                borderRadius: '14px', 
                textDecoration: 'none', 
                background: active ? '#EEF2FF' : 'transparent', 
                position: 'relative',
                transition: 'all 0.2s'
              }}>
                <div style={{ 
                  transform: active ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s'
                }}>
                  {item.icon(active)}
                </div>
                {showBadge && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '2px', 
                    right: '10px', 
                    minWidth: '16px', 
                    height: '16px', 
                    background: '#EF4444', 
                    borderRadius: '8px', 
                    border: '2px solid white', 
                    fontSize: '8px', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 900, 
                    padding: '0 2px',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                  }}>
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </div>
                )}
                <span style={{ 
                  fontSize: '9px', 
                  fontWeight: active ? 800 : 600, 
                  color: active ? '#6366F1' : '#9CA3AF', 
                  fontFamily: 'Nunito, sans-serif' 
                }}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

