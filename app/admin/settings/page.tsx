'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useDialog } from '@/app/providers/DialogProvider'
import { Card } from '@/app/components/ui/Card'

interface AdminUser {
  id: string
  email: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { showAlert } = useDialog()
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
    if (passwordBaru.length < 6) { showAlert('Password minimal 6 karakter'); return }
    setSaving(true)
    const { error } = await supabase.auth.signUp({
      email: emailBaru,
      password: passwordBaru,
    })
    setSaving(false)
    if (error) {
      showAlert('Gagal: ' + error.message)
      return
    }
    showAlert(`Admin baru berhasil dibuat: ${emailBaru}\nAkun dapat langsung login.`)
    setEmailBaru('')
    setPasswordBaru('')
    setShowTambah(false)
  }

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#111827', letterSpacing: '-1px', fontFamily: 'Space Grotesk, sans-serif' }}>Pengaturan</h1>
        <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500, marginTop: '4px' }}>Kelola akun dan sistem Basyar-14.</p>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Akun Yang Sedang Login */}
        <div className="animate-in" style={{ animationDelay: '0.05s' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '12px' }}>Akses Login Saat Ini</p>
          {currentUser && (
            <Card style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1.5px solid #EEF2FF' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #E0E7FF' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#6366F1' }}>
                    {currentUser.email[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>{currentUser.email}</div>
                  <div style={{ marginTop: '2px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '8px', background: '#E0E7FF', color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Administrator
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Manajemen Admin */}
        <div className="animate-in" style={{ animationDelay: '0.1s' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '12px' }}>Manajemen Otoritas</p>
          {showTambah && (
            <Card className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '12px', border: '2px solid #EEF2FF' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#111827', fontFamily: 'Space Grotesk, sans-serif' }}>Tambah Admin Baru</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#4B5563' }}>Alamat Email</label>
                <input type="email" placeholder="admin@basyar14.com" value={emailBaru} onChange={e => setEmailBaru(e.target.value)} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '14px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#4B5563' }}>Kata Sandi</label>
                <input type="password" placeholder="Minimal 6 karakter" value={passwordBaru} onChange={e => setPasswordBaru(e.target.value)} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '14px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={() => setShowTambah(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#F3F4F6', color: '#6B7280', border: 'none', fontSize: '13px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                  Batal
                </button>
                <button onClick={handleTambahAdmin} disabled={saving || !emailBaru || !passwordBaru} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#6366F1', color: 'white', border: 'none', fontSize: '13px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', opacity: (saving || !emailBaru || !passwordBaru) ? 0.5 : 1 }}>
                  {saving ? 'Proses...' : 'Buat Akun'}
                </button>
              </div>
            </Card>
          )}
          <button 
            onClick={() => setShowTambah(!showTambah)} 
            style={{ 
              width: '100%', 
              background: '#FFFFFF', 
              border: '2px dashed #E5E7EB', 
              borderRadius: '20px', 
              padding: '18px', 
              textAlign: 'center', 
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none'
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#6366F1' }}>{showTambah ? 'Tutup Formulir' : '+ Tambah Administrator Baru'}</span>
          </button>
        </div>

        {/* Info Website */}
        <div className="animate-in" style={{ animationDelay: '0.15s' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '12px' }}>Informasi Sistem</p>
          <Card style={{ padding: '8px 16px' }}>
            {[
              { label: 'Nama Aplikasi', value: 'Basyar-14' },
              { label: 'Versi', value: '2.4.0-violet' },
              { label: 'Keamanan', value: 'SSL & OAuth' },
              { label: 'SEO Config', value: 'No-Index' },
            ].map((item, i) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i === 3 ? 'none' : '1px solid #F9FAFB' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7280' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>{item.value}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Logout */}
        <div className="animate-in" style={{ animationDelay: '0.2s' }}>
          <button 
            onClick={handleLogout} 
            style={{ 
              width: '100%', 
              padding: '18px', 
              borderRadius: '20px', 
              background: '#FEF2F2', 
              color: '#EF4444', 
              border: '1.5px solid #FEE2E2', 
              fontSize: '14px', 
              fontWeight: 800, 
              cursor: 'pointer', 
              fontFamily: 'Nunito, sans-serif',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '18px', height: '18px' }} strokeWidth={2.5}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Keluar dari Panel Admin
          </button>
        </div>
      </div>
    </main>
  )
}
