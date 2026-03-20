import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useKas, insertTransaksi } from './useKas'
import { supabase } from '@/app/lib/supabase'

describe('useKas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch transactions and calculate saldo correctly', async () => {
    const mockData = [
      { id: '1', jenis: 'pemasukan', jumlah: 100000, tanggal: '2024-03-20', keterangan: 'Masuk' },
      { id: '2', jenis: 'pengeluaran', jumlah: 30000, tanggal: '2024-03-21', keterangan: 'Keluar' },
    ]

    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    } as any)

    const { result } = renderHook(() => useKas())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.transaksi).toEqual(mockData)
    expect(result.current.saldo).toBe(70000)
    expect(result.current.totalMasuk).toBe(100000)
    expect(result.current.totalKeluar).toBe(30000)
  })

  it('should handle insertTransaksi correctly', async () => {
    const mockNewData = {
      tanggal: '2024-03-22',
      jenis: 'pemasukan',
      jumlah: 50000,
      keterangan: 'Donasi',
      kategori: 'lainnya',
    }

    const mockInsert = vi.fn().mockReturnThis()
    const mockSelect = vi.fn().mockReturnThis()
    const mockSingle = vi.fn().mockResolvedValue({ data: { id: '3', ...mockNewData }, error: null })

    vi.spyOn(supabase, 'from').mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle,
    } as any)

    const result = await insertTransaksi(mockNewData)

    expect(supabase.from).toHaveBeenCalledWith('transaksi_kas')
    expect(mockInsert).toHaveBeenCalledWith([mockNewData])
    expect(result.error).toBeNull()
    expect(result.result?.id).toBe('3')
  })
})
