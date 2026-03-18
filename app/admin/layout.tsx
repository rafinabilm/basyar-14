'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { AdminNav } from '@/app/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login')
      else setLoading(false)
    })
  }, [isLoginPage, router])

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="w-8 h-8 border-2 border-[var(--acc)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {!isLoginPage && <AdminNav />}
      {children}
    </div>
  )
}
