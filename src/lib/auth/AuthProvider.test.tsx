// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'

const { mockSupabase, mockMapAuthError, mockParseRole } = vi.hoisted(() => ({
  mockSupabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
      resend: vi.fn(),
    },
    from: vi.fn(),
    rpc: vi.fn(),
  },
  mockMapAuthError: vi.fn((error: unknown) => (
    error instanceof Error ? error.message : 'Something went wrong.'
  )),
  mockParseRole: vi.fn((role: unknown) => (
    role === 'student' || role === 'client' ? role : null
  )),
}))

vi.mock('../supabase', () => ({
  isAuthConfigured: true,
  supabase: mockSupabase,
}))

vi.mock('./helpers', () => ({
  mapAuthError: mockMapAuthError,
  parseRole: mockParseRole,
}))

import { AuthProvider, useAuth } from './AuthProvider'

type ProfileRow = {
  id: string
  role: string | null
  full_name: string | null
  company_name: string | null
  avatar_url: string | null
}

type ProfileResult = { data: ProfileRow | null; error: Error | null }
type SessionResult = { data: { session: Session | null }; error: Error | null }

let authListener: ((event: string, session: Session | null) => void) | null = null
const profileResponses: Array<() => Promise<ProfileResult>> = []
const statusHistory: string[] = []
let childMounts = 0
let childUnmounts = 0

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

function makeSession(id: string, token = `token-${id}`) {
  return {
    access_token: token,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: 4_000_000_000,
    refresh_token: `refresh-${id}`,
    user: {
      id,
      aud: 'authenticated',
      role: 'authenticated',
      email: `${id}@example.test`,
      app_metadata: {},
      user_metadata: {},
      created_at: '2026-01-01T00:00:00.000Z',
    },
  } as unknown as Session
}

function profile(id: string, role: string | null): ProfileResult {
  return {
    data: {
      id,
      role,
      full_name: `${id} Name`,
      company_name: null,
      avatar_url: null,
    },
    error: null,
  }
}

function queueProfile(result: ProfileResult | Promise<ProfileResult>) {
  profileResponses.push(() => Promise.resolve(result))
}

function Probe() {
  const auth = useAuth()
  useEffect(() => {
    statusHistory.push(auth.status)
  }, [auth.status])

  return (
    <main>
      <output data-testid="status">{auth.status}</output>
      <output data-testid="user">{auth.user?.id ?? 'none'}</output>
      <output data-testid="profile-role">
        {auth.profile ? auth.profile.role ?? 'null' : 'missing'}
      </output>
      <output data-testid="profile-error">{auth.profileError ?? ''}</output>
      <button onClick={() => void auth.refreshProfile().catch(() => {})}>Retry profile</button>
      <button onClick={() => void auth.chooseRole('student').catch(() => {})}>
        Choose student role
      </button>
      <button
        onClick={() => void auth.signInWithPassword('person@example.test', 'wrong').catch(() => {})}
      >
        Sign in
      </button>
      {auth.status === 'signedIn' && <MountedChild />}
    </main>
  )
}

function MountedChild() {
  useEffect(() => {
    childMounts += 1
    return () => {
      childUnmounts += 1
    }
  }, [])
  return <div data-testid="signed-in-child">Dashboard content</div>
}

function renderProvider() {
  return render(<AuthProvider><Probe /></AuthProvider>)
}

async function emitAuthEvent(event: string, nextSession: Session | null) {
  await act(async () => {
    authListener?.(event, nextSession)
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

describe('AuthProvider profile lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authListener = null
    profileResponses.length = 0
    statusHistory.length = 0
    childMounts = 0
    childUnmounts = 0

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })
    mockSupabase.auth.onAuthStateChange.mockImplementation((
      callback: (event: string, session: Session | null) => void,
    ) => {
      authListener = callback
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })
    mockSupabase.from.mockImplementation(() => {
      const query: Record<string, ReturnType<typeof vi.fn>> = {}
      query.select = vi.fn(() => query)
      query.eq = vi.fn(() => query)
      query.update = vi.fn(() => query)
      query.maybeSingle = vi.fn(() => {
        const response = profileResponses.shift()
        return response ? response() : Promise.resolve({ data: null, error: null })
      })
      return query
    })
    mockSupabase.rpc.mockResolvedValue({ error: null })
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null })
  })

  afterEach(() => cleanup())

  it('loads the initial session and then the role-bearing profile', async () => {
    const session = makeSession('student-1')
    const pendingSession = deferred<SessionResult>()
    mockSupabase.auth.getSession.mockReturnValue(pendingSession.promise)
    queueProfile(profile('student-1', 'student'))

    renderProvider()
    expect(screen.getByTestId('status').textContent).toBe('loading')

    await act(async () => {
      pendingSession.resolve({ data: { session }, error: null })
      await pendingSession.promise
    })

    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('signedIn'))
    expect(screen.getByTestId('user').textContent).toBe('student-1')
    expect(screen.getByTestId('profile-role').textContent).toBe('student')
  })

  it('keeps a profile with a null role signed in for role selection', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: makeSession('new-user') },
      error: null,
    })
    queueProfile(profile('new-user', null))

    renderProvider()

    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('signedIn'))
    expect(screen.getByTestId('profile-role').textContent).toBe('null')
  })

  it('shows profileError after a failed fetch and recovers on retry', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: makeSession('recovering-user') },
      error: null,
    })
    queueProfile({ data: null, error: new Error('Profile service unavailable.') })
    queueProfile(profile('recovering-user', 'client'))

    renderProvider()

    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('profileError'))
    expect(screen.getByTestId('profile-error').textContent).toBe('Profile service unavailable.')

    fireEvent.click(screen.getByRole('button', { name: 'Retry profile' }))
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('signedIn'))
    expect(screen.getByTestId('profile-role').textContent).toBe('client')
    expect(screen.getByTestId('profile-error').textContent).toBe('')
  })

  it.each(['TOKEN_REFRESHED', 'SIGNED_IN'])(
    'keeps signed-in UI mounted on a same-user %s event', async (event) => {
      const session = makeSession('steady-user')
      mockSupabase.auth.getSession.mockResolvedValue({ data: { session }, error: null })
      queueProfile(profile('steady-user', 'student'))
      renderProvider()
      await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('signedIn'))

      const requestCount = mockSupabase.from.mock.calls.length
      const mountCount = childMounts
      const unmountCount = childUnmounts
      statusHistory.length = 0

      await emitAuthEvent(event, makeSession('steady-user', 'refreshed-token'))

      expect(screen.getByTestId('status').textContent).toBe('signedIn')
      expect(screen.getByTestId('signed-in-child')).toBeTruthy()
      expect(mockSupabase.from).toHaveBeenCalledTimes(requestCount)
      expect(childMounts).toBe(mountCount)
      expect(childUnmounts).toBe(unmountCount)
      expect(statusHistory).not.toContain('loading')
    },
  )

  it('clears the old profile while loading a different user', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: makeSession('first-user') },
      error: null,
    })
    queueProfile(profile('first-user', 'student'))
    const pendingProfile = deferred<ProfileResult>()
    renderProvider()
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('signedIn'))

    queueProfile(pendingProfile.promise)
    await emitAuthEvent('SIGNED_IN', makeSession('second-user'))
    expect(screen.getByTestId('status').textContent).toBe('loading')
    expect(screen.getByTestId('profile-role').textContent).toBe('missing')
    expect(screen.getByTestId('user').textContent).toBe('second-user')

    await act(async () => pendingProfile.resolve(profile('second-user', 'client')))
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('signedIn'))
    expect(screen.getByTestId('profile-role').textContent).toBe('client')
  })

  it('clears the session, profile, and error on sign-out', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: makeSession('signed-in-user') },
      error: null,
    })
    queueProfile(profile('signed-in-user', 'student'))
    renderProvider()
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('signedIn'))

    await emitAuthEvent('SIGNED_OUT', null)

    expect(screen.getByTestId('status').textContent).toBe('signedOut')
    expect(screen.getByTestId('user').textContent).toBe('none')
    expect(screen.getByTestId('profile-role').textContent).toBe('missing')
    expect(screen.getByTestId('profile-error').textContent).toBe('')
    expect(screen.queryByTestId('signed-in-child')).toBeNull()
    expect(childUnmounts).toBe(1)
  })

  it('refreshes after chooseRole without flashing the loading state', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: makeSession('role-picker') },
      error: null,
    })
    queueProfile(profile('role-picker', null))
    const updatedProfile = deferred<ProfileResult>()
    renderProvider()
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('signedIn'))
    expect(screen.getByTestId('profile-role').textContent).toBe('null')
    statusHistory.length = 0

    queueProfile(updatedProfile.promise)
    fireEvent.click(screen.getByRole('button', { name: 'Choose student role' }))
    await waitFor(() => expect(mockSupabase.rpc).toHaveBeenCalledWith('choose_role', { new_role: 'student' }))
    await waitFor(() => expect(mockSupabase.from).toHaveBeenCalledTimes(2))

    expect(screen.getByTestId('status').textContent).toBe('signedIn')
    expect(screen.getByTestId('profile-role').textContent).toBe('null')
    expect(statusHistory).not.toContain('loading')

    await act(async () => updatedProfile.resolve(profile('role-picker', 'student')))
    await waitFor(() => expect(screen.getByTestId('profile-role').textContent).toBe('student'))
    expect(screen.getByTestId('status').textContent).toBe('signedIn')
  })

  it('maps password sign-in errors with the signin context', async () => {
    const wrongPassword = new Error('Invalid login credentials')
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: wrongPassword })
    renderProvider()

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(mockMapAuthError).toHaveBeenCalledWith(wrongPassword, 'signin'))
  })
})
