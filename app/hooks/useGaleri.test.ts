import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useEvents, insertEvent } from './useGaleri'
import { supabase } from '@/app/lib/supabase'

describe('useGaleri', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch events correctly', async () => {
    const mockEvents = [
      { id: 'e1', nama_event: 'Rapat Akbar', tanggal: '2024-04-01' },
      { id: 'e2', nama_event: 'Bukber', tanggal: '2024-04-10' },
    ]

    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockEvents, error: null }),
    } as any)

    const { result } = renderHook(() => useEvents())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.events).toEqual(mockEvents)
  })

  it('should handle insertEvent correctly', async () => {
    const mockNewEvent = {
        nama_event: 'Halal Bihalal',
        tanggal: '2024-05-01',
    }
    const mockInsert = vi.fn().mockResolvedValue({ error: null })

    vi.spyOn(supabase, 'from').mockReturnValue({
      insert: mockInsert,
    } as any)

    const result = await insertEvent(mockNewEvent)
    expect(supabase.from).toHaveBeenCalledWith('event')
    expect(mockInsert).toHaveBeenCalledWith([mockNewEvent])
    expect(result.error).toBeNull()
  })
})
