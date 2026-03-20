import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'
import React from 'react'
import { DialogProvider } from '@/app/providers/DialogProvider'

// Mocking hooks
vi.mock('@/app/hooks/useKas', () => ({
  useKas: vi.fn(() => ({
    transaksi: [{ id: 'k1', keterangan: 'Test Kas', jumlah: 50000, jenis: 'pemasukan' }],
    loading: false,
    saldo: 50000,
    totalMasuk: 50000,
    totalKeluar: 0,
    refetch: vi.fn()
  })),
  insertTransaksi: vi.fn()
}))

vi.mock('@/app/components/admin/AdminNav', () => ({
  AdminNav: () => <div data-testid="admin-nav" />
}))

describe('Admin Kas Page', () => {
  it('should render the transaction list and balance', async () => {
    render(
      <DialogProvider>
        <Page />
      </DialogProvider>
    )

    expect(screen.getByText(/Kelola Kas/i)).toBeInTheDocument()
    expect(screen.getByText('Test Kas')).toBeInTheDocument()
    // Handle multiple matches for Rp 50.000 (Saldo, Masuk, and Item)
    const currencyElements = screen.getAllByText(/Rp.*50\.000/)
    expect(currencyElements.length).toBeGreaterThan(0)
  })
})
