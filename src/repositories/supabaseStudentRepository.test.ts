import { describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseStudentRepository } from './supabaseStudentRepository'

const row = {
  user_id: 'student-1',
  display_name: 'Meera Rao',
  headline: 'Designer',
  bio: 'Student bio',
  university: 'Fergusson College',
  college: 'Fergusson College',
  degree: 'B.Des',
  field_of_study: 'Design',
  academic_year: '3rd Year',
  graduation_year: '2027',
  avatar_url: '',
  availability: 'Available now',
  skills: [{ name: 'Figma', category: 'design' }],
  interests: ['Product design'],
  availability_preferences: { paidProjects: true, collaborators: false, internships: true, events: false },
  experiences: [],
  education: [],
  portfolio_projects: [{ id: 'p1', name: 'Portfolio page', description: 'A sample', skills: ['React'] }],
  certifications: [],
  social_links: { portfolio: 'https://example.com' },
  is_public: true,
}

function fakeClient(results: { one?: unknown; many?: unknown; verified?: unknown; verifiedMany?: unknown } = {}) {
  const makeQuery = (singleResult: unknown, listResult: unknown) => {
    const query: Record<string, ReturnType<typeof vi.fn>> = {}
    query.select = vi.fn(() => query)
    query.eq = vi.fn(() => query)
    query.in = vi.fn(() => query)
    query.maybeSingle = vi.fn().mockResolvedValue(singleResult)
    query.single = vi.fn().mockResolvedValue(singleResult)
    query.upsert = vi.fn(() => query)
    query.then = vi.fn((resolve: (value: unknown) => unknown) => Promise.resolve(listResult).then(resolve))
    return query
  }
  const profileQuery = makeQuery(results.one ?? { data: row, error: null }, results.many ?? { data: [row], error: null })
  const verificationQuery = makeQuery(results.verified ?? { data: null, error: null }, results.verifiedMany ?? { data: [], error: null })
  const client = {
    from: vi.fn((table: string) => table === 'verified_users' ? verificationQuery : profileQuery),
  }
  return { client: client as unknown as SupabaseClient, query: profileQuery, verificationQuery }
}

describe('SupabaseStudentRepository', () => {
  it('maps an account row into a student profile', async () => {
    const { client } = fakeClient()
    const repository = createSupabaseStudentRepository(client)

    const profile = await repository.getById('student-1')

    expect(profile).toMatchObject({
      id: 'student-1',
      name: 'Meera Rao',
      university: 'Fergusson College',
      academicYear: '3rd Year',
      isPublic: true,
      featuredWork: 'Portfolio page',
      isVerified: false,
    })
  })

  it('shows a verified badge only when the approved-only result contains the student', async () => {
    const { client } = fakeClient({ verified: { data: { user_id: 'student-1', kind: 'student' }, error: null } })
    const repository = createSupabaseStudentRepository(client)

    const profile = await repository.getById('student-1')

    expect(profile?.isVerified).toBe(true)
  })

  it('writes onboarding fields and publication status without writing demo metrics', async () => {
    const { client, query } = fakeClient()
    const repository = createSupabaseStudentRepository(client)

    await repository.update('student-1', {
      name: 'Updated Name',
      availability: 'Available soon',
      isPublic: false,
      profileViews: 999,
    })

    expect(query.upsert).toHaveBeenCalledWith({
      user_id: 'student-1',
      display_name: 'Updated Name',
      availability: 'Available soon',
      is_public: false,
    }, { onConflict: 'user_id' })
  })

  it('returns only public rows for directory browsing', async () => {
    const { client, query } = fakeClient()
    const repository = createSupabaseStudentRepository(client)

    const profiles = await repository.getPublicProfiles()

    expect(query.eq).toHaveBeenCalledWith('is_public', true)
    expect(profiles).toHaveLength(1)
    expect(profiles[0].source).toBe('account')
  })

  it('returns an empty public directory when auth is not configured', async () => {
    const repository = createSupabaseStudentRepository(null)
    await expect(repository.getPublicProfiles()).resolves.toEqual([])
    await expect(repository.getById('student-1')).resolves.toBeNull()
  })
})
