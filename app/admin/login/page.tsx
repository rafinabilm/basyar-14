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
      options: { redirectTo: `${window.location.origin}/admin` },
    })
    if (error) {
      setError('Gagal login. Coba lagi.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <div
        className="flex flex-col items-center justify-center gap-3 py-14 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a5c3a 0%, #2E7D52 60%, #3a9465 100%)' }}
      >
        <div className="absolute top-[-40px] right-[-40px] w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 rounded-full bg-white/4" />
        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center z-10">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" className="w-7 h-7" strokeWidth={1.8}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div className="text-center z-10">
          <h1 className="text-[22px] font-extrabold text-white tracking-tight">Basyar-14</h1>
          <p className="text-[11px] text-white/65 mt-0.5">PP Al-Hamid · Admin Panel</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 bg-[var(--bg)] px-6 py-8 flex flex-col gap-5">
        <div className="text-center">
          <h2 className="text-[18px] font-extrabold text-[var(--txt)]">Selamat Datang</h2>
          <p className="text-[11px] text-[var(--mut)] mt-1 leading-relaxed">
            Masuk menggunakan akun Google yang terdaftar sebagai admin.
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-[var(--bord)] rounded-xl px-4 py-3.5 flex items-center justify-center gap-3 shadow-sm active:opacity-80 transition-opacity disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-[13px] font-bold text-[var(--txt)]">
            {loading ? 'Mengarahkan...' : 'Masuk dengan Google'}
          </span>
        </button>

        {error && (
          <div className="bg-[#FEE2E2] border border-[var(--err)] rounded-xl px-4 py-3 text-[11px] text-[var(--err)] text-center">
            {error}
          </div>
        )}

        {/* Info */}
        <div className="bg-[var(--acsl)] border border-[var(--acs)] rounded-xl px-4 py-3 flex gap-2 items-start">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--acc)" className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-[10px] text-[var(--sec)] leading-relaxed">
            Hanya email yang terdaftar sebagai admin yang dapat mengakses halaman ini.
          </p>
        </div>

        <p className="text-[9px] text-[var(--mut)] text-center leading-relaxed mt-auto">
          Halaman ini tidak dipublikasikan.<br />
          Jika kamu bukan admin, kamu tidak perlu di sini 🌿
        </p>
      </div>
    </main>
  )
}
