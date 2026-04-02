'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

export interface Tagihan {
  id: string
  judul: string
  nominal: number
  tipe: 'rutin' | 'per_acara'
  batas_bayar?: string
  visibilitas: string
  created_at: string
}

export interface PembayaranIuran {
  id: string
  anggota_id: string
  tagihan_id: string
  jumlah_bayar: number
  status: 'menunggu' | 'lunas' | 'ditolak'
  foto_bukti_urls: string[]
  created_at: string
  anggota?: { nama: string }
  tagihan?: { judul: string; nominal: number }
}

export interface Anggota {
  id: string
  nama: string
  kontak?: string
}

export function useTagihan() {
  const [tagihan, setTagihan] = useState<Tagihan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('tagihan')
      .select('*')
      .eq('visibilitas', 'publik')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTagihan(data || [])
        setLoading(false)
      })
  }, [])

  return { tagihan, loading }
}

export function useAllTagihan() {
  const [tagihan, setTagihan] = useState<Tagihan[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async (isInitial = false) => {
    if (!isInitial) setLoading(true)
    const { data } = await supabase
      .from('tagihan')
      .select('*')
      .order('created_at', { ascending: false })
    setTagihan(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch(true)
  }, [fetch])

  return { tagihan, loading, refetch: fetch }
}

export function usePembayaranCount(tagihanId: string) {
  const [count, setCount] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!tagihanId) return
    supabase
      .from('pembayaran_iuran')
      .select('id', { count: 'exact' })
      .eq('tagihan_id', tagihanId)
      .eq('status', 'lunas')
      .then(({ count: c }) => setCount(c || 0))

    supabase
      .from('anggota')
      .select('id', { count: 'exact' })
      .then(({ count: c }) => setTotal(c || 0))
  }, [tagihanId])

  return { count, total }
}

export function useAnggota() {
  const [anggota, setAnggota] = useState<Anggota[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('anggota')
      .select('*')
      .order('nama', { ascending: true })
      .then(({ data }) => {
        setAnggota(data || [])
        setLoading(false)
      })
  }, [])

  return { anggota, loading }
}

export function useAllPembayaran() {
  const [pembayaran, setPembayaran] = useState<PembayaranIuran[]>([])
  const [loading, setLoading] = useState(true)

  // Normalize data to handle both old (foto_bukti_url) and new (foto_bukti_urls) formats
  const normalizePembayaran = (data: any[]): PembayaranIuran[] => {
    return data.map(p => ({
      ...p,
      foto_bukti_urls: Array.isArray(p.foto_bukti_urls) 
        ? p.foto_bukti_urls 
        : (p.foto_bukti_url ? [p.foto_bukti_url] : [])
    }))
  }

  const fetch = useCallback(async (isInitial = false) => {
    if (!isInitial) setLoading(true)
    const { data } = await supabase
      .from('pembayaran_iuran')
      .select('*, anggota(nama), tagihan(judul, nominal)')
      .order('created_at', { ascending: false })
    setPembayaran(normalizePembayaran(data || []))
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch(true)
  }, [fetch])

  return { pembayaran, loading, refetch: fetch }
}

export async function submitPembayaran(data: {
  anggota_id: string
  tagihan_id: string
  jumlah_bayar: number
  foto_bukti_urls: string[]
}) {
  const { error } = await supabase
    .from('pembayaran_iuran')
    .insert([{ ...data, status: 'menunggu' }])
  return { error }
}

export async function verifikasiPembayaran(id: string) {
  // 1. Fetch data
  const { data: pemb, error: fetchErr } = await supabase
    .from('pembayaran_iuran')
    .select('*, anggota(nama), tagihan(judul)')
    .eq('id', id)
    .single()

  if (fetchErr) return { error: fetchErr }

  // 2. Update status
  const { error } = await supabase
    .from('pembayaran_iuran')
    .update({ status: 'lunas' })
    .eq('id', id)

  if (error) return { error }

  // 3. Insert ke transaksi_kas
  const namaAnggota = pemb.anggota?.nama || 'Anggota'
  const judulTagihan = pemb.tagihan?.judul || 'Iuran'

  const { error: kasErr } = await supabase.from('transaksi_kas').insert([{
    tanggal: new Date().toISOString().split('T')[0],
    jenis: 'pemasukan',
    jumlah: pemb.jumlah_bayar,
    keterangan: `Pembayaran ${judulTagihan} - ${namaAnggota}`,
    kategori: 'iuran',
    foto_bukti_urls: pemb.foto_bukti_urls || []
  }])

  if (kasErr) return { error: kasErr }

  return { error: null }
}

export async function rejectPembayaranIuran(id: string) {
  const { error } = await supabase
    .from('pembayaran_iuran')
    .update({ status: 'ditolak' })
    .eq('id', id)

  return { error }
}
