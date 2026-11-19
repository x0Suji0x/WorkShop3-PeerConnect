// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SignInPage } from './SignInPage'

const mockUseAuth = vi.hoisted(() => vi.fn())
vi.mock('../../lib/auth/AuthProvider', () => ({ useAuth: mockUseAuth }))

function LocationMarker() {
  const location = useLocation()
  return <output data-testid="location">{location.pathname + location.search}</output>
}

function makeAuth(overrides: Record<string, unknown> = {}) {
  return {
    status: 'signedOut',
    signInWithPassword: vi.fn(async () => {}),
    signUp: vi.fn(async () => ({ confirmationRequired: false })),
    signInWithGoogle: vi.fn(async () => {}),
    resetPassword: vi.fn(async () => {}),
    resendSignupConfirmation: vi.fn(async () => {}),
    ...overrides,
  }
}

function renderSignIn(path = '/signin') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/applications" element={<p>Applications destination</p>} />
        <Route path="*" element={<LocationMarker />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SignInPage', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('signs in with Supabase and honors a sanitized next path', async () => {
    const auth = makeAuth()
    mockUseAuth.mockReturnValue(auth)
    renderSignIn('/signin?next=%2Fapplications')

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'student@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secure-pass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(auth.signInWithPassword).toHaveBeenCalledWith(
      'student@example.com',
      'secure-pass',
    ))
    expect(await screen.findByText('Applications destination')).toBeTruthy()
  })

  it('shows a wrong-password error from the auth layer', async () => {
    const auth = makeAuth({
      signInWithPassword: vi.fn(async () => {
        throw new Error('Email or password is incorrect, or the email still needs confirmation.')
      }),
    })
    mockUseAuth.mockReturnValue(auth)
    renderSignIn()

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'student@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-pass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect((await screen.findByRole('alert')).textContent).toMatch(/email or password is incorrect/i)
  })

  it('shows confirmation instructions and a resend action after client registration', async () => {
    const auth = makeAuth({
      signUp: vi.fn(async () => ({ confirmationRequired: true })),
    })
    mockUseAuth.mockReturnValue(auth)
    renderSignIn('/signin?role=client&mode=register')

    fireEvent.change(screen.getByLabelText('Your full name'), { target: { value: 'Aarav Mehta' } })
    fireEvent.change(screen.getByLabelText('Company or organization'), { target: { value: 'Studio Co' } })
    fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'aarav@studio.co' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secure-pass' } })
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'secure-pass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create client account' }))

    expect((await screen.findByRole('status')).textContent).toMatch(/check your email to confirm/i)
    expect(auth.signUp).toHaveBeenCalledWith(
      'aarav@studio.co', 'secure-pass', 'client', 'Aarav Mehta', 'Studio Co',
    )
    expect(screen.getByRole('button', { name: 'Resend confirmation email' })).toBeTruthy()
  })

  it('shows a clear unconfigured state', () => {
    mockUseAuth.mockReturnValue(makeAuth({ status: 'unconfigured' }))
    renderSignIn()

    expect(screen.getByRole('heading', { name: 'Sign-in isn’t configured' })).toBeTruthy()
    expect(screen.queryByLabelText('Email address')).toBeNull()
  })
})
