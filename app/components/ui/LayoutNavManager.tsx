'use client'

import { usePathname } from 'next/navigation'
import { BottomNav } from './BottomNav'
import { AdminNav } from '../admin/AdminNav'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

export function LayoutNavManager() {
  const pathname = usePathname()
  const [isAdminAuth, setIsAdminAuth] = useState(false)
  
  const isAdminPath = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Basic auth check for admin nav
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminAuth(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuth(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // If in admin path, show AdminNav only if authenticated and not on login page
  if (isAdminPath) {
    if (isLoginPage) return null
    if (!isAdminAuth) return null
    return <AdminNav />
  }

  // Otherwise show user BottomNav (except on auth pages if any)
  if (pathname.startsWith('/auth')) return null

  return <BottomNav />
}
