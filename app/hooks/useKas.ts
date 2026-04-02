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
  
  // Normalize data to handle both old (foto_bukti_url) and new (foto_bukti_urls) formats
  const normalizeTransaksi = (data: any[]): TransaksiKas[] => {
    return data.map(t => ({
      ...t,
      foto_bukti_urls: Array.isArray(t.foto_bukti_urls) 
        ? t.foto_bukti_urls 
        : (t.foto_bukti_url ? [t.foto_bukti_url] : [])
    }))
  }
  
  const fetchTransaksi = useCallback(async (isInitial = false) => {
    if (!isInitial) setLoading(true)
    const { data, error } = await supabase
      .from('transaksi_kas')
      .select('*')
      .order('tanggal', { ascending: false })

    if (error) setError(error.message)
    else {
      // Filter out archived in JS to be safe against missing column in DB
      const filtered = (data || []).filter((t: any) => t.status !== 'archived')
      setTransaksi(normalizeTransaksi(filtered))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTransaksi(true)
  }, [fetchTransaksi])

  const saldo = transaksi.reduce((acc, t) =>
    t.jenis === 'pemasukan' ? acc + t.jumlah : acc - t.jumlah, 0)
  const totalMasuk = transaksi.filter(t => t.jenis === 'pemasukan').reduce((acc, t) => acc + t.jumlah, 0)
  const totalKeluar = transaksi.filter(t => t.jenis === 'pengeluaran').reduce((acc, t) => acc + t.jumlah, 0)

  return { transaksi, saldo, totalMasuk, totalKeluar, loading, error, refetch: fetchTransaksi }
}

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
