export type AccountRole = 'student' | 'client'
export const parseRole = (value: unknown): AccountRole | null => value === 'student' || value === 'client' ? value : null

export function sanitizeReturnPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return null
  try { const url = new URL(value, 'https://peerconnect.invalid'); return url.origin === 'https://peerconnect.invalid' ? `${url.pathname}${url.search}${url.hash}` : null } catch { return null }
}

export function mapAuthError(error: unknown, context: 'signin' | 'general' = 'general'): string {
  const message = error instanceof Error ? error.message.toLowerCase() : ''
  if (context === 'signin' && /invalid login credentials|user not found|email not confirmed/.test(message)) return 'Email or password is incorrect, or the email still needs confirmation.'
  if (/weak password|password should/.test(message)) return 'Choose a stronger password with at least 8 characters.'
  if (/already registered|user already exists/.test(message)) return 'Unable to create this account with those details. Try signing in or resetting your password.'
  if (/rate limit|too many requests/.test(message)) return 'Too many attempts. Wait a little and try again.'
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}
