'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'

interface AdminUser {
  id: string
  email: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [showTambah, setShowTambah] = useState(false)
  const [emailBaru, setEmailBaru] = useState('')
  const [passwordBaru, setPasswordBaru] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUser({ id: data.user.id, email: data.user.email || '' })
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  async function handleTambahAdmin() {
    if (!emailBaru || !passwordBaru) return
    if (passwordBaru.length < 6) { alert('Password minimal 6 karakter'); return }
    setSaving(true)
    const { error } = await supabase.auth.signUp({
      email: emailBaru,
      password: passwordBaru,
    })
    setSaving(false)
    if (error) {
      alert('Gagal: ' + error.message)
      return
    }
    alert(`Admin baru berhasil dibuat: ${emailBaru}\nAkun dapat langsung login.`)
    setEmailBaru('')
    setPasswordBaru('')
    setShowTambah(false)
  }

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.5px' }}>Settings</h1>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Akun Yang Sedang Login */}
        <div>
          <p style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '10px' }}>Akun Login Aktif</p>
          {currentUser && (
            <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '14px', border: '1px solid #E2D9C8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#2E7D52' }}>
                    {currentUser.email[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>{currentUser.email}</div>
                  <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: '#EAF6EE', color: '#2E7D52' }}>
                    Admin
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tambah Admin */}
        <div>
          <p style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '10px' }}>Manajemen Admin</p>
          {showTambah && (
            <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '14px', border: '1px solid #E2D9C8', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>Tambah Admin Baru</div>
              <div>
                <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '5px' }}>Email</div>
                <input type="email" placeholder="admin@example.com" value={emailBaru} onChange={e => setEmailBaru(e.target.value)} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '5px' }}>Password</div>
                <input type="password" placeholder="Min. 6 karakter" value={passwordBaru} onChange={e => setPasswordBaru(e.target.value)} style={{ width: '100%', background: '#FBF8F3', border: '1px solid #E2D9C8', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#1C2B22', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowTambah(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#F5F0E8', color: '#5A6E5E', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                  Batal
                </button>
                <button onClick={handleTambahAdmin} disabled={saving || !emailBaru || !passwordBaru} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#2E7D52', color: 'white', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', opacity: (saving || !emailBaru || !passwordBaru) ? 0.5 : 1 }}>
                  {saving ? 'Membuat...' : 'Buat Admin'}
                </button>
              </div>
            </div>
          )}
          <div onClick={() => setShowTambah(!showTambah)} style={{ border: '1.5px dashed #E2D9C8', borderRadius: '14px', padding: '14px', textAlign: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#2E7D52' }}>{showTambah ? '× Tutup' : '+ Tambah Admin'}</span>
          </div>
        </div>

        {/* Info Website */}
        <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '16px', border: '1px solid #E2D9C8' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C2B22', marginBottom: '12px' }}>Info Website</div>
          {[
            { label: 'Nama Angkatan', value: 'Basyar-14' },
            { label: 'Institusi', value: 'PP Al-Hamid' },
            { label: 'robots.txt', value: 'noindex aktif', green: true },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F5F0E8' }}>
              <span style={{ fontSize: '11px', color: '#A0B0A4' }}>{item.label}</span>
              {item.green ? (
                <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: '#EAF7EE', color: '#1E7B3A' }}>{item.value}</span>
              ) : (
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1C2B22' }}>{item.value}</span>
              )}
            </div>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#FEE2E2', color: '#C0392B', border: '1.5px solid #C0392B', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
          Keluar dari Admin
        </button>
      </div>
    </main>
  )
}
