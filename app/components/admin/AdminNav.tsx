'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/admin/kas',
    label: 'Kas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-5 h-5">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    href: '/admin/iuran',
    label: 'Iuran',
    badge: 3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-5 h-5">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: '/admin/anggota',
    label: 'Lainnya',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-5 h-5">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    ),
  },
]

export function AdminNav() {
  const pathname = usePathname()
  const isLainnya = !['/admin', '/admin/kas', '/admin/iuran'].includes(pathname)

  return (
    <>
      {/* Admin Banner */}
      <div className="bg-[var(--acc)] px-4 py-1.5 flex justify-between items-center">
        <span className="text-[9px] font-mono text-white tracking-widest uppercase">⚙ Admin Mode</span>
        <Link href="/admin/settings" className="text-[9px] text-white/70 font-mono">Settings</Link>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[var(--bord)] z-30">
        <div className="flex justify-around items-center px-2 py-2 pb-6">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/admin/anggota'
              ? isLainnya
              : pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl relative"
              >
                <span style={{ color: isActive ? 'var(--acc)' : 'var(--mut)' }}>
                  {item.icon}
                </span>
                {item.badge && (
                  <span className="absolute top-0 right-2 w-3 h-3 bg-[var(--err)] rounded-full border border-white text-[6px] text-white flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
                <span
                  className="text-[8px] font-bold"
                  style={{ color: isActive ? 'var(--acc)' : 'var(--mut)' }}
                >
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
