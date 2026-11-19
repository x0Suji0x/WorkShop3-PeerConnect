import { useState } from 'react'
import { X, UserPlus, Check } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import type { SocialAuthPayload, AuthUser } from '../../types/auth'

interface GoogleSignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (role: 'student' | 'client', user?: AuthUser) => void
  defaultRole?: 'student' | 'client'
}

const PRESET_GOOGLE_ACCOUNTS = [
  {
    name: 'Sofia Rodriguez',
    email: 'sofia.rodriguez@nid.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    type: 'College Student Account (.edu)',
    role: 'student' as const,
  },
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@iitb.ac.in',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    type: 'University Institutional Account (.ac.in)',
    role: 'student' as const,
  },
  {
    name: 'Vikram Sen',
    email: 'vikram.sen@apexstudio.co',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    type: 'Google Workspace for Business',
    role: 'client' as const,
  },
]

export function GoogleSignInModal({
  isOpen,
  onClose,
  onSuccess,
  defaultRole = 'student',
}: GoogleSignInModalProps) {
  const { loginWithGoogle } = useAuth()
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customEmail.trim()) {
      setError('Please provide a Google email address.')
      return
    }

    await handleSelectAccount({
      email: customEmail.trim(),
      fullName: customName.trim() || customEmail.split('@')[0],
      role: defaultRole,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-[#E5DED5] animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-[#747B75] hover:bg-[#F2ECE4] hover:text-[#171916] transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Google Header */}
        <div className="flex flex-col items-center text-center pb-5 border-b border-[#E8E1D8]">
          {/* Official Google G Logo */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs border border-[#E8E1D8] mb-3">
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h2 id="google-modal-title" className="text-lg font-bold text-[#171916]">
            Sign in with Google
          </h2>
          <p className="mt-1 text-xs text-[#747B75]">
            to continue to <strong className="text-[#171916]">PeerConnect</strong>
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Account Selector List */}
        {!isCustomMode ? (
          <div className="mt-5 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#747B75] px-1">
              Choose an account
            </p>

            {PRESET_GOOGLE_ACCOUNTS.filter((acc) => acc.role === defaultRole).map((acc) => (
              <button
                key={acc.email}
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  handleSelectAccount({
                    email: acc.email,
                    fullName: acc.name,
                    avatarUrl: acc.avatar,
                    role: acc.role,
                  })
                }
                className="group flex w-full items-center justify-between rounded-2xl border border-[#E8E1D8] p-3 text-left transition-all hover:border-[#176B4C] hover:bg-[#F8FAF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B4C]"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="h-10 w-10 rounded-full object-cover border border-[#E8E1D8]"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#171916] group-hover:text-[#176B4C] transition-colors">
                      {acc.name}
                    </p>
                    <p className="text-xs text-[#525A55] font-mono">{acc.email}</p>
                    <span className="text-[10px] text-[#747B75]">{acc.type}</span>
                  </div>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F3EA] text-[#176B4C] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check className="h-4 w-4" />
                </div>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsCustomMode(true)}
              className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-dashed border-[#CBD5E1] p-3 text-left text-xs font-semibold text-[#525A55] hover:border-[#176B4C] hover:bg-[#F8FAF7] transition-all"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <UserPlus className="h-4 w-4" />
              </div>
              <span>Use another account</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#171916]">Add Google Account</span>
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="text-xs text-[#176B4C] hover:underline"
              >
                ← Back to accounts
              </button>
            </div>

            <div>
              <label htmlFor="custom-google-email" className="block text-xs font-medium text-[#525A55]">
                Email address
              </label>
              <input
                id="custom-google-email"
                type="email"
                required
                placeholder="yourname@gmail.com or @college.edu"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#171916] outline-none focus:border-[#176B4C] focus:ring-2 focus:ring-[#176B4C]/20"
              />
            </div>

            <div>
              <label htmlFor="custom-google-name" className="block text-xs font-medium text-[#525A55]">
                Full Name (optional)
              </label>
              <input
                id="custom-google-name"
                type="text"
                placeholder="Your Full Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#171916] outline-none focus:border-[#176B4C] focus:ring-2 focus:ring-[#176B4C]/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-[#176B4C] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#12583E] transition disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Continue'}
            </button>
          </form>
        )}

        {/* Footer Disclosure */}
        <p className="mt-6 text-center text-[11px] leading-relaxed text-[#747B75]">
          To continue, Google will share your name, email address, and profile picture with PeerConnect.
        </p>
      </div>
    </div>
  )
}
