'use client'

import { useState, useCallback, useEffect } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { useKas, insertTransaksi, updateTransaksi, archiveTransaksi, restoreTransaksi, deletePermanently, getArchivedKas, TransaksiKas } from '@/app/hooks/useKas'
import { uploadFile } from '@/app/hooks/useUpload'
import { useDialog } from '@/app/providers/DialogProvider'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.abs(n))
}

function ArchiveModal({ isOpen, onClose, onRefresh }: { isOpen: boolean, onClose: () => void, onRefresh: () => void }) {
  const [archived, setArchived] = useState<TransaksiKas[]>([])
  const [loading, setLoading] = useState(true)
  const { showConfirm, showAlert } = useDialog()

  const fetchArchived = useCallback(async () => {
    setLoading(true)
    const { data } = await getArchivedKas()
    setArchived(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (isOpen) fetchArchived()
  }, [isOpen, fetchArchived])

  async function handleRestore(id: string) {
    const { error } = await restoreTransaksi(id)
    if (error) showAlert('Gagal restore: ' + error.message)
    else { fetchArchived(); onRefresh() }
  }

  async function handleDelete(id: string) {
    const transaction = archived.find(t => t.id === id)
    const conf = await showConfirm({ 
      title: 'Hapus Permanen', 
      message: `Hapus transaksi "${transaction?.keterangan}" (${fmt(transaction?.jumlah || 0)})?\n\nTindakan ini TIDAK BISA DIBATALKAN dan akan dihapus selamanya dari database.`, 
      isDestructive: true 
    })
    if (!conf) return
    const { error } = await deletePermanently(id)
    if (error) showAlert('Gagal hapus: ' + error.message)
    else fetchArchived()
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="animate-in" style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '400px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>Arsip Kas</h3>
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Data yang dibatalkan/dihapus sementara.</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px', color: '#9CA3AF', cursor: 'pointer' }}>×</button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '20px' }}>Memuat arsip...</div>
          ) : archived.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '20px' }}>Tidak ada data di arsip.</div>
          ) : (
            archived.map(t => (
              <div key={t.id} style={{ padding: '12px', borderRadius: '16px', border: '1px solid #F3F4F6', background: '#F9FAFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#4B5563' }}>{t.keterangan}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{fmt(t.jumlah)} • {new Date(t.tanggal).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button onClick={() => handleRestore(t.id)} style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#EEF2FF', color: '#6366F1', border: 'none', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Kembalikan</button>
                  <button onClick={() => handleDelete(t.id)} style={{ padding: '8px', borderRadius: '8px', background: '#FEF2F2', color: '#EF4444', border: 'none', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Hapus</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


export default function AdminKasPage() {
  const { transaksi, saldo, totalMasuk, totalKeluar, loading, refetch } = useKas()
  const { showAlert, showConfirm } = useDialog()
  const [showForm, setShowForm] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const initialForm = { jenis: 'pengeluaran', jumlah: '', keterangan: '', kategori: 'lainnya', tanggal: new Date().toISOString().split('T')[0] }
  const [form, setForm] = useState(initialForm)
  const [file, setFile] = useState<File | null>(null)
  const [existingBukti, setExistingBukti] = useState<string | null>(null)

  function handleEdit(t: TransaksiKas) {
    setEditingId(t.id)
    setForm({
      jenis: t.jenis,
      jumlah: String(t.jumlah),
      keterangan: t.keterangan,
      kategori: t.kategori,
      tanggal: t.tanggal
    })
    setExistingBukti(t.foto_bukti_url || null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleArchive(id: string) {
    const conf = await showConfirm({ title: 'Arsipkan?', message: 'Data akan dipindahkan ke folder arsip (pembatalan). Lanjutkan?', isDestructive: true })
    if (!conf) return
    const { error } = await archiveTransaksi(id)
    if (error) showAlert('Gagal arsip')
    else refetch()
  }

  async function handleSave() {
    if (!form.jumlah || !form.keterangan) return
    setSaving(true)
    
    let foto_bukti_url = existingBukti
    if (file) {
      const url = await uploadFile(file, 'basyar14/kas')
      if (url) foto_bukti_url = url
    }

    const payload = { ...form, jumlah: parseInt(form.jumlah), foto_bukti_url: foto_bukti_url || undefined } as any
    
    let res
    if (editingId) {
      res = await updateTransaksi(editingId, payload)
    } else {
      res = await insertTransaksi(payload)
    }

    setSaving(false)
    if (res.error) { showAlert('Gagal: ' + res.error.message); return }
    
    setShowForm(false)
    setEditingId(null)
    setForm(initialForm)
    setFile(null)
    setExistingBukti(null)
    refetch()
    showAlert(editingId ? 'Berhasil diperbarui' : 'Berhasil dicatat')
  }

  return (
    <main style={{ paddingBottom: '120px' }}>
      <div style={{ padding: '32px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageHeader title="Kelola Kas" subtitle="Monitoring dan pencatatan kas." />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setShowArchive(true)}
            style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#F9FAFB', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#6B7280" style={{ width: '20px', height: '20px' }} strokeWidth={2.5}><path d="M21 8H3V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2zM5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4" /></svg>
          </button>
          <button 
            onClick={() => {
              if (showForm) { setShowForm(false); setEditingId(null); setForm(initialForm) }
              else setShowForm(true)
            }} 
            style={{ 
              background: showForm ? '#F3F4F6' : '#6366F1', 
              color: showForm ? '#6B7280' : 'white', 
              border: 'none', 
              borderRadius: '12px', 
              padding: '10px 18px', 
              fontSize: '13px', 
              fontWeight: 800, 
              cursor: 'pointer', 
              fontFamily: 'Nunito, sans-serif', 
              flexShrink: 0,
              boxShadow: showForm ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.2)',
              transition: 'all 0.2s'
            }}
          >
            {showForm ? 'Batal' : '+ Tambah'}
          </button>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Saldo Card */}
        <div className="animate-in" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 55%, #818cf8 100%)', padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Total Kas Saat Ini</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'white', fontFamily: 'Space Grotesk, monospace', letterSpacing: '-1.5px', marginBottom: '20px' }}>{fmt(saldo)}</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase' }}>Pemasukan</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#A7F3D0', fontFamily: 'Space Grotesk, monospace', marginTop: '2px' }}>{fmt(totalMasuk).replace('Rp', '').trim()}</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase' }}>Pengeluaran</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#FECACA', fontFamily: 'Space Grotesk, monospace', marginTop: '2px' }}>{fmt(totalKeluar).replace('Rp', '').trim()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Add/Edit Transaction */}
        {showForm && (
          <Card className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: editingId ? '2px solid #6366F1' : '2px solid #EEF2FF' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>
              {editingId ? 'Edit Transaksi' : 'Catat Transaksi'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Tanggal</div>
                <input type="date" value={form.tanggal} onChange={e => setForm(p => ({ ...p, tanggal: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Jenis</div>
                <select value={form.jenis} onChange={e => setForm(p => ({ ...p, jenis: e.target.value as any }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }}>
                  <option value="pemasukan">Pemasukan (+)</option>
                  <option value="pengeluaran">Pengeluaran (-)</option>
                </select>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Keterangan Transaksi</div>
              <input type="text" placeholder="Gaji marbot, Beli konsumsi, dll" value={form.keterangan} onChange={e => setForm(p => ({ ...p, keterangan: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '14px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Nominal (Rp)</div>
                <input type="number" value={form.jumlah} onChange={e => setForm(p => ({ ...p, jumlah: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '16px', fontWeight: 800, color: '#111827', fontFamily: 'Space Grotesk, monospace', outline: 'none' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Kategori</div>
                <select value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))} style={{ width: '100%', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '12px', fontSize: '13px', color: '#111827', fontFamily: 'Nunito, sans-serif', outline: 'none' }}>
                  <option value="iuran">Iuran</option>
                  <option value="konsumsi">Konsumsi</option>
                  <option value="hadiah_guru">Hadiah Guru</option>
                  <option value="transportasi">Transportasi</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#9CA3AF' }}>Bukti Transaksi</div>
              {existingBukti && !file && (
                <div style={{ position: 'relative', width: '100px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                  <img src={existingBukti} alt="old proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '9px', fontWeight: 800 }}>LAMA</div>
                </div>
              )}
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80px', border: '2px dashed #6366F1', borderRadius: '14px', background: '#F5F7FF', cursor: 'pointer', transition: 'all 0.2s' }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
                <div style={{ fontSize: '12px', color: '#6366F1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {file ? <span>✓ {file.name}</span> : <span>📸 {editingId ? 'Ganti Bukti (Opsional)' : 'Upload Bukti (Opsional)'}</span>}
                </div>
              </label>
            </div>

            <button onClick={handleSave} disabled={saving || !form.jumlah || !form.keterangan} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#6366F1', color: 'white', border: 'none', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)', opacity: (saving || !form.jumlah || !form.keterangan) ? 0.5 : 1 }}>
              {saving ? 'Proses menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Simpan Transaksi')}
            </button>
          </Card>
        )}

        {/* List Riwayat */}
        <div>
          <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF' }}>Riwayat Transaksi</p>
            <div style={{ width: '40px', height: '1px', background: '#F3F4F6' }} />
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Memuat data...</div>
          ) : transaksi.length === 0 ? (
            <EmptyState
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '32px', height: '32px' }} strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
              title="Kas masih kosong"
              description="Belum ada catatan aktivitas keuangan."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transaksi.map((t, i) => (
                <Card key={t.id} style={{ animationDelay: `${i * 0.05}s`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: t.jenis === 'pemasukan' ? '#ECFDF5' : '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={t.jenis === 'pemasukan' ? '#10B981' : '#EF4444'} style={{ width: '18px', height: '18px' }} strokeWidth={2.5}>
                        {t.jenis === 'pemasukan' ? <path d="M7 10l5 5 5-5" /> : <path d="M17 14l-5-5-5 5" />}
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{t.keterangan}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '6px' }}>
                        {t.foto_bukti_url && (
                          <a href={t.foto_bukti_url} target="_blank" rel="noreferrer" style={{ fontSize: '9px', fontWeight: 800, color: '#6366F1', background: '#EEF2FF', padding: '3px 8px', borderRadius: '20px', display: 'inline-block', textDecoration: 'none' }}>
                            📄 Bukti
                          </a>
                        )}
                        <button onClick={() => handleEdit(t)} style={{ fontSize: '9px', fontWeight: 800, color: '#4B5563', background: '#F3F4F6', padding: '3px 8px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleArchive(t.id)} style={{ fontSize: '9px', fontWeight: 800, color: '#EF4444', background: '#FEF2F2', padding: '3px 8px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}>Arsip</button>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: t.jenis === 'pemasukan' ? '#10B981' : '#EF4444', fontFamily: 'Space Grotesk, monospace' }}>
                      {t.jenis === 'pemasukan' ? '+' : '-'}{fmt(t.jumlah).replace('Rp', '').trim()}
                    </div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>{t.jenis === 'pemasukan' ? 'In' : 'Out'}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ArchiveModal isOpen={showArchive} onClose={() => setShowArchive(false)} onRefresh={refetch} />
    </main>
  )
}

