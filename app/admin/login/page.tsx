'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError('Gagal login. Coba lagi.')
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100dvh', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>

      {/* Hero — full top half */}
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)',
        padding: '80px 32px 64px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '60px', transform: 'rotate(45deg)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '120px', height: '120px', background: 'rgba(255,255,255,0.08)', borderRadius: '40px', transform: 'rotate(-15deg)' }} />

        {/* Logo */}
        <div className="animate-in" style={{
          width: '92px', height: '92px', borderRadius: '28px',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 1,
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
        }}>
          <span style={{ fontSize: '38px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>⚡</span>
        </div>

        {/* Title */}
        <div className="animate-in" style={{ textAlign: 'center', position: 'relative', zIndex: 1, animationDelay: '0.1s' }}>
          <div style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.7)', fontFamily: 'Space Grotesk, monospace', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Al-Hamid Portal
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 900, color: 'white', letterSpacing: '-1.5px', lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
            Basyar-14
          </h1>
          <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '20px', padding: '6px 16px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontSize: '11px', color: 'white', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="animate-in" style={{ flex: 1, padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: '28px', animationDelay: '0.2s' }}>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#111827', letterSpacing: '-0.5px', fontFamily: 'Space Grotesk, sans-serif' }}>
            Selamat Datang
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px', lineHeight: 1.6, fontWeight: 500 }}>
            Gunakan akun Google yang telah<br />terverifikasi sebagai pengurus.
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            background: 'white',
            border: '2px solid #F3F4F6',
            borderRadius: '20px',
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827', fontFamily: 'Nunito, sans-serif' }}>
            {loading ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}
          </span>
        </button>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '16px', padding: '14px 20px', fontSize: '13px', color: '#EF4444', textAlign: 'center', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* Info box */}
        <div style={{ background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '20px', padding: '18px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '8px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '12px' }}>🔒</span>
          </div>
          <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
            Akses ke halaman ini diaudit secara berkala. Hanya pengurus terdaftar yang diizinkan masuk.
          </p>
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#9CA3AF', lineHeight: 1.7, fontWeight: 500 }}>
            Dikelola secara terbatas oleh Admin Basyar-14.<br />
            Kembali ke <a href="/" style={{ color: '#6366F1', fontWeight: 800, textDecoration: 'none' }}>Portal Utama</a>
          </p>
        </div>

      </div>
    </main>
  )
}