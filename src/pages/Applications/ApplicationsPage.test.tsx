// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ApplicationsPage } from './ApplicationsPage'

const mockUseAuth = vi.hoisted(() => vi.fn())
const mockApplicationRepository = vi.hoisted(() => ({
  listMine: vi.fn(),
  withdraw: vi.fn(),
}))

vi.mock('../../lib/auth/AuthProvider', () => ({ useAuth: mockUseAuth }))
vi.mock('../../repositories/supabaseApplicationRepository', () => ({
  supabaseApplicationRepository: mockApplicationRepository,
}))

const application = {
  id: 'application-1',
  projectId: 'project-1',
  projectTitle: 'Build a portfolio',
  clientName: 'Campus Studio',
  studentId: 'student-1',
  coverLetter: 'I can build this.',
  status: 'submitted' as const,
  createdAt: '2026-11-20T10:00:00.000Z',
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/applications']}>
      <Routes><Route path="/applications" element={<ApplicationsPage />} /></Routes>
    </MemoryRouter>,
  )
}

describe('ApplicationsPage', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { id: 'student-1' },
      profile: { role: 'student' },
      status: 'signedIn',
    })
    mockApplicationRepository.listMine.mockResolvedValue([application])
    mockApplicationRepository.withdraw.mockResolvedValue(undefined)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('loads the signed-in student applications and withdraws through the repository', async () => {
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Build a portfolio' })).toBeTruthy()
    expect(screen.getByText('Submitted')).toBeTruthy()
    expect(mockApplicationRepository.listMine).toHaveBeenCalledWith('student-1')

    fireEvent.click(screen.getByRole('button', { name: 'Withdraw' }))

    await waitFor(() => expect(mockApplicationRepository.withdraw).toHaveBeenCalledWith('application-1'))
    expect(await screen.findByText('Withdrawn')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Withdraw' })).toBeNull()
  })

  it('shows a retryable error when loading applications fails', async () => {
    mockApplicationRepository.listMine.mockRejectedValueOnce(new Error('Could not load your applications.'))
    renderPage()

    expect((await screen.findByRole('alert')).textContent).toContain('Could not load your applications.')
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    await waitFor(() => expect(mockApplicationRepository.listMine).toHaveBeenCalledTimes(2))
  })
})
