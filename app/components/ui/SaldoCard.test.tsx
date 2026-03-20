import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SaldoCard } from './SaldoCard'
import React from 'react'

describe('SaldoCard', () => {
  it('should render saldo, masuk, and keluar correctly', () => {
    render(<SaldoCard saldo={1000000} masuk={1500000} keluar={500000} />)

    // Check if values are formatted correctly as Rupiah
    // Note: space between Rp and the number might vary (non-breaking space)
    expect(screen.getByText(/^Rp.1\.000\.000$/)).toBeInTheDocument()
    expect(screen.getByText(/^Rp.1\.500\.000$/)).toBeInTheDocument()
    expect(screen.getByText(/^Rp.500\.000$/)).toBeInTheDocument()
    
    expect(screen.getByText('Total Saldo Kas')).toBeInTheDocument()
    expect(screen.getByText('Masuk')).toBeInTheDocument()
    expect(screen.getByText('Keluar')).toBeInTheDocument()
  })
})
