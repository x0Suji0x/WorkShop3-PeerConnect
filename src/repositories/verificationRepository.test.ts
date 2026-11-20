import { describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createVerificationRepository } from './verificationRepository'

const row = {
  id: 'request-1',
  user_id: 'student-1',
  kind: 'student',
  institution_or_company: 'Fergusson College',
  official_email: 'student@college.example',
  evidence_notes: 'I am currently enrolled in the design program.',
  status: 'pending',
  reviewer_note: null,
  created_at: '2026-11-20T10:00:00.000Z',
  reviewed_at: null,
}

function fakeClient(options: {
  requestRows?: unknown[]
  insertedRow?: unknown
  verifiedRow?: unknown
} = {}) {
  const requests: Record<string, ReturnType<typeof vi.fn>> = {}
  for (const method of ['select', 'eq', 'order', 'limit', 'insert']) {
    requests[method] = vi.fn(() => requests)
  }
  requests.maybeSingle = vi.fn().mockResolvedValue({ data: options.verifiedRow ?? null, error: null })
  requests.single = vi.fn().mockResolvedValue({ data: options.insertedRow ?? row, error: null })
  requests.then = vi.fn((resolve: (value: unknown) => unknown) =>
    Promise.resolve({ data: options.requestRows ?? [row], error: null }).then(resolve),
  )

  const client = {
    from: vi.fn(() => requests),
  } as unknown as SupabaseClient
  return { client, requests }
}

describe('VerificationRepository', () => {
  it('loads only the current user’s latest request', async () => {
    const { client, requests } = fakeClient()
    const repository = createVerificationRepository(client)

    const request = await repository.getMine('student-1')

    expect(requests.eq).toHaveBeenCalledWith('user_id', 'student-1')
    expect(requests.order).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(request).toMatchObject({
      id: 'request-1',
      userId: 'student-1',
      kind: 'student',
      institutionOrCompany: 'Fergusson College',
      status: 'pending',
    })
  })

  it('submits trimmed request details without setting a status', async () => {
    const { client, requests } = fakeClient()
    const repository = createVerificationRepository(client)

    await repository.submit('student-1', 'student', {
      institutionOrCompany: ' Fergusson College ',
      officialEmail: ' student@college.example ',
      evidenceNotes: ' I am currently enrolled in the design program. ',
    })

    expect(requests.insert).toHaveBeenCalledWith({
      user_id: 'student-1',
      kind: 'student',
      institution_or_company: 'Fergusson College',
      official_email: 'student@college.example',
      evidence_notes: 'I am currently enrolled in the design program.',
    })
  })

  it('reports a verified badge only when the approved-only view returns a row', async () => {
    const approved = createVerificationRepository(fakeClient({ verifiedRow: { user_id: 'student-1' } }).client)
    const pending = createVerificationRepository(fakeClient().client)

    await expect(approved.isVerified('student-1', 'student')).resolves.toBe(true)
    await expect(pending.isVerified('student-1', 'student')).resolves.toBe(false)
  })

  it('does not enable verification writes when Supabase is unconfigured', async () => {
    const repository = createVerificationRepository(null)

    await expect(repository.getMine('student-1')).rejects.toThrow('Verification requests are not configured.')
  })
})
