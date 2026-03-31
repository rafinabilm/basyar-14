'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Stats',
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        style={{ width: '22px', height: '22px' }}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
      </svg>
    ),
  },
  {
    href: '/admin/kas',
    label: 'Kas',
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        style={{ width: '22px', height: '22px' }}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="5" width="20" height="14" rx="3" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
        <line x1="2" y1="10" x2="22" y2="10" stroke={active ? 'rgba(255,255,255,0.5)' : 'currentColor'} strokeWidth={1.8} />
        <line x1="6" y1="15" x2="9" y2="15" stroke={active ? 'rgba(255,255,255,0.5)' : 'currentColor'} strokeWidth={1.8} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/admin/iuran',
    label: 'Iuran',
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        style={{ width: '22px', height: '22px' }}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
        <path
          d="M12 7v1.5m0 7V17m2.5-7.5a2.5 2.5 0 0 0-5 0c0 1.5 1 2 2.5 2.5S15 13.5 15 15a2.5 2.5 0 0 1-5 0"
          stroke={active ? 'rgba(255,255,255,0.65)' : 'currentColor'}
          strokeWidth={1.6}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: '/admin/anggota',
    label: 'More',
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        style={{ width: '22px', height: '22px' }}
        strokeWidth={2}
        strokeLinecap="round"
      >
        <circle cx="5" cy="12" r="1.5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
        <circle cx="12" cy="12" r="1.5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
        <circle cx="19" cy="12" r="1.5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
      </svg>
    ),
  },
]

const LAINNYA_PATHS = ['/admin/anggota', '/admin/event', '/admin/galeri', '/admin/settings']

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
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

  const activeIndex = NAV_ITEMS.findIndex(item => isActiveTab(item.href))

  const handleNav = useCallback((href: string) => {
    startTransition(() => {
      router.push(href)
    })
  }, [router])

  return (
    <>
      <style>{`
        .admin-nav {
          position: fixed;
          bottom: calc(20px + env(safe-area-inset-bottom, 0px));
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 48px);
          max-width: 380px;
          z-index: 9999;
        }

        .admin-nav-pill {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 
            0 10px 25px -5px rgba(0, 0, 0, 0.1),
            0 8px 10px -6px rgba(0, 0, 0, 0.1);
          padding: 6px;
        }

        .active-slider {
          position: absolute;
          top: 6px;
          bottom: 6px;
          left: 6px;
          width: calc((100% - 12px) / ${NAV_ITEMS.length});
          background: rgba(99, 102, 241, 0.12);
          border-radius: 24px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
          z-index: 0;
          pointer-events: none;
        }

        .admin-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          flex: 1;
          padding: 8px 0;
          border-radius: 24px;
          text-decoration: none;
          transition: color 0.3s;
          position: relative;
          -webkit-tap-highlight-color: transparent;
          min-width: 0;
          cursor: pointer;
          border: none;
          background: transparent;
          z-index: 1;
        }

        .admin-nav-item:active {
          transform: scale(0.92);
        }

        .admin-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .admin-nav-item.active .admin-nav-icon {
          transform: scale(1.1) translateY(-1px);
        }

        .admin-nav-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.01em;
          transition: all 0.3s;
        }

        .admin-nav-item.active .admin-nav-label {
          font-weight: 700;
        }

        .admin-badge {
          position: absolute;
          top: -4px;
          right: -6px;
          min-width: 14px;
          height: 14px;
          background: #ff3b30;
          border-radius: 50%;
          border: 2px solid white;
          font-size: 8px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }
      `}</style>

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

      {/* Bottom Nav Admin — Frosted Glass Pill */}
      <nav className="admin-nav" aria-label="Navigasi admin">
        <div className={`admin-nav-pill${isPending ? ' pending' : ''}`}>
          <div 
            className="active-slider"
            style={{ 
              transform: `translateX(calc(${activeIndex >= 0 ? activeIndex : 0} * 100%))`,
              opacity: activeIndex >= 0 ? 1 : 0
            }}
          />
          {NAV_ITEMS.map((item, idx) => {
            const active = idx === activeIndex
            const showBadge = item.label === 'Iuran' && pendingCount > 0
            return (
              <button
                key={item.href}
                className={`admin-nav-item${active ? ' active' : ''}`}
                style={{ color: active ? '#6366F1' : '#94a3b8' }}
                onClick={() => handleNav(item.href)}
                aria-current={active ? 'page' : undefined}
              >
                <div className="admin-nav-icon">
                  {item.icon(active)}
                  {showBadge && (
                    <div className="admin-badge">
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </div>
                  )}
                </div>
                <span className="admin-nav-label">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
