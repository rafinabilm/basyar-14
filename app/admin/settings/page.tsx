'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

const ADMINS = [
  { id: '1', nama: 'Rizky Pratama', role: 'superadmin' },
  { id: '2', nama: 'Dewi Anggraini', role: 'superadmin' },
  { id: '3', nama: 'Hendra Kusuma', role: 'bendahara' },
]

export default function AdminSettingsPage() {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <main style={{ paddingBottom: '100px' }}>
      <div style={{ padding: '20px 16px 8px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1C2B22', letterSpacing: '-0.5px' }}>Settings</h1>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Akun Admin */}
        <div>
          <p style={{ fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', color: '#A0B0A4', marginBottom: '10px' }}>Akun Admin</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ADMINS.map(a => (
              <div key={a.id} style={{ background: '#FFFFFF', borderRadius: '14px', padding: '14px', border: '1px solid #E2D9C8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: a.role === 'superadmin' ? '#EAF6EE' : '#EAF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: a.role === 'superadmin' ? '#2E7D52' : '#1E7B3A' }}>{a.nama[0]}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C2B22' }}>{a.nama}</div>
                    <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: a.role === 'superadmin' ? '#EAF6EE' : '#EAF7EE', color: a.role === 'superadmin' ? '#2E7D52' : '#1E7B3A' }}>
                      {a.role === 'superadmin' ? 'Superadmin' : 'Bendahara'}
                    </span>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#C0392B" style={{ width: '14px', height: '14px', cursor: 'pointer' }} strokeWidth={2}>
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                </svg>
              </div>
            ))}
            <div style={{ border: '1.5px dashed #E2D9C8', borderRadius: '14px', padding: '14px', textAlign: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#2E7D52' }}>+ Tambah Admin</span>
            </div>
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
