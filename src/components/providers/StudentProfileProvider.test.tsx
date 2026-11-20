// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { StudentProfileProvider } from './StudentProfileProvider'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import { StudentProfilePublishToggle } from '../profile/StudentProfilePublishToggle'
import type { Student } from '../../types'

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockStudentRepository = vi.hoisted(() => ({
  getById: vi.fn(),
  update: vi.fn(),
  getPublicProfiles: vi.fn(),
}))
vi.mock('../../lib/auth/AuthProvider', () => ({ useAuth: mockUseAuth }))
vi.mock('../../repositories/supabaseStudentRepository', () => ({ supabaseStudentRepository: mockStudentRepository }))

const student: Student = {
  id: 'account-123',
  name: 'Meera Rao',
  headline: 'Product design student',
  university: 'Fergusson College',
  college: 'Fergusson College',
  degree: 'B.Des',
  fieldOfStudy: 'Interaction Design',
  academicYear: '3rd Year',
  graduationYear: '2027',
  avatarUrl: '',
  coverImageUrl: '',
  hourlyRate: 0,
  projectsCompleted: 0,
  activeProjects: 0,
  applicationsSent: 0,
  profileViews: 0,
  rating: 0,
  reviewsCount: 0,
  availability: 'Available soon',
  availabilityPreferences: { paidProjects: true, collaborators: false, internships: true, events: false },
  skills: [{ name: 'Figma', category: 'design' }],
  interests: ['Product design'],
  featuredWork: '',
  bio: 'A student bio',
  about: 'A student bio',
  profileCompletion: 40,
  experiences: [],
  education: [],
  portfolioProjects: [],
  certifications: [],
  socialLinks: {},
  verifications: [],
  isPlusMember: false,
  isPublic: false,
  source: 'account',
}

const authState = {
  user: { id: student.id },
  status: 'signedIn',
  profile: {
    id: student.id,
    role: 'student',
    full_name: student.name,
    company_name: null,
    avatar_url: null,
  },
}

function ProfileProbe() {
  const { student: value, profileMode, needsProfileCompletion, isLoadingProfile, profileError, refreshStudentProfile } = useStudentProfile()
  return (
    <>
      <p data-testid="name">{value.name}</p>
      <p data-testid="mode">{profileMode}</p>
      <p data-testid="incomplete">{String(needsProfileCompletion)}</p>
      <p data-testid="skills">{value.skills.length}</p>
      <p data-testid="loading">{String(isLoadingProfile)}</p>
      <p data-testid="public">{String(value.isPublic)}</p>
      {profileError && <p role="alert">{profileError}</p>}
      <button type="button" onClick={() => void refreshStudentProfile()}>Retry profile</button>
      <StudentProfilePublishToggle />
    </>
  )
}

function renderProvider() {
  return render(<StudentProfileProvider><ProfileProbe /></StudentProfileProvider>)
}

describe('StudentProfileProvider', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue(authState)
    mockStudentRepository.getById.mockResolvedValue(student)
    mockStudentRepository.update.mockImplementation(async (_id: string, changes: Partial<Student>) => ({ ...student, ...changes }))
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('loads the signed-in student profile from the repository', async () => {
    renderProvider()
    expect((await screen.findByTestId('name')).textContent).toBe('Meera Rao')
    expect(screen.getByTestId('mode').textContent).toBe('account')
    expect(screen.getByTestId('skills').textContent).toBe('1')
    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(mockStudentRepository.getById).toHaveBeenCalledWith(student.id)
  })

  it('exposes the initial loading state until the profile request finishes', async () => {
    let resolveProfile: (profile: Student) => void = () => {}
    mockStudentRepository.getById.mockReturnValueOnce(new Promise<Student>((resolve) => { resolveProfile = resolve }))
    renderProvider()
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('true'))
    resolveProfile(student)
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
  })

  it('keeps a blank profile incomplete when the account has no profile row yet', async () => {
    mockStudentRepository.getById.mockResolvedValueOnce(null)
    renderProvider()
    expect((await screen.findByTestId('mode')).textContent).toBe('account')
    expect(screen.getByTestId('name').textContent).toBe('Meera Rao')
    expect(screen.getByTestId('incomplete').textContent).toBe('true')
    expect(screen.getByTestId('skills').textContent).toBe('0')
  })

  it('shows a profile fetch error and recovers when retried', async () => {
    mockStudentRepository.getById
      .mockRejectedValueOnce(new Error('Could not load this student profile. Please try again.'))
      .mockResolvedValueOnce(student)
    renderProvider()
    expect((await screen.findByRole('alert')).textContent).toContain('Could not load this student profile')
    fireEvent.click(screen.getByRole('button', { name: 'Retry profile' }))
    await waitFor(() => expect(screen.getByTestId('name').textContent).toBe('Meera Rao'))
    expect(screen.queryByRole('alert')).toBeNull()
    expect(mockStudentRepository.getById).toHaveBeenCalledTimes(2)
  })

  it('persists the Publish my profile toggle through the repository', async () => {
    renderProvider()
    const toggle = await screen.findByRole('checkbox', { name: 'Publish my profile' }) as HTMLInputElement
    expect(toggle.checked).toBe(false)
    fireEvent.click(toggle)
    await waitFor(() => expect(mockStudentRepository.update).toHaveBeenCalledWith(student.id, { isPublic: true }))
    expect((await screen.findByTestId('public')).textContent).toBe('true')
  })
})
