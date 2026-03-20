import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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
    pembayaran: [],
    loading: false,
    refetch: vi.fn()
  })),
  verifikasiPembayaran: vi.fn()
}))

// Mocking AdminNav to avoid auth issues or complex nesting
vi.mock('@/app/components/admin/AdminNav', () => ({
  AdminNav: () => <div data-testid="admin-nav" />
}))

describe('Admin Iuran Page', () => {
  it('should render the list of tagihan', async () => {
    render(
      <DialogProvider>
        <Page />
      </DialogProvider>
    )

    expect(screen.getByText(/Kelola Iuran/i)).toBeInTheDocument()

    // Switch to Master Tagihan tab
    const masterTabButton = screen.getByText('Master Tagihan')
    fireEvent.click(masterTabButton)

    expect(screen.getByText('Tagihan Test')).toBeInTheDocument()
    // Finding currency - might be multiple if it appears in different sections
    const currencyElements = screen.getAllByText(/Rp.*100\.000/)
    expect(currencyElements.length).toBeGreaterThan(0)
  })
})
