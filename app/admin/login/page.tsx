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
    <main style={{ minHeight: '100dvh', background: '#FBF8F3', display: 'flex', flexDirection: 'column' }}>

      {/* Hero — full top half */}
      <div style={{
        background: 'linear-gradient(160deg, #1a5c3a 0%, #2E7D52 55%, #3a9465 100%)',
        padding: '60px 32px 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '130px', height: '130px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '30px', left: '20px', width: '60px', height: '60px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />

        {/* Logo */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          border: '2px solid rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 1,
        }}>
          <span style={{ fontSize: '32px' }}>🕌</span>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            Pondok Pesantren Al-Hamid
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', letterSpacing: '-1px', lineHeight: 1, fontFamily: 'Space Grotesk, monospace' }}>
            Basyar-14
          </h1>
          <div style={{ marginTop: '8px', display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '4px 14px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div style={{ background: 'linear-gradient(160deg, #1a5c3a 0%, #2E7D52 55%, #3a9465 100%)', height: '30px', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', background: '#FBF8F3', borderRadius: '24px 24px 0 0' }} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '32px 24px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.3px' }}>
            Selamat Datang
          </h2>
          <p style={{ fontSize: '12px', color: '#A0B0A4', marginTop: '6px', lineHeight: 1.6 }}>
            Masuk menggunakan akun Google<br />yang terdaftar sebagai admin.
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            background: 'white',
            border: '1.5px solid #E2D9C8',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 2px 12px rgba(28,43,34,0.08)',
            transition: 'all 0.2s',
          }}
        >
          {/* Google icon */}
          <svg style={{ width: '22px', height: '22px', flexShrink: 0 }} viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#1C2B22', fontFamily: 'Nunito, sans-serif' }}>
            {loading ? 'Mengarahkan...' : 'Masuk dengan Google'}
          </span>
        </button>

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #C0392B', borderRadius: '12px', padding: '12px 16px', fontSize: '12px', color: '#C0392B', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Info box */}
        <div style={{ background: '#EAF6EE', border: '1px solid #D4EDDE', borderRadius: '14px', padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#2E7D52', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" style={{ width: '12px', height: '12px' }} strokeWidth={2.5}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p style={{ fontSize: '11px', color: '#5A6E5E', lineHeight: 1.6 }}>
            Hanya email yang terdaftar sebagai admin yang dapat mengakses halaman ini.
          </p>
        </div>

        {/* Footer note */}
        <p style={{ fontSize: '10px', color: '#A0B0A4', textAlign: 'center', lineHeight: 1.7, marginTop: 'auto' }}>
          Halaman ini tidak dipublikasikan.<br />
          Jika kamu bukan admin, kamu tidak perlu di sini 🌿
        </p>

      </div>
    </main>
  )
}