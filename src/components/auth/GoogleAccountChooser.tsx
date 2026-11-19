import { useState } from 'react'
import { User, ChevronDown, Check, ArrowLeft } from 'lucide-react'
import type { SocialAuthPayload } from '../../types/auth'

export interface GoogleAccount {
  name: string
  email: string
  avatarColor: string // hex color for letter avatar or img url
  avatarInitial?: string
  avatarUrl?: string
  type?: string
  role?: 'student' | 'client'
}

const DEFAULT_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    name: 'Kritagya Gour',
    email: 'kritagya.gour19@gmail.com',
    avatarColor: '#8E24AA', // Purple (matching screenshot)
    avatarInitial: 'K',
    role: 'student',
  },
  {
    name: 'Kritagya Gour',
    email: 'kritagyagour40@gmail.com',
    avatarColor: '#E64A19', // Orange (matching screenshot)
    avatarInitial: 'K',
    role: 'student',
  },
  {
    name: 'Sofia Rodriguez',
    email: 'sofia.rodriguez@nid.edu',
    avatarColor: '#00897B',
    avatarInitial: 'S',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    type: 'National Institute of Design (.edu)',
    role: 'student',
  },
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@iitb.ac.in',
    avatarColor: '#1E88E5',
    avatarInitial: 'A',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    type: 'IIT Bombay (.ac.in)',
    role: 'student',
  },
]

interface GoogleAccountChooserProps {
  onSelectAccount: (payload: SocialAuthPayload) => Promise<void>
  defaultRole?: 'student' | 'client'
  isSubmitting?: boolean
  error?: string | null
}

export function GoogleAccountChooser({
  onSelectAccount,
  defaultRole = 'student',
  isSubmitting = false,
  error = null,
}: GoogleAccountChooserProps) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [isAnotherAccountMode, setIsAnotherAccountMode] = useState(false)
  const [customEmail, setCustomEmail] = useState('')
  const [customName, setCustomName] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)

  const handleAccountClick = async (account: GoogleAccount) => {
    if (isSubmitting) return
    setSelectedEmail(account.email)
    await onSelectAccount({
      email: account.email,
      fullName: account.name,
      avatarUrl: account.avatarUrl,
      role: account.role || defaultRole,
    })
  }

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setInputError('Enter a valid email address')
      return
    }
    setInputError(null)
    setSelectedEmail(customEmail.trim())

    const derivedName = customName.trim() || customEmail.split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())

    await onSelectAccount({
      email: customEmail.trim(),
      fullName: derivedName,
      role: defaultRole,
    })
  }

  return (
    <div className="relative w-full text-[#E8EAED] font-sans antialiased">
      {/* Google Linear Loading Progress Bar */}
      {isSubmitting && (
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden bg-[#3C4043] rounded-t-lg z-20">
          <div className="h-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] animate-pulse w-full" />
        </div>
      )}

      {/* Main Content Card */}
      <div className="p-6 sm:p-8">
        {/* Top Header: Google G + "Sign in with Google" */}
        <div className="flex items-center gap-2 mb-6">
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
          <span className="text-sm font-medium text-[#E8EAED]">Sign in with Google</span>
        </div>

        {/* App Logo & Header */}
        <div className="flex flex-col items-start mb-6">
          {/* PeerConnect App Badge (matching the Claude tile in screenshot) */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D3829] to-[#124B38] border border-[#08A876]/40 shadow-sm mb-4">
            <span className="text-base font-black tracking-tight text-[#08C58A]">P</span>
          </div>

          <h1 className="text-[22px] sm:text-[24px] font-normal sm:font-medium text-[#E8EAED] tracking-tight">
            {isAnotherAccountMode ? 'Sign in' : 'Choose an account'}
          </h1>
          <p className="mt-1 text-sm text-[#9AA0A6]">
            to continue to{' '}
            <span className="text-[#8AB4F8] hover:underline cursor-pointer font-medium">
              PeerConnect
            </span>
          </p>
        </div>

        {(error || inputError) && (
          <div className="mb-4 rounded-lg bg-red-950/60 border border-red-500/50 p-3 text-xs text-red-200">
            {error || inputError}
          </div>
        )}

        {!isAnotherAccountMode ? (
          <>
            {/* Accounts List (Exact Google Accounts Styling) */}
            <div className="divide-y divide-[#3C4043]/60 border-t border-b border-[#3C4043]/60 -mx-6 sm:-mx-8">
              {DEFAULT_GOOGLE_ACCOUNTS.map((account) => {
                const isCurrent = selectedEmail === account.email && isSubmitting
                return (
                  <button
                    key={account.email}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleAccountClick(account)}
                    className="flex w-full items-center justify-between px-6 sm:px-8 py-3.5 hover:bg-[#28292A] transition-colors text-left focus:outline-none focus:bg-[#28292A] group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Avatar */}
                      {account.avatarUrl ? (
                        <img
                          src={account.avatarUrl}
                          alt={account.name}
                          className="h-9 w-9 rounded-full object-cover shrink-0 border border-[#3C4043]"
                        />
                      ) : (
                        <div
                          style={{ backgroundColor: account.avatarColor }}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white font-medium text-sm shadow-xs"
                        >
                          {account.avatarInitial || account.name.charAt(0)}
                        </div>
                      )}

                      {/* Text */}
                      <div className="min-w-0 truncate">
                        <p className="text-sm font-medium text-[#E8EAED] truncate group-hover:text-white">
                          {account.name}
                        </p>
                        <p className="text-xs text-[#9AA0A6] truncate">{account.email}</p>
                      </div>
                    </div>

                    {isCurrent ? (
                      <div className="h-4 w-4 shrink-0 rounded-full border-2 border-[#8AB4F8] border-t-transparent animate-spin ml-2" />
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#9AA0A6] ml-2">
                        <Check className="h-4 w-4 text-[#8AB4F8]" />
                      </div>
                    )}
                  </button>
                )
              })}

              {/* Use Another Account Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsAnotherAccountMode(true)}
                className="flex w-full items-center gap-3.5 px-6 sm:px-8 py-3.5 hover:bg-[#28292A] transition-colors text-left focus:outline-none focus:bg-[#28292A] group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#5F6368] text-[#9AA0A6] group-hover:text-[#E8EAED] group-hover:border-[#9AA0A6] transition-colors">
                  <User className="h-4.5 w-4.5" />
                </div>
                <span className="text-sm font-medium text-[#E8EAED] group-hover:text-white">
                  Use another account
                </span>
              </button>
            </div>

            {/* Legal Notice */}
            <p className="mt-7 text-xs text-[#9AA0A6] leading-relaxed">
              Before using this app, you can review PeerConnect's{' '}
              <a href="/privacy" className="text-[#8AB4F8] hover:underline font-medium">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/terms" className="text-[#8AB4F8] hover:underline font-medium">
                Terms of Service
              </a>
              .
            </p>
          </>
        ) : (
          /* Use Another Account Screen */
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <button
              type="button"
              onClick={() => setIsAnotherAccountMode(false)}
              className="inline-flex items-center gap-1.5 text-xs text-[#8AB4F8] hover:underline mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to accounts
            </button>

            <div>
              <label htmlFor="google-custom-email" className="block text-xs font-medium text-[#9AA0A6] mb-1">
                Email or phone
              </label>
              <input
                id="google-custom-email"
                type="email"
                required
                autoFocus
                placeholder="yourname@gmail.com or @college.edu"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full rounded-lg bg-[#202124] border border-[#5F6368] px-3.5 py-3 text-sm text-[#E8EAED] outline-none focus:border-[#8AB4F8] focus:ring-1 focus:ring-[#8AB4F8] placeholder-[#5F6368]"
              />
            </div>

            <div>
              <label htmlFor="google-custom-name" className="block text-xs font-medium text-[#9AA0A6] mb-1">
                Full Name (optional)
              </label>
              <input
                id="google-custom-name"
                type="text"
                placeholder="Your name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full rounded-lg bg-[#202124] border border-[#5F6368] px-3.5 py-3 text-sm text-[#E8EAED] outline-none focus:border-[#8AB4F8] focus:ring-1 focus:ring-[#8AB4F8] placeholder-[#5F6368]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsAnotherAccountMode(false)}
                className="text-xs font-medium text-[#8AB4F8] hover:underline"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#8AB4F8] px-6 py-2 text-xs font-medium text-[#202124] hover:bg-[#A8C7FA] transition disabled:opacity-50"
              >
                {isSubmitting ? 'Signing in...' : 'Next'}
              </button>
            </div>
          </form>
        )}

        {/* Footer: Language selector and Help / Privacy / Terms links */}
        <div className="mt-8 pt-4 border-t border-[#3C4043]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#9AA0A6]">
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#E8EAED] transition-colors">
            <span>English (United States)</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-[#E8EAED] cursor-pointer transition-colors">Help</span>
            <span className="hover:text-[#E8EAED] cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-[#E8EAED] cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </div>
  )
}
