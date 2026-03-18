'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import { Card } from '@/app/components/ui/Card'
import { Pill } from '@/app/components/ui/Pill'
import { PageHeader } from '@/app/components/ui/PageHeader'

const DUMMY_ADMINS = [
  { id: '1', nama: 'Rizky Pratama', email: 'rizky@gmail.com', role: 'superadmin' },
  { id: '2', nama: 'Dewi Anggraini', email: 'dewi@gmail.com', role: 'superadmin' },
  { id: '3', nama: 'Hendra Kusuma', email: 'hendra@gmail.com', role: 'bendahara' },
]

export default function AdminSettingsPage() {
  const router = useRouter()
  const [admins] = useState(DUMMY_ADMINS)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <main className="pb-32">
      <div className="px-4 pt-5 pb-2 animate-in delay-1">
        <PageHeader title="Settings" />
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Akun Admin */}
        <div className="animate-in delay-2">
          <p className="text-[9px] font-mono tracking-widest uppercase text-[var(--mut)] mb-2">Akun Admin</p>
          <div className="flex flex-col gap-3">
            {admins.map(a => (
              <Card key={a.id} className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: a.role === 'superadmin' ? 'var(--acsl)' : '#EAF7EE' }}>
                    <span className="text-[12px] font-bold" style={{ color: a.role === 'superadmin' ? 'var(--acc)' : 'var(--ok)' }}>
                      {a.nama[0]}
                    </span>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[var(--txt)]">{a.nama}</div>
                    <Pill
                      label={a.role === 'superadmin' ? 'Superadmin' : 'Bendahara'}
                      variant={a.role === 'superadmin' ? 'accent' : 'green'}
                    />
                  </div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--err)" className="w-3.5 h-3.5 cursor-pointer" strokeWidth={2}>
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                </svg>
              </Card>
            ))}

            <div className="border-[1.5px] border-dashed border-[var(--bord)] rounded-xl py-3 text-center cursor-pointer">
              <span className="text-[11px] font-bold text-[var(--acc)]">+ Tambah Admin</span>
            </div>
          </div>
        </div>

        {/* Info Website */}
        <Card className="animate-in delay-3">
          <div className="text-[12px] font-bold text-[var(--txt)] mb-3">Info Website</div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-[var(--mut)]">Nama Angkatan</span>
            <span className="text-[10px] font-bold text-[var(--txt)]">Basyar-14</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-[var(--mut)]">Institusi</span>
            <span className="text-[10px] font-bold text-[var(--txt)]">PP Al-Hamid</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[var(--mut)]">robots.txt</span>
            <Pill label="noindex aktif" variant="green" />
          </div>
        </Card>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl text-[13px] font-bold text-[var(--err)] border border-[var(--err)] bg-[#FEE2E2] active:opacity-80 transition-opacity animate-in delay-4"
        >
          Keluar dari Admin
        </button>
      </div>
    </main>
  )
}
