'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Tagihan, PembayaranIuran } from '@/app/types'

export function useTagihan() {
  const [tagihan, setTagihan] = useState<Tagihan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('tagihan')
        .select('*')
        .eq('visibilitas', 'publik')
        .order('created_at', { ascending: false })
      if (data) setTagihan(data)
      setLoading(false)
    }
    fetch()
  }, [])

  return { tagihan, loading }
}

export function usePembayaran(tagihanId?: string) {
  const [pembayaran, setPembayaran] = useState<PembayaranIuran[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tagihanId) return
    async function fetch() {
      const { data } = await supabase
        .from('pembayaran_iuran')
        .select('*, anggota(*)')
        .eq('tagihan_id', tagihanId)
      if (data) setPembayaran(data)
      setLoading(false)
    }
    fetch()
  }, [tagihanId])

  return { pembayaran, loading }
}