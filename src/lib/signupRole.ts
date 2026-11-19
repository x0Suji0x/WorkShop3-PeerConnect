export type SignupRole = 'student' | 'client'

export function parseSignupRole(value: string | null | undefined): SignupRole | null {
  return value === 'student' || value === 'client' ? value : null
}
