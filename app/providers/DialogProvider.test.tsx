import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { DialogProvider, useDialog } from './DialogProvider'
import React from 'react'

const TestComponent = () => {
  const { showAlert, showConfirm } = useDialog()
  return (
    <div>
      <button onClick={() => showAlert('Hello Alert')}>Show Alert</button>
      <button onClick={() => showConfirm('Are you sure?')}>Show Confirm</button>
    </div>
  )
}

describe('DialogProvider', () => {
  it('should show alert and close when OK is clicked', async () => {
    render(
      <DialogProvider>
        <TestComponent />
      </DialogProvider>
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Show Alert'))
    })

    expect(screen.getByText('Hello Alert')).toBeInTheDocument()
    expect(screen.getByText('Pemberitahuan')).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(screen.getByText('OK'))
    })

    expect(screen.queryByText('Hello Alert')).not.toBeInTheDocument()
  })

  it('should show confirm and resolve true on OK', async () => {
    let resolvedValue: boolean | null = null
    const TestConfirm = () => {
        const { showConfirm } = useDialog()
        return <button onClick={async () => { resolvedValue = await showConfirm('Confirm?') }}>Confirm</button>
    }

    render(
      <DialogProvider>
        <TestConfirm />
      </DialogProvider>
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Confirm'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText('OK'))
    })

    expect(resolvedValue).toBe(true)
  })

  it('should show confirm and resolve false on Batal', async () => {
    let resolvedValue: boolean | null = null
    const TestConfirm = () => {
        const { showConfirm } = useDialog()
        return <button onClick={async () => { resolvedValue = await showConfirm('Confirm?') }}>Confirm</button>
    }

    render(
      <DialogProvider>
        <TestConfirm />
      </DialogProvider>
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Confirm'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Batal'))
    })

    expect(resolvedValue).toBe(false)
  })
})
