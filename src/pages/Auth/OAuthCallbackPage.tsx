import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { AuthUser } from '../../types/auth'

const TOKEN_KEY = 'peerconnect_token'
const ROLE_KEY = 'peerconnect_active_role'
const USER_KEY = 'peerconnect_user'

interface SessionResponse {
  user?: AuthUser
  token?: string
  error?: string
}

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState('Finishing your secure sign-in…')

  useEffect(() => {
    const reportError = (error: string) => {
      setMessage(error)
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'GOOGLE_SIGNIN_ERROR', error }, window.location.origin)
      }
    }

    const providerError = searchParams.get('error')
    if (providerError) {
      reportError(providerError)
      return
    }

    let active = true

    const completeSignIn = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' })
        const data = (await response.json()) as SessionResponse

        if (!response.ok || !data.user || !data.token) {
          throw new Error(data.error || 'We could not complete your Google sign-in.')
        }

        try {
          localStorage.setItem(TOKEN_KEY, data.token)
          localStorage.setItem(ROLE_KEY, data.user.role)
          localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        } catch {
          // The HTTP-only session cookie remains available if storage is blocked.
        }

        if (!active) return

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: 'GOOGLE_SIGNIN_SUCCESS', role: data.user.role, user: data.user, token: data.token },
            window.location.origin
          )
          setMessage('Signed in. You can close this window.')
          window.setTimeout(() => window.close(), 350)
          return
        }

        window.location.replace(`/dashboard?role=${data.user.role}`)
      } catch (error) {
        if (active) {
          reportError(error instanceof Error ? error.message : 'We could not complete your Google sign-in.')
        }
      }
    }

    void completeSignIn()
    return () => {
      active = false
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1F1F1F] px-6 text-center text-[#E8EAED]">
      <div className="w-full max-w-sm rounded-3xl border border-[#3C4043] bg-[#202124] p-8 shadow-2xl">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
          <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        </div>
        <p className="text-base font-semibold">{message}</p>
      </div>
    </div>
  )
}
