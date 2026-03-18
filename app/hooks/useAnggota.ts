'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Anggota } from '@/app/types'

export function useAnggota() {
  const [anggota, setAnggota] = useState<Anggota[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('anggota')
        .select('*')
        .order('nama', { ascending: true })
      if (data) setAnggota(data)
      setLoading(false)
    }
    fetch()
  }, [])

  return { anggota, loading }
}