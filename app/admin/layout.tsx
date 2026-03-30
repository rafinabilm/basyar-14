'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { AdminNav } from '@/app/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading')
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setStatus('auth')
      return
    }

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setStatus('auth')
        } else if (event === 'INITIAL_SESSION' && !session) {
          setStatus('unauth')
        } else if (event === 'SIGNED_OUT') {
          setStatus('unauth')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [isLoginPage, router])

  useEffect(() => {
    if (status === 'unauth') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading' && !isLoginPage) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', gap: '20px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #EEF2FF', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#9CA3AF', fontFamily: 'Nunito, sans-serif', letterSpacing: '0.5px' }}>Menyiapkan Dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div>
      {!isLoginPage && status === 'auth' && <AdminNav />}
      {children}
    </div>
  )
}