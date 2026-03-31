'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useRef } from 'react'

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Remove then re-add class to re-trigger animation
    el.classList.remove('page-transition-enter')
    // Force reflow
    void el.offsetHeight
    el.classList.add('page-transition-enter')
  }, [pathname])

  return (
    <div ref={ref} className="page-transition-enter">
      {children}
    </div>
  )
}
