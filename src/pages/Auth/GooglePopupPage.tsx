import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GoogleAccountChooser } from '../../components/auth/GoogleAccountChooser'
import type { SocialAuthPayload, AuthUser } from '../../types/auth'

export function GooglePopupPage() {
  const [searchParams] = useSearchParams()
  const role = (searchParams.get('role') as 'student' | 'client') || 'student'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Sign in - Google Accounts'
  }, [])

  const handleSelectAccount = async (payload: SocialAuthPayload) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as {
        token?: string
        user?: AuthUser
        error?: string
      }

      if (!response.ok || !data.token || !data.user) {
        setIsSubmitting(false)
        setError(data.error || 'Google sign-in failed. Please try again.')
        return
      }

      // Store in localStorage for this origin
      try {
        localStorage.setItem('peerconnect_token', data.token)
        localStorage.setItem('peerconnect_active_role', data.user.role)
        localStorage.setItem('peerconnect_user', JSON.stringify(data.user))
      } catch {
        // ignore
      }

      // Notify parent opener window
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_SIGNIN_SUCCESS',
            role: data.user.role,
            user: data.user,
            token: data.token,
          },
          window.location.origin
        )
        window.close()
      } else {
        // If not in a popup window, redirect directly
        window.location.href = `/dashboard?role=${data.user.role}`
      }
    } catch (err) {
      setIsSubmitting(false)
      setError('Cannot connect to authentication server.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#1F1F1F] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[460px] bg-[#1F1F1F] rounded-2xl border border-[#3C4043] shadow-2xl overflow-hidden">
        <GoogleAccountChooser
          onSelectAccount={handleSelectAccount}
          defaultRole={role}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </div>
  )
}
