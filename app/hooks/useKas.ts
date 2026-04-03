'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

export interface TransaksiKas {
  id: string
  tanggal: string
  jenis: 'pemasukan' | 'pengeluaran'
  jumlah: number
  keterangan: string
  kategori: string
  foto_bukti_urls: string[]
  dicatat_oleh?: string
  status?: 'active' | 'archived'
  created_at: string
}

export function useKas() {
  const [transaksi, setTransaksi] = useState<TransaksiKas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State untuk Saldo, Masuk, Keluar (Biar gak re-calculate terus)
  const [saldo, setSaldo] = useState(0)
  const [totalMasuk, setTotalMasuk] = useState(0)
  const [totalKeluar, setTotalKeluar] = useState(0)
  
  const normalizeTransaksi = (data: any[]): TransaksiKas[] => {
    return data.map(t => {
      const normalized = {
        ...t,
        foto_bukti_urls: Array.isArray(t.foto_bukti_urls) 
          ? t.foto_bukti_urls 
          : (t.foto_bukti_urls ? [t.foto_bukti_urls] : []) // asumsikan nama kolom sudah fix foto_bukti_urls
      }
      return normalized
    })
  }
  
  const fetchTransaksi = useCallback(async (isInitial = false) => {
    if (!isInitial) setLoading(true)
    
    // PERBAIKAN: Filter langsung dari database (jangan select archived)
    const { data, error } = await supabase
      .from('transaksi_kas')
      .select('*')
      .neq('status', 'archived') // <--- Filter di DB lebih cepat
      .order('tanggal', { ascending: false })
      // .limit(100) <-- Buka komen ini kalau nanti data udah bener-bener ribuan dan butuh dibatasi

    if (error) {
      setError(error.message)
    } else {
      const normalizedData = normalizeTransaksi(data || [])
      setTransaksi(normalizedData)
      
      // PERBAIKAN: Hitung saldo sekali saja saat fetch selesai
      let masuk = 0
      let keluar = 0
      normalizedData.forEach(t => {
        if (t.jenis === 'pemasukan') masuk += t.jumlah
        else keluar += t.jumlah
      })
      setTotalMasuk(masuk)
      setTotalKeluar(keluar)
      setSaldo(masuk - keluar)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTransaksi(true)
  }, [fetchTransaksi])

  return { transaksi, saldo, totalMasuk, totalKeluar, loading, error, refetch: fetchTransaksi }
}

// ... Fungsi insert, update, archive, dsb biarkan sama seperti sebelumnya ...

export async function insertTransaksi(data: {
  tanggal: string
  jenis: string
  jumlah: number
  keterangan: string
  kategori: string
  foto_bukti_urls?: string[]
}) {
  const { data: result, error } = await supabase
    .from('transaksi_kas')
    .insert([{ ...data, foto_bukti_urls: data.foto_bukti_urls || [] }])
    .select()
    .single()

  return { result, error }
}

export async function updateTransaksi(id: string, data: Partial<TransaksiKas>) {
  const { data: result, error } = await supabase
    .from('transaksi_kas')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  return { result, error }
}

export async function archiveTransaksi(id: string) {
  const { error } = await supabase
    .from('transaksi_kas')
    .update({ status: 'archived' })
    .eq('id', id)

  return { error }
}

export async function restoreTransaksi(id: string) {
  const { error } = await supabase
    .from('transaksi_kas')
    .update({ status: 'active' })
    .eq('id', id)

  return { error }
}

export async function deletePermanently(id: string) {
  const { error } = await supabase
    .from('transaksi_kas')
    .delete()
    .eq('id', id)

  return { error }
}

export async function getArchivedKas() {
  const { data, error } = await supabase
    .from('transaksi_kas')
    .select('*')
    .eq('status', 'archived')
    .order('tanggal', { ascending: false })

  return { data, error }
}