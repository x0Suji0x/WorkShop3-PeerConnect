import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Lock, ExternalLink, X } from 'lucide-react'
import { GoogleAccountChooser } from './GoogleAccountChooser'
import { useAuth } from '../../hooks/useAuth'
import type { SocialAuthPayload, AuthUser } from '../../types/auth'

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
  const { loginWithGoogle } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSelectAccount = async (account: SocialAuthPayload) => {
    setIsSubmitting(true)
    setError(null)

    const res = await loginWithGoogle(account)
    setIsSubmitting(false)

    if (res.success && res.user) {
      onClose()
      onSuccess(res.user.role, res.user)
    } else {
      setError(res.error || 'Google sign-in failed. Please try again.')
    }
  }

  const handlePopOut = () => {
    const width = 500
    const height = 660
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    window.open(
      `/auth/google-popup?role=${defaultRole}`,
      'GoogleAccountsSignIn',
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
    )
    onClose()
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

      {/* macOS Popup Window Frame (Matching User's Screenshot) */}
      <div className="relative w-full max-w-[480px] rounded-2xl bg-[#1F1F1F] shadow-2xl border border-[#3C4043] overflow-hidden animate-scaleUp z-10 flex flex-col max-h-[92vh]">
        {/* macOS Title Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#2D2F31] border-b border-[#3C4043]/70 select-none">
          {/* Traffic Light Buttons */}
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
            <button
              type="button"
              onClick={handlePopOut}
              title="Open in separate window"
              className="h-3 w-3 rounded-full bg-[#27C93F] hover:brightness-90 transition cursor-pointer"
            />
          </div>

          {/* Centered Window Title */}
          <div className="text-[11px] font-medium text-[#9AA0A6] tracking-wide" id="google-window-title">
            Sign in - Google Accounts
          </div>

          {/* Pop-out to Separate Window */}
          <button
            type="button"
            onClick={handlePopOut}
            title="Pop out into separate browser window"
            className="text-[#9AA0A6] hover:text-[#E8EAED] transition p-0.5 rounded"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Browser URL Bar */}
        <div className="px-3.5 py-1.5 bg-[#202124] border-b border-[#3C4043]/60 flex items-center">
          <div className="w-full rounded-md bg-[#131314] border border-[#3C4043]/70 px-2.5 py-1 text-[11px] font-mono text-[#9AA0A6] flex items-center justify-between truncate select-none">
            <div className="flex items-center gap-1.5 truncate">
              <Lock className="h-3 w-3 text-[#34A853] shrink-0" />
              <span className="truncate">
                accounts.google.com/v3/signin/accountchooser?access_type=offline&client_id=peerconnect-oauth-2026
              </span>
            </div>
            <span className="text-[10px] text-[#34A853] font-sans font-medium shrink-0 ml-1">
              Secure
            </span>
          </div>
        </div>

        {/* Scrollable Window Content */}
        <div className="overflow-y-auto">
          <GoogleAccountChooser
            onSelectAccount={handleSelectAccount}
            defaultRole={defaultRole}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
