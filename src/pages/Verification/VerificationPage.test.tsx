// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { VerificationPage } from './VerificationPage'

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockVerificationRepository = vi.hoisted(() => ({
  getMine: vi.fn(),
  submit: vi.fn(),
}))

vi.mock('../../lib/auth/AuthProvider', () => ({ useAuth: mockUseAuth }))
vi.mock('../../repositories/verificationRepository', () => ({
  verificationRepository: mockVerificationRepository,
}))

const request = {
  id: 'request-1',
  userId: 'student-1',
  kind: 'student' as const,
  institutionOrCompany: 'Fergusson College',
  officialEmail: 'student@college.example',
  evidenceNotes: 'I am currently enrolled in the design program.',
  status: 'pending' as const,
  reviewerNote: null,
  createdAt: '2026-11-20T10:00:00.000Z',
  reviewedAt: null,
}

describe('VerificationPage', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { id: 'student-1' },
      profile: { role: 'student', is_verified: false },
    })
    mockVerificationRepository.getMine.mockResolvedValue(request)
    mockVerificationRepository.submit.mockResolvedValue(request)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('shows a pending request without showing a verified badge', async () => {
    render(<VerificationPage />)

    expect(await screen.findByText('Pending review')).toBeTruthy()
    expect(screen.queryByText('Verified student')).toBeNull()
    expect(screen.getByRole('heading', { name: 'A person reviews each request' })).toBeTruthy()
  })

  it('shows the verified badge only when the request is approved', async () => {
    mockVerificationRepository.getMine.mockResolvedValueOnce({ ...request, status: 'approved' })
    render(<VerificationPage />)

    expect(await screen.findByText('Verified student')).toBeTruthy()
  })

  it('submits a new request and displays the saved status', async () => {
    mockVerificationRepository.getMine.mockResolvedValueOnce(null)
    mockVerificationRepository.submit.mockResolvedValueOnce(request)
    render(<VerificationPage />)

    fireEvent.change(await screen.findByLabelText('College or university'), {
      target: { value: 'Fergusson College' },
    })
    fireEvent.change(screen.getByLabelText('Official email you want reviewed'), {
      target: { value: 'student@college.example' },
    })
    fireEvent.change(screen.getByLabelText('Context for the reviewer'), {
      target: { value: 'I am currently enrolled in the design program.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit for manual review' }))

    await waitFor(() => expect(mockVerificationRepository.submit).toHaveBeenCalledWith(
      'student-1',
      'student',
      {
        institutionOrCompany: 'Fergusson College',
        officialEmail: 'student@college.example',
        evidenceNotes: 'I am currently enrolled in the design program.',
      },
    ))
    expect(await screen.findByText('Pending review')).toBeTruthy()
  })
})
