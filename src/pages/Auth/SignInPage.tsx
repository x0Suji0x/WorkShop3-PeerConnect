import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Building2, Eye, EyeOff, GraduationCap, Mail, Lock } from 'lucide-react'
import { authRoutes, routes } from '../../app/routes'
import { useAuth } from '../../lib/auth/AuthProvider'
import { sanitizeReturnPath } from '../../lib/auth/helpers'

type AccountRole = 'student' | 'client'
type ClientMode = 'signin' | 'register'

export function SignInPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const role: AccountRole = searchParams.get('role') === 'client' ? 'client' : 'student'
  const clientMode: ClientMode = searchParams.get('mode') === 'register' ? 'register' : 'signin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [confirmationRequired, setConfirmationRequired] = useState(false)

  const nextPath = sanitizeReturnPath(searchParams.get('next')) ?? routes.dashboard

  const updateSearch = (nextRole: AccountRole, nextMode?: ClientMode) => {
    const params = new URLSearchParams()
    params.set('role', nextRole)
    if (nextMode === 'register') params.set('mode', 'register')
    const next = searchParams.get('next')
    if (next) params.set('next', next)
    setSearchParams(params)
    setError('')
    setNotice('')
    setConfirmationRequired(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (role === 'client' && clientMode === 'register') {
      if (!fullName.trim() || !companyName.trim()) {
        setError('Enter your name and company or organization name.')
        return
      }
      if (password.length < 8) {
        setError('Choose a password with at least 8 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    if (!email.trim() || !password) {
      setError('Enter your email address and password.')
      return
    }

    setIsLoading(true)
    try {
      if (role === 'client' && clientMode === 'register') {
        const result = await auth.signUp(
          email.trim(),
          password,
          'client',
          fullName.trim(),
          companyName.trim(),
        )
        setConfirmationRequired(result.confirmationRequired)
        if (result.confirmationRequired) {
          setNotice('Check your email to confirm your account before signing in.')
          return
        }
      } else {
        await auth.signInWithPassword(email.trim(), password)
      }

      navigate(nextPath, { replace: true })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to continue. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const continueWithGoogle = async () => {
    setError('')
    setNotice('')
    setIsLoading(true)
    try {
      await auth.signInWithGoogle(role)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to continue with Google.')
      setIsLoading(false)
    }
  }

  const resendConfirmation = async () => {
    setError('')
    setIsLoading(true)
    try {
      await auth.resendSignupConfirmation(email.trim())
      setNotice('If this address has a pending account, a confirmation email is on its way.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to resend the confirmation email.')
    } finally {
      setIsLoading(false)
    }
  }

  const requestPasswordReset = async () => {
    setError('')
    setNotice('')
    if (!email.trim()) {
      setError('Enter your email address first.')
      return
    }

    setIsLoading(true)
    try {
      await auth.resetPassword(email.trim())
      setNotice('If this address has an account, password reset instructions will be sent.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to request a password reset.')
    } finally {
      setIsLoading(false)
    }
  }

  if (auth.status === 'unconfigured') {
    return (
      <main className="peer-page-surface flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <section className="peer-card-glass w-full max-w-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-[#171916]">Sign-in isn’t configured</h1>
          <p className="mt-3 text-sm text-[#525A55]">
            Add the Supabase project URL and publishable key to enable accounts.
          </p>
          <Link className="mt-5 inline-block font-semibold text-[#087a59]" to={routes.home}>Back to PeerConnect</Link>
        </section>
      </main>
    )
  }

  const isClientRegistration = role === 'client' && clientMode === 'register'
  const title = isClientRegistration
    ? 'Create a client account'
    : role === 'client'
      ? 'Find the right student talent'
      : 'Welcome back to PeerConnect'

  return (
    <main className="peer-page-surface relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="peer-ambient-glow peer-glow-gold -left-24 -top-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-rose -right-24 top-1/3 h-96 w-96" />
      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="grid grid-cols-2 rounded-2xl border border-black/10 bg-white/75 p-1.5 shadow-sm backdrop-blur">
          {(['student', 'client'] as const).map((tabRole) => (
            <button
              key={tabRole}
              type="button"
              aria-pressed={role === tabRole}
              onClick={() => updateSearch(tabRole)}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold ${
                role === tabRole ? 'bg-[#123D30] text-white' : 'text-[#525A55] hover:bg-white'
              }`}
            >
              {tabRole === 'student' ? <GraduationCap size={17} /> : <Building2 size={17} />}
              {tabRole === 'student' ? 'Student' : 'Client'}
            </button>
          ))}
        </div>

        <header className="text-center">
          <div className="peer-eyebrow-pill mb-3 inline-flex">
            <span className="dot" aria-hidden="true" />
            {role === 'student' ? 'STUDENT NETWORK' : 'CLIENT WORKSPACE'}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#171916]">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#525A55]">
            {isClientRegistration
              ? 'Create an account to review applicants and choose student collaborators.'
              : role === 'client'
                ? 'Sign in to browse student profiles and manage your applicant shortlist.'
                : 'Sign in to continue to your projects and student profile.'}
          </p>
        </header>

        {role === 'client' && (
          <div className="flex border-b border-black/10 text-sm font-semibold">
            <button
              type="button"
              onClick={() => updateSearch('client', 'signin')}
              className={`flex-1 border-b-2 py-2 ${clientMode === 'signin' ? 'border-[#08A876] text-[#123D30]' : 'border-transparent text-[#777A72]'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => updateSearch('client', 'register')}
              className={`flex-1 border-b-2 py-2 ${clientMode === 'register' ? 'border-[#08A876] text-[#123D30]' : 'border-transparent text-[#777A72]'}`}
            >
              Register company
            </button>
          </div>
        )}

        {!isClientRegistration && (
          <button
            type="button"
            onClick={() => void continueWithGoogle()}
            disabled={isLoading}
            className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-[#171916] shadow-sm transition hover:bg-[#FAF8F5] disabled:opacity-60"
          >
            Continue with Google
          </button>
        )}

        <form onSubmit={(event) => void handleSubmit(event)} className="peer-card-glass space-y-4 p-6 shadow-xl sm:p-7">
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-[#123D30]">{notice}</p>}

          {isClientRegistration && (
            <>
              <label className="block text-sm font-semibold text-[#171916]" htmlFor="client-full-name">
                Your full name
                <input
                  id="client-full-name"
                  name="fullName"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D8DDD7] bg-white px-3 py-2.5 font-normal"
                />
              </label>
              <label className="block text-sm font-semibold text-[#171916]" htmlFor="client-company-name">
                Company or organization
                <input
                  id="client-company-name"
                  name="companyName"
                  autoComplete="organization"
                  required
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D8DDD7] bg-white px-3 py-2.5 font-normal"
                />
              </label>
            </>
          )}

          <label className="block text-sm font-semibold text-[#171916]" htmlFor="auth-email">
            {role === 'client' ? 'Work email' : 'Email address'}
            <span className="relative mt-1.5 block">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#777A72]" size={17} />
              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-[#D8DDD7] bg-white py-2.5 pl-10 pr-3 font-normal"
              />
            </span>
          </label>

          <label className="block text-sm font-semibold text-[#171916]" htmlFor="auth-password">
            Password
            <span className="relative mt-1.5 block">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#777A72]" size={17} />
              <input
                id="auth-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isClientRegistration ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[#D8DDD7] bg-white py-2.5 pl-10 pr-12 font-normal"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777A72]"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>

          {isClientRegistration && (
            <>
              <label className="block text-sm font-semibold text-[#171916]" htmlFor="auth-confirm-password">
                Confirm password
                <input
                  id="auth-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#D8DDD7] bg-white px-3 py-2.5 font-normal"
                />
              </label>
              <p className="text-xs leading-relaxed text-[#777A72]">
                Email confirmation only confirms access to that email address. It does not verify a student or business.
              </p>
            </>
          )}

          {!isClientRegistration && (
            <div className="flex justify-end">
              <button type="button" onClick={() => void requestPasswordReset()} disabled={isLoading} className="text-xs font-semibold text-[#087a59] hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123D30] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0E3127] disabled:opacity-60"
          >
            {isLoading
              ? 'Please wait…'
              : isClientRegistration
                ? 'Create client account'
                : role === 'client'
                  ? 'Sign in to find applicants'
                  : 'Sign in'}
            <ArrowRight size={16} />
          </button>

          {confirmationRequired && (
            <button type="button" onClick={() => void resendConfirmation()} disabled={isLoading} className="w-full text-sm font-semibold text-[#087a59] hover:underline">
              Resend confirmation email
            </button>
          )}
        </form>

        <div className="space-y-2 text-center text-sm text-[#525A55]">
          {role === 'student' ? (
            <p>
              New to PeerConnect?{' '}
              <Link to={authRoutes.signupStudent} className="font-bold text-[#087a59] hover:underline">Create a student account</Link>
            </p>
          ) : !isClientRegistration ? (
            <p>
              Need a client account?{' '}
              <button type="button" onClick={() => updateSearch('client', 'register')} className="font-bold text-[#087a59] hover:underline">Register your company</button>
            </p>
          ) : null}
          <p>
            <Link to={routes.terms} className="underline">Terms</Link>
            {' · '}
            <Link to={routes.privacy} className="underline">Privacy</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
