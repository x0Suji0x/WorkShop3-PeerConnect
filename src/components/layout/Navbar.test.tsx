// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from './Navbar'

const mockUseAuth = vi.hoisted(() => vi.fn())
vi.mock('../../lib/auth/AuthProvider', () => ({ useAuth: mockUseAuth }))

function renderNavbar() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Navbar />
    </MemoryRouter>,
  )
}

describe('Navbar account actions', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('shows sign-in and Get Started for signed-out users', () => {
    mockUseAuth.mockReturnValue({ status: 'signedOut', profile: null, signOut: vi.fn() })
    renderNavbar()

    expect(screen.getAllByRole('link', { name: 'Sign In' }).length).toBeGreaterThan(0)
    const startLinks = screen.getAllByRole('link', { name: 'Get Started' })
    expect(startLinks.length).toBeGreaterThan(0)
    expect(startLinks.every((link) => link.getAttribute('href') === '/get-started')).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Toggle navigation menu' }))
    expect(screen.getAllByRole('link', { name: 'Sign in' }).some(
      (link) => link.getAttribute('href') === '/signin',
    )).toBe(true)
  })

  it('shows dashboard and sign-out actions for signed-in users', () => {
    const signOut = vi.fn(async () => {})
    mockUseAuth.mockReturnValue({
      status: 'signedIn',
      user: { id: 'user-1' },
      profile: { full_name: 'Aarav Mehta' },
      signOut,
    })
    renderNavbar()

    const dashboardLinks = screen.getAllByRole('link', { name: 'Dashboard' })
    expect(dashboardLinks.length).toBeGreaterThan(0)
    expect(dashboardLinks.every((link) => link.getAttribute('href') === '/dashboard')).toBe(true)
    fireEvent.click(screen.getAllByRole('button', { name: /sign out/i })[0])
    expect(signOut).toHaveBeenCalledOnce()
  })
})
