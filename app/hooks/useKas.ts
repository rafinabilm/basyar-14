'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { TransaksiKas } from '@/app/types'

export function useKas() {
  const [transaksi, setTransaksi] = useState<TransaksiKas[]>([])
  const [loading, setLoading] = useState(true)

  const saldo = transaksi.reduce((acc, t) => {
    return t.jenis === 'pemasukan' ? acc + t.jumlah : acc - t.jumlah
  }, 0)

  const totalMasuk = transaksi
    .filter(t => t.jenis === 'pemasukan')
    .reduce((acc, t) => acc + t.jumlah, 0)

  const totalKeluar = transaksi
    .filter(t => t.jenis === 'pengeluaran')
    .reduce((acc, t) => acc + t.jumlah, 0)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('transaksi_kas')
        .select('*')
        .order('tanggal', { ascending: false })
      if (data) setTransaksi(data)
      setLoading(false)
    }
    fetch()
  }, [])

  return { transaksi, saldo, totalMasuk, totalKeluar, loading }
}