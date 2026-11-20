import { describe, expect, it, vi } from 'vitest'
import { resolveAuthCallback } from './callback'

describe('resolveAuthCallback', () => {
  it('assigns the intended role when no role is set and clears the intent', async () => {
    const chooseRole = vi.fn(async () => {})
    const clearIntent = vi.fn()
    const result = await resolveAuthCallback({
      currentRole: null,
      intendedRole: 'student',
      returnPath: '/dashboard',
      chooseRole,
      clearIntent,
    })

    expect(chooseRole).toHaveBeenCalledWith('student')
    expect(result.destination).toBe('/dashboard')
    expect(clearIntent).toHaveBeenCalledOnce()
  })

  it('does not replace an existing role', async () => {
    const chooseRole = vi.fn(async () => {})
    const result = await resolveAuthCallback({
      currentRole: 'client',
      intendedRole: 'student',
      returnPath: null,
      chooseRole,
      clearIntent: () => {},
    })

    expect(chooseRole).not.toHaveBeenCalled()
    expect(result.destination).toBe('/dashboard')
  })

  it('sends users with no valid intent to role selection', async () => {
    for (const intendedRole of [null, 'admin']) {
      const result = await resolveAuthCallback({
        currentRole: null,
        intendedRole,
        returnPath: null,
        chooseRole: async () => {},
        clearIntent: () => {},
      })

      expect(result.destination).toBe('/auth/choose-role')
    }
  })

  it('shows OAuth errors without choosing a role and clears the intent', async () => {
    const chooseRole = vi.fn(async () => {})
    const clearIntent = vi.fn()
    const result = await resolveAuthCallback({
      oauthError: 'access_denied',
      currentRole: null,
      intendedRole: 'client',
      returnPath: null,
      chooseRole,
      clearIntent,
    })

    expect(result).toEqual({ destination: '/signin', error: 'access_denied' })
    expect(chooseRole).not.toHaveBeenCalled()
    expect(clearIntent).toHaveBeenCalledOnce()
  })
})
