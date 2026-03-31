'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        style={{ width: '22px', height: '22px' }}
        strokeWidth={active ? 0 : 1.8}
      >
        <path
          d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={active ? 0 : 1.8}
        />
        <path
          d="M9 21V12h6v9"
          stroke={active ? 'rgba(255,255,255,0.5)' : 'currentColor'}
          strokeWidth={1.8}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    href: '/kas',
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
    href: '/iuran',
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
    href: '/galeri',
    label: 'Galeri',
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
        <rect x="3" y="3" width="18" height="18" rx="3" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} />
        <circle cx="8.5" cy="8.5" r="1.5" fill={active ? 'rgba(255,255,255,0.6)' : 'currentColor'} stroke="none" />
        <path
          d="M21 15l-5-5L5 21"
          stroke={active ? 'rgba(255,255,255,0.65)' : 'currentColor'}
          strokeWidth={1.8}
          fill="none"
        />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Match the exact route or potential sub-route
  const activeIndex = navItems.findIndex(item => (
    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
  ))

  const handleNav = useCallback((href: string) => {
    startTransition(() => {
      router.push(href)
    })
  }, [router])

  return (
    <>
      <style>{`
        .apple-nav {
          position: fixed;
          bottom: calc(20px + env(safe-area-inset-bottom, 0px));
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 48px);
          max-width: 380px;
          z-index: 9999;
        }

        .apple-nav-pill {
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
          width: calc((100% - 12px) / ${navItems.length});
          background: rgba(99, 102, 241, 0.12);
          border-radius: 24px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 0;
          pointer-events: none;
        }

        .apple-nav-item {
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

        .apple-nav-item:active {
          transform: scale(0.92);
        }

        .apple-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .apple-nav-item.active .apple-nav-icon {
          transform: scale(1.1) translateY(-1px);
        }

        .apple-nav-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.01em;
          transition: all 0.3s;
        }

        .apple-nav-item.active .apple-nav-label {
          font-weight: 700;
        }

        .apple-nav-pill.pending {
          opacity: 0.7;
        }
      `}</style>

      <nav className="apple-nav" aria-label="Navigasi utama">
        <div className={`apple-nav-pill${isPending ? ' pending' : ''}`}>
          <div 
            className="active-slider"
            style={{ 
              transform: `translateX(calc(${activeIndex >= 0 ? activeIndex : 0} * 100%))` 
            }}
          />
          {navItems.map((item, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={item.href}
                className={`apple-nav-item${isActive ? ' active' : ''}`}
                style={{ color: isActive ? '#6366F1' : '#94a3b8' }}
                onClick={() => handleNav(item.href)}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="apple-nav-icon">
                  {item.icon(isActive)}
                </div>
                <span className="apple-nav-label">
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
