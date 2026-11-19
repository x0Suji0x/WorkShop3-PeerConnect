// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ProtectedRoute, RoleRoute } from './RouteGuards'

const mockUseAuth = vi.hoisted(() => vi.fn())
vi.mock('../../lib/auth/AuthProvider', () => ({ useAuth: mockUseAuth }))

function LocationMarker() {
  const location = useLocation()
  return <output data-testid="location">{location.pathname + location.search}</output>
}

function makeProfile(role: 'student' | 'client' | null) {
  return {
    id: 'user-1',
    role,
    full_name: 'Test User',
    company_name: null,
    avatar_url: null,
  }
}

function renderGuard(
  auth: Record<string, unknown>,
  guard: 'protected' | 'student' = 'protected',
  path = '/projects/new?x=1',
) {
  mockUseAuth.mockReturnValue(auth)

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/signin"
          element={(
            <>
              <p data-testid="signin-marker">Sign-in target</p>
              <LocationMarker />
            </>
          )}
        />
        <Route
          path="/auth/choose-role"
          element={<p data-testid="role-marker">Role selection target</p>}
        />
        <Route
          path="*"
          element={(
            <>
              {guard === 'student' ? (
                <RoleRoute role="student"><p>Private child</p></RoleRoute>
              ) : (
                <ProtectedRoute><p>Private child</p></ProtectedRoute>
              )}
              <LocationMarker />
            </>
          )}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute and RoleRoute', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('shows the loading state', () => {
    renderGuard({ status: 'loading', profile: null })
    expect(screen.getByText('Checking your account…')).toBeTruthy()
  })

  it('waits for a signed-in profile that is still loading', () => {
    renderGuard({ status: 'loading', profile: null, user: { id: 'user-1' } })
    expect(screen.getByText('Checking your account…')).toBeTruthy()
    expect(screen.queryByTestId('signin-marker')).toBeNull()
    expect(screen.queryByTestId('role-marker')).toBeNull()
  })

  it('shows a clear message when authentication is unconfigured', () => {
    renderGuard({ status: 'unconfigured', profile: null })
    expect(screen.getByText(/sign-in isn’t configured/i)).toBeTruthy()
  })

  it('redirects signed-out users to sign-in with their current path', () => {
    renderGuard({ status: 'signedOut', profile: null })
    expect(screen.getByTestId('signin-marker')).toBeTruthy()
    expect(screen.getByTestId('location').textContent).toBe(
      '/signin?next=%2Fprojects%2Fnew%3Fx%3D1',
    )
  })

  it('redirects signed-in users with no role to role selection', () => {
    renderGuard({ status: 'signedIn', profile: makeProfile(null) })
    expect(screen.getByTestId('role-marker')).toBeTruthy()
  })

  it('shows a profile error and retries when requested', () => {
    const retry = vi.fn(async () => {})
    renderGuard({
      status: 'profileError',
      profile: null,
      profileError: 'Network unavailable',
      refreshProfile: retry,
    })

    expect(screen.getByText('Network unavailable')).toBeTruthy()
    screen.getByText('Retry').click()
    expect(retry).toHaveBeenCalledOnce()
  })

  it('denies a client from a student-only route without rendering children', () => {
    renderGuard({ status: 'signedIn', profile: makeProfile('client') }, 'student')
    expect(screen.getByText('This page is for student accounts')).toBeTruthy()
    expect(screen.queryByText('Private child')).toBeNull()
  })

  it('renders children for the correct role', () => {
    renderGuard({ status: 'signedIn', profile: makeProfile('student') }, 'student')
    expect(screen.getByText('Private child')).toBeTruthy()
  })
})
