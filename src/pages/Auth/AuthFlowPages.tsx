import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { LoadingState } from '../../components/common/LoadingState'
import { useAuth } from '../../lib/auth/AuthProvider'
import { resolveAuthCallback } from '../../lib/auth/callback'

const INTENDED_ROLE_KEY = 'pc_intended_role'

export function AuthCallbackPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const finishSignIn = async () => {
      const oauthError = params.get('error_description') || params.get('error')

      if (auth.status === 'loading') return
      if (auth.status === 'profileError') {
        setError(auth.profileError || 'Could not load your account profile.')
        return
      }
      if (auth.status === 'unconfigured' || auth.status === 'signedOut') {
        setError(oauthError || 'No signed-in session was found. Please try again.')
        sessionStorage.removeItem(INTENDED_ROLE_KEY)
        return
      }

      try {
        const result = await resolveAuthCallback({
          oauthError,
          currentRole: auth.profile?.role ?? null,
          intendedRole: sessionStorage.getItem(INTENDED_ROLE_KEY),
          returnPath: params.get('next'),
          chooseRole: auth.chooseRole,
          clearIntent: () => sessionStorage.removeItem(INTENDED_ROLE_KEY),
        })

        if (result.error) {
          setError(result.error)
        } else if (active) {
          navigate(result.destination, { replace: true })
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Could not finish sign-in.')
      }
    }

    void finishSignIn()
    return () => {
      active = false
    }
  }, [auth.status, auth.profile, auth.profileError, auth.chooseRole, navigate, params])

  if (error) {
    return (
      <main className="mx-auto max-w-xl p-12 text-center">
        <p role="alert">{error}</p>
        {auth.status === 'profileError' ? (
          <button
            className="mt-4 rounded-full border px-5 py-2"
            onClick={() => {
              setError('')
              void auth.refreshProfile().catch((caught) => {
                setError(caught instanceof Error ? caught.message : 'Could not load your profile.')
              })
            }}
          >
            Retry
          </button>
        ) : (
          <Link className="mt-4 inline-block" to="/signin">Return to sign in</Link>
        )}
      </main>
    )
  }

  return <LoadingState label="Finishing sign-in…" />
}

export function ChooseRolePage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    if (auth.status === 'signedIn' && auth.profile?.role) {
      navigate('/dashboard', { replace: true })
    }
  }, [auth.status, auth.profile?.role, navigate])

  if (auth.status === 'loading') return <LoadingState />
  if (auth.status === 'profileError') {
    return (
      <main className="p-8 text-center">
        <p role="alert">{auth.profileError}</p>
        <button onClick={() => void auth.refreshProfile().catch(() => {})}>Retry</button>
      </main>
    )
  }
  if (auth.status === 'signedOut') return <Link to="/signin">Sign in first</Link>

  const selectRole = async (role: 'student' | 'client') => {
    setError('')
    try {
      await auth.chooseRole(role)
      navigate('/dashboard')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save your role.')
    }
  }

  return (
    <main className="mx-auto max-w-lg p-8">
      <h1 className="text-3xl font-bold">How will you use PeerConnect?</h1>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="rounded-xl border p-5" onClick={() => void selectRole('student')}>
          I’m a student
        </button>
        <button className="rounded-xl border p-5" onClick={() => void selectRole('client')}>
          I’m hiring
        </button>
      </div>
      {error && <p className="mt-4" role="alert">{error}</p>}
    </main>
  )
}

export function ResetPasswordPage() {
  const auth = useAuth()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password.length < 8) return setMessage('Use at least 8 characters.')
    if (password !== confirmation) return setMessage('Passwords do not match.')

    try {
      await auth.updatePassword(password)
      setMessage('Password updated.')
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Could not update your password.')
    }
  }

  return (
    <form className="mx-auto max-w-md space-y-4 p-8" onSubmit={(event) => void submit(event)}>
      <h1 className="text-2xl font-bold">Set a new password</h1>
      <input
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="New password"
      />
      <input
        type="password"
        autoComplete="new-password"
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        placeholder="Confirm password"
      />
      <button type="submit">Update password</button>
      {message && <p role="status">{message}</p>}
    </form>
  )
}
