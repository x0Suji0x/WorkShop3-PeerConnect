// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { AuthProvider, useAuth } from './AuthProvider'

const { mockSupabase, mockMapAuthError } = vi.hoisted(() => ({
  mockSupabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
    },
  },
  mockMapAuthError: vi.fn(),
}))

vi.mock('../supabase', () => ({
  isAuthConfigured: true,
  supabase: mockSupabase,
}))

vi.mock('./helpers', () => ({
  mapAuthError: mockMapAuthError,
  parseRole: (role: unknown) => role === 'student' || role === 'client' ? role : null,
}))

function SignInProbe() {
  const auth = useAuth()
  const [errorMessage, setErrorMessage] = useState('')

  const signIn = async () => {
    try {
      await auth.signInWithPassword('student@example.com', 'wrong-password')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return (
    <>
      <button type="button" onClick={() => void signIn()}>Sign in</button>
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </>
  )
}

describe('AuthProvider password sign-in error context', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('maps password sign-in errors with the signin context', async () => {
    const authError = new Error('Invalid login credentials')
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: authError })
    mockMapAuthError.mockReturnValue('Email or password is incorrect.')

    render(
      <AuthProvider>
        <SignInProbe />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByText('Sign in'))

    await waitFor(() => {
      expect(mockMapAuthError).toHaveBeenCalledWith(authError, 'signin')
      expect(screen.getByRole('alert').textContent).toBe('Email or password is incorrect.')
    })
  })
})
