import { describe, expect, it } from 'vitest'
import { mapAuthError, parseRole, sanitizeReturnPath } from './helpers'

describe('parseRole', () => {
  it('accepts only supported account roles', () => {
    expect(parseRole('student')).toBe('student')
    expect(parseRole('client')).toBe('client')

    for (const value of ['admin', 'Employer', '', null, undefined, 1]) {
      expect(parseRole(value)).toBeNull()
    }
  })
})

describe('sanitizeReturnPath', () => {
  it('accepts safe relative paths', () => {
    expect(sanitizeReturnPath('/dashboard')).toBe('/dashboard')
    expect(sanitizeReturnPath('/projects/new?x=1')).toBe('/projects/new?x=1')
  })

  it('rejects external, malformed, and control-character paths', () => {
    const unsafePaths = [
      'https://evil.com',
      '//evil.com',
      '/\\evil.com',
      'javascript:alert(1)',
      '',
      null,
      '/path\nwith-newline',
      '/path\twith-tab',
    ]

    for (const path of unsafePaths) expect(sanitizeReturnPath(path)).toBeNull()
  })

  it('allows a caller to use a default path when validation fails', () => {
    expect(sanitizeReturnPath(null) || '/dashboard').toBe('/dashboard')
  })
})

describe('mapAuthError', () => {
  it('uses the same sign-in message for credential and confirmation failures', () => {
    const safeMessage = 'Email or password is incorrect, or the email still needs confirmation.'

    expect(mapAuthError(new Error('Invalid login credentials'), 'signin')).toBe(safeMessage)
    expect(mapAuthError(new Error('Email not confirmed'), 'signin')).toBe(safeMessage)
    expect(mapAuthError(new Error('User not found'), 'signin')).toBe(safeMessage)
  })

  it('maps known account errors and preserves useful unknown messages', () => {
    expect(mapAuthError(new Error('Weak password'))).toMatch(/stronger password/i)
    expect(mapAuthError(new Error('User already registered'))).toMatch(/unable to create/i)
    expect(mapAuthError(new Error('Rate limit exceeded'))).toMatch(/too many/i)
    expect(mapAuthError(new Error('custom failure'))).toBe('custom failure')
  })
})
