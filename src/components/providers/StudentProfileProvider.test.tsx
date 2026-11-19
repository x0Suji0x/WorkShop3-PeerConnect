// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { StudentProfileProvider } from './StudentProfileProvider'
import { useStudentProfile } from '../../hooks/useStudentProfile'

const mockUseAuth = vi.hoisted(() => vi.fn())
vi.mock('../../lib/auth/AuthProvider', () => ({ useAuth: mockUseAuth }))

function ProfileProbe() {
  const { student, profileMode, needsProfileCompletion } = useStudentProfile()
  return (
    <>
      <p data-testid="name">{student.name}</p>
      <p data-testid="mode">{profileMode}</p>
      <p data-testid="incomplete">{String(needsProfileCompletion)}</p>
      <p data-testid="skills">{student.skills.length}</p>
    </>
  )
}

describe('StudentProfileProvider for signed-in accounts', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('starts from a blank profile using the authenticated account name', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'account-123' },
      status: 'signedIn',
      profile: {
        id: 'account-123',
        role: 'student',
        full_name: 'Meera Rao',
        company_name: null,
        avatar_url: null,
      },
    })

    render(
      <StudentProfileProvider>
        <ProfileProbe />
      </StudentProfileProvider>,
    )

    expect(screen.getByTestId('name').textContent).toBe('Meera Rao')
    expect(screen.getByTestId('mode').textContent).toBe('account')
    expect(screen.getByTestId('incomplete').textContent).toBe('true')
    expect(screen.getByTestId('skills').textContent).toBe('0')
  })
})
