import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'
import React from 'react'
import { DialogProvider } from '@/app/providers/DialogProvider'

// Mocking hooks used in the page
vi.mock('@/app/hooks/useIuran', () => ({
  useAllTagihan: vi.fn(() => ({
    tagihan: [{ id: 't1', judul: 'Tagihan Test', nominal: 100000 }],
    loading: false,
    refetch: vi.fn()
  })),
  useAllPembayaran: vi.fn(() => ({
    pembayaran: [
      { 
        id: 'p1', 
        anggota: { nama: 'Budi' }, 
        tagihan: { judul: 'Iuran Maret' },
        jumlah_bayar: 50000,
        status: 'menunggu',
        created_at: new Date().toISOString(),
        foto_bukti_url: 'http://example.com/proof.jpg'
      }
    ],
    loading: false,
    refetch: vi.fn()
  })),
  verifikasiPembayaran: vi.fn(),
  rejectPembayaranIuran: vi.fn()
}))

// Mocking AdminNav to avoid auth issues or complex nesting
vi.mock('@/app/components/admin/AdminNav', () => ({
  AdminNav: () => <div data-testid="admin-nav" />
}))

describe('Admin Iuran Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the page header', async () => {
    render(
      <DialogProvider>
        <Page />
      </DialogProvider>
    )

    expect(screen.getByText(/Kelola Iuran/i)).toBeInTheDocument()
  })

  it('should display pending payment with reject button', async () => {
    render(
      <DialogProvider>
        <Page />
      </DialogProvider>
    )

    // Should be on Approval tab by default
    expect(screen.getByText('Budi')).toBeInTheDocument()
    expect(screen.getByText('Iuran Maret')).toBeInTheDocument()
    
    // Reject button should exist
    const rejectButtons = screen.getAllByText('Tolak')
    expect(rejectButtons.length).toBeGreaterThan(0)
  })

  it('should show status badge for pending payment', async () => {
    render(
      <DialogProvider>
        <Page />
      </DialogProvider>
    )

    // Pending payment should have "Pending" badge
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })
})
