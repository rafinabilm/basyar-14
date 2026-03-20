'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

export interface Event {
  id: string
  nama_event: string
  tanggal: string
  lokasi?: string
  deskripsi?: string
  foto_cover_url?: string
  created_at: string
}

export interface GaleriFoto {
  id: string
  event_id: string
  foto_url: string
  caption?: string
  created_at: string
  event?: Event
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async (isInitial = false) => {
    if (!isInitial) setLoading(true)
    const { data } = await supabase
      .from('event')
      .select('*')
      .order('tanggal', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch(true)
  }, [fetch])

  return { events, loading, refetch: fetch }
}

export function useEventById(id: string) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchEvent() {
      try {
        const { data, error } = await supabase
          .from('event')
          .select('*')
          .eq('id', id)
          .single()
        if (error) console.error('useEventById error:', error)
        setEvent(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  return { event, loading }
}

export function useFotoByEvent(eventId: string) {
  const [foto, setFoto] = useState<GaleriFoto[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('galeri_foto')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
      if (error) console.error('useFotoByEvent error:', error)
      setFoto(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    if (eventId) fetch()
  }, [eventId, fetch])

  return { foto, loading, refetch: fetch }
}

export function useLatestFoto() {
  const [foto, setFoto] = useState<GaleriFoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('galeri_foto')
      .select('*, event(nama_event)')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setFoto(data || [])
        setLoading(false)
      })
  }, [])

  return { foto, loading }
}

export async function insertEvent(data: {
  nama_event: string
  tanggal: string
  lokasi?: string
  deskripsi?: string
  foto_cover_url?: string
}) {
  const { error } = await supabase.from('event').insert([data])
  return { error }
}

export async function insertFoto(data: {
  event_id: string
  foto_url: string
  caption?: string
}) {
  const { error } = await supabase.from('galeri_foto').insert([data])
  return { error }
}

export async function hapusEvent(id: string) {
  const { error } = await supabase.from('event').delete().eq('id', id)
  return { error }
}

export async function hapusFoto(id: string) {
  const { error } = await supabase.from('galeri_foto').delete().eq('id', id)
  return { error }
}
