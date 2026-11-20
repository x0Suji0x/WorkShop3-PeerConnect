import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { LoadingState } from '../common/LoadingState'
import { useAuth } from '../../lib/auth/AuthProvider'
import { sanitizeReturnPath, type AccountRole } from '../../lib/auth/helpers'

function AuthUnavailable() {
  return (
    <main className="mx-auto max-w-xl p-12 text-center">
      <h1 className="text-2xl font-bold">Sign-in isn’t configured</h1>
      <p className="mt-3">Add the Supabase URL and publishable key to configure authentication.</p>
    </main>
  )
}

function ProfileLoadError({ error, retry }: { error: string | null; retry: () => Promise<void> }) {
  return (
    <main className="mx-auto max-w-xl p-12 text-center">
      <h1 className="text-2xl font-bold">Couldn't load your profile</h1>
      <p role="alert" className="mt-3">{error || 'Check your connection and try again.'}</p>
      <button type="button" className="mt-4 rounded-full border px-5 py-2" onClick={() => void retry().catch(() => {})}>
        Retry
      </button>
    </main>
  )
}

function RoleDenied({ role }: { role: AccountRole }) {
  return (
    <main className="mx-auto max-w-xl p-12 text-center">
      <h1 className="text-2xl font-bold">This page is for {role} accounts</h1>
      <p className="mt-3">Your account doesn’t have access to this page.</p>
    </main>
  )
}

export function ProtectedRoute({ children, role }: { children: ReactNode; role?: AccountRole }) {
  const auth = useAuth()
  const location = useLocation()

  if (auth.status === 'loading') return <LoadingState label="Checking your account…" />
  if (auth.status === 'profileError') {
    return <ProfileLoadError error={auth.profileError} retry={auth.refreshProfile} />
  }
  if (auth.status === 'unconfigured') return <AuthUnavailable />
  if (auth.status === 'signedOut') {
    const path = sanitizeReturnPath(`${location.pathname}${location.search}${location.hash}`) ?? '/dashboard'
    return <Navigate replace to={`/signin?next=${encodeURIComponent(path)}`} />
  }
  if (!auth.profile) return <LoadingState label="Loading your profile…" />
  if (!auth.profile.role) return <Navigate replace to="/auth/choose-role" />
  if (role && auth.profile.role !== role) return <RoleDenied role={role} />

  return <>{children}</>
}

export function RoleRoute({ children, role }: { children: ReactNode; role: AccountRole }) {
  return <ProtectedRoute role={role}>{children}</ProtectedRoute>
}
