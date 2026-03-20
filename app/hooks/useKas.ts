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
  foto_bukti_url?: string
  dicatat_oleh?: string
  created_at: string
}

export function useKas() {
  const [transaksi, setTransaksi] = useState<TransaksiKas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchTransaksi = useCallback(async (isInitial = false) => {
    if (!isInitial) setLoading(true)
    const { data, error } = await supabase
      .from('transaksi_kas')
      .select('*')
      .order('tanggal', { ascending: false })

    if (error) setError(error.message)
    else setTransaksi(data || [])
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
  foto_bukti_url?: string
}) {
  const { data: result, error } = await supabase
    .from('transaksi_kas')
    .insert([data])
    .select()
    .single()

  return { result, error }
}
