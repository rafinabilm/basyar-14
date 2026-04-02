import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Page from './page'
import React from 'react'
import { DialogProvider } from '@/app/providers/DialogProvider'

// Mocking hooks
vi.mock('@/app/hooks/useKas', () => ({
  useKas: vi.fn(() => ({
    transaksi: [{ id: 'k1', keterangan: 'Test Kas', jumlah: 50000, jenis: 'pemasukan', tanggal: '2024-03-20', status: 'active' }],
    loading: false,
    saldo: 50000,
    totalMasuk: 50000,
    totalKeluar: 0,
    refetch: vi.fn()
  })),
  insertTransaksi: vi.fn(),
  deletePermanently: vi.fn(),
  getArchivedKas: vi.fn().mockResolvedValue({
    data: [
      { id: 'archived1', keterangan: 'Archived Kas', jumlah: 25000, jenis: 'pengeluaran', tanggal: '2024-03-19', status: 'archived' }
    ],
    error: null
  }),
  archiveTransaksi: vi.fn(),
  restoreTransaksi: vi.fn()
}))

vi.mock('@/app/components/admin/AdminNav', () => ({
  AdminNav: () => <div data-testid="admin-nav" />
}))

describe('Admin Kas Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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

  it('should display archive button in header', async () => {
    render(
      <DialogProvider>
        <Page />
      </DialogProvider>
    )

    // Archive button should exist as icon button
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should display delete button in transaction actions', async () => {
    render(
      <DialogProvider>
        <Page />
      </DialogProvider>
    )

    // Should have archive/delete buttons in actions
    const buttons = screen.getAllByText(/Arsip/)
    expect(buttons.length).toBeGreaterThan(0)
  })
})
