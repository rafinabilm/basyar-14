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
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FBF8F3', gap: '16px' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #D4EDDE', borderTopColor: '#2E7D52', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '12px', color: '#A0B0A4', fontFamily: 'Nunito, sans-serif' }}>Memverifikasi akses...</p>
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