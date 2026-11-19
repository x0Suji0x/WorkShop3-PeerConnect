import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink, LoaderCircle, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { startGoogleOAuth } from '../../lib/googleOAuth'
import type { AuthUser } from '../../types/auth'

interface GoogleSignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (role: 'student' | 'client', user?: AuthUser) => void
  defaultRole?: 'student' | 'client'
}

export function GoogleSignInModal({
  isOpen,
  onClose,
  onSuccess,
  defaultRole = 'student',
}: GoogleSignInModalProps) {
  const { completeExternalLogin } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data?.type === 'GOOGLE_SIGNIN_SUCCESS' && event.data?.user && event.data?.token) {
        const user = event.data.user as AuthUser
        completeExternalLogin(user, event.data.token as string)
        onClose()
        onSuccess(user.role, user)
      }

      if (event.data?.type === 'GOOGLE_SIGNIN_ERROR') {
        setIsSubmitting(false)
        setError(event.data.error || 'Google sign-in was not completed. Please try again.')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('message', handleMessage)
    }
  }, [completeExternalLogin, isOpen, onClose, onSuccess])

  if (!isOpen) return null

  const handleContinue = () => {
    setIsSubmitting(true)
    setError(null)
    startGoogleOAuth(defaultRole)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-window-title"
    >
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#3C4043] bg-[#1F1F1F] shadow-2xl animate-scaleUp">
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#2D2F31] border-b border-[#3C4043]/70 select-none">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="h-3 w-3 rounded-full bg-[#FF5F56] hover:brightness-90 transition cursor-pointer flex items-center justify-center group"
            >
              <X className="h-2 w-2 text-[#7F0000] opacity-0 group-hover:opacity-100" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Minimize"
              className="h-3 w-3 rounded-full bg-[#FFBD2E] hover:brightness-90 transition cursor-pointer"
            />
            <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="text-[11px] font-medium text-[#9AA0A6] tracking-wide" id="google-window-title">
            Continue with Google
          </div>
          <span className="w-3.5" aria-hidden="true" />
        </div>

        <div className="space-y-5 p-7 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
            <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#E8EAED]">Choose your Google account</h2>
            <p className="mt-2 text-sm leading-6 text-[#BDC1C6]">
              Google opens its own secure account selector. PeerConnect never receives your Google password.
            </p>
          </div>
          {error && <p role="alert" className="rounded-xl bg-[#5F2120] px-3 py-2 text-xs text-[#FAD2CF]">{error}</p>}
          <button
            type="button"
            onClick={handleContinue}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8AB4F8] px-4 py-3 text-sm font-bold text-[#202124] transition hover:bg-[#A8C7FA] disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
            {isSubmitting ? 'Waiting for Google…' : 'Continue on Google'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
