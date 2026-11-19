export type SignupRole = 'student' | 'employer'

export function parseSignupRole(value: string | null | undefined): SignupRole | null {
  return value === 'student' || value === 'employer' ? value : null
}
