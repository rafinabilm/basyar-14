'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Event, GaleriFoto } from '@/app/types'

export function useEvent() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('event')
        .select('*')
        .order('tanggal', { ascending: false })
      if (data) setEvents(data)
      setLoading(false)
    }
    fetch()
  }, [])

  return { events, loading }
}

export function useFotoByEvent(eventId: string) {
  const [foto, setFoto] = useState<GaleriFoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('galeri_foto')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
      if (data) setFoto(data)
      setLoading(false)
    }
    fetch()
  }, [eventId])

  return { foto, loading }
}

export function useLatestFoto() {
  const [foto, setFoto] = useState<GaleriFoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('galeri_foto')
        .select('*, event(*)')
        .order('created_at', { ascending: false })
        .limit(6)
      if (data) setFoto(data)
      setLoading(false)
    }
    fetch()
  }, [])

  return { foto, loading }
}