import { describe, it, expect, vi, beforeEach } from 'vitest'
import { verifikasiPembayaran, rejectPembayaranIuran } from './useIuran'
import { supabase } from '@/app/lib/supabase'

describe('useIuran - verifikasiPembayaran', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch payment data, update status, and insert into transaksi_kas', async () => {
    const mockPaymentId = 'p123'
    const mockPaymentData = {
      id: mockPaymentId,
      jumlah_bayar: 50000,
      foto_bukti_url: 'http://image.url',
      anggota: { nama: 'Budi' },
      tagihan: { judul: 'Iuran Maret' },
    }

    // Mock implementation for chained Supabase calls
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockPaymentData, error: null }),
      }),
    })

    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    })

    const mockInsert = vi.fn().mockResolvedValue({ error: null })

    // Assign mocks to supabase.from
    vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'pembayaran_iuran') {
        return { select: mockSelect, update: mockUpdate } as any
      }
      if (table === 'transaksi_kas') {
        return { insert: mockInsert } as any
      }
      return {} as any
    })

    const result = await verifikasiPembayaran(mockPaymentId)

    // Verify steps
    expect(supabase.from).toHaveBeenCalledWith('pembayaran_iuran')
    expect(mockSelect).toHaveBeenCalledWith('*, anggota(nama), tagihan(judul)')
    
    expect(mockUpdate).toHaveBeenCalledWith({ status: 'lunas' })
    
    expect(supabase.from).toHaveBeenCalledWith('transaksi_kas')
    expect(mockInsert).toHaveBeenCalledWith([expect.objectContaining({
      jenis: 'pemasukan',
      jumlah: 50000,
      keterangan: 'Pembayaran Iuran Maret - Budi',
      kategori: 'iuran',
    })])

    expect(result.error).toBeNull()
  })

  it('should return error if fetching payment data fails', async () => {
    vi.spyOn(supabase, 'from').mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Fetch error' } }),
        }),
      }),
    } as any)

    const result = await verifikasiPembayaran('fail_id')
    expect(result.error).toEqual({ message: 'Fetch error' })
  })
})

describe('useIuran - rejectPembayaranIuran', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should update payment status to ditolak', async () => {
    const mockPaymentId = 'p456'
    
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    })

    vi.spyOn(supabase, 'from').mockReturnValue({
      update: mockUpdate,
    } as any)

    const result = await rejectPembayaranIuran(mockPaymentId)

    expect(supabase.from).toHaveBeenCalledWith('pembayaran_iuran')
    expect(mockUpdate).toHaveBeenCalledWith({ status: 'ditolak' })
    expect(result.error).toBeNull()
  })

  it('should return error if update fails', async () => {
    const mockError = { message: 'Database error' }
    
    vi.spyOn(supabase, 'from').mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: mockError }),
      }),
    } as any)

    const result = await rejectPembayaranIuran('fail_id')
    expect(result.error).toEqual(mockError)
  })
})
