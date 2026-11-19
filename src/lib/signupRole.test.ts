import { describe, expect, it } from 'vitest'
import { parseSignupRole } from './signupRole'

describe('parseSignupRole', () => {
  it('accepts supported signup roles', () => {
    expect(parseSignupRole('student')).toBe('student')
    expect(parseSignupRole('client')).toBe('client')
  })

  it('falls back for missing or unsupported values', () => {
    expect(parseSignupRole(null)).toBeNull()
    expect(parseSignupRole(undefined)).toBeNull()
    expect(parseSignupRole('employer')).toBeNull()
  })
})
