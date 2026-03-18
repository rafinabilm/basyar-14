'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#2E7D52' : '#A0B0A4'} style={{ width: '20px', height: '20px' }} strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/admin/kas',
    label: 'Kas',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#2E7D52' : '#A0B0A4'} style={{ width: '20px', height: '20px' }} strokeWidth={2}>
        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    href: '/admin/iuran',
    label: 'Iuran',
    badge: true,
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#2E7D52' : '#A0B0A4'} style={{ width: '20px', height: '20px' }} strokeWidth={2}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: '/admin/anggota',
    label: 'Lainnya',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#2E7D52' : '#A0B0A4'} style={{ width: '20px', height: '20px' }} strokeWidth={2}>
        <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
      </svg>
    ),
  },
]

const LAINNYA_PATHS = ['/admin/anggota', '/admin/event', '/admin/galeri', '/admin/settings']

export function AdminNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin/anggota') return LAINNYA_PATHS.includes(pathname)
    if (href === '/admin') return pathname === '/admin'
    return pathname === href
  }

  return (
    <>
      {/* Admin Banner */}
      <div style={{ background: '#2E7D52', padding: '6px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '9px', fontFamily: 'monospace', color: 'white', letterSpacing: '1.5px', textTransform: 'uppercase' }}>⚙ Admin Mode</span>
        <Link href="/admin/settings" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontFamily: 'monospace' }}>Settings</Link>
      </div>

      {/* Bottom Nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', background: '#FFFFFF', borderTop: '1px solid #E2D9C8', zIndex: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 4px 20px' }}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '4px 12px', borderRadius: '10px', textDecoration: 'none', background: active ? '#EAF6EE' : 'transparent', position: 'relative' }}>
                {item.icon(active)}
                {item.badge && (
                  <div style={{ position: 'absolute', top: '2px', right: '8px', width: '10px', height: '10px', background: '#C0392B', borderRadius: '50%', border: '1.5px solid white', fontSize: '6px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</div>
                )}
                <span style={{ fontSize: '8px', fontWeight: 700, color: active ? '#2E7D52' : '#A0B0A4', fontFamily: 'Nunito, sans-serif' }}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
