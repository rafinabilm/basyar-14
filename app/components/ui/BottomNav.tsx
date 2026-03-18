'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#2E7D52' : '#A0B0A4'} style={{ width: '20px', height: '20px' }} strokeWidth={2}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/kas',
    label: 'Kas',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#2E7D52' : '#A0B0A4'} style={{ width: '20px', height: '20px' }} strokeWidth={2}>
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    href: '/iuran',
    label: 'Iuran',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#2E7D52' : '#A0B0A4'} style={{ width: '20px', height: '20px' }} strokeWidth={2}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: '/galeri',
    label: 'Galeri',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? '#2E7D52' : '#A0B0A4'} style={{ width: '20px', height: '20px' }} strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      background: '#FFFFFF',
      borderTop: '1px solid #E2D9C8',
      zIndex: 30,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 4px 20px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '4px 12px',
                borderRadius: '10px',
                textDecoration: 'none',
                background: isActive ? '#EAF6EE' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              {item.icon(isActive)}
              <span style={{
                fontSize: '8px',
                fontWeight: 700,
                color: isActive ? '#2E7D52' : '#A0B0A4',
                fontFamily: 'Nunito, sans-serif',
              }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
