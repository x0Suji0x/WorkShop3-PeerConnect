import { describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseApplicationRepository } from './supabaseApplicationRepository'

const applicationRow = {
  id: 'application-1',
  project_id: 'project-1',
  student_id: 'student-1',
  cover_letter: 'I can build this.',
  status: 'submitted',
  created_at: '2026-11-20T10:00:00.000Z',
  updated_at: '2026-11-20T10:00:00.000Z',
  project: [{ title: 'Build a portfolio', client_name: 'Campus Studio' }],
}

function query(result: { data: unknown; error: unknown }) {
  const builder: Record<string, ReturnType<typeof vi.fn>> & { then?: unknown } = {}
  for (const method of ['select', 'eq', 'in', 'order', 'insert']) {
    builder[method] = vi.fn(() => builder)
  }
  builder.maybeSingle = vi.fn().mockResolvedValue(result)
  builder.single = vi.fn().mockResolvedValue(result)
  builder.then = (resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) =>
    Promise.resolve(result).then(resolve, reject)
  return builder
}

function fakeClient(results: Array<{ data: unknown; error: unknown }> = []) {
  const builders = results.map(query)
  let index = 0
  const rpc = vi.fn().mockResolvedValue({ data: null, error: null })
  const client = {
    from: vi.fn(() => builders[index++] ?? query({ data: null, error: null })),
    rpc,
  } as unknown as SupabaseClient
  return { client, builders, rpc }
}

describe('SupabaseApplicationRepository', () => {
  it('maps a submitted application and its joined project', async () => {
    const { client, builders } = fakeClient([{ data: [applicationRow], error: null }])
    const repository = createSupabaseApplicationRepository(client)

    const applications = await repository.listMine('student-1')

    expect(builders[0].eq).toHaveBeenCalledWith('student_id', 'student-1')
    expect(applications[0]).toMatchObject({
      id: 'application-1',
      projectId: 'project-1',
      projectTitle: 'Build a portfolio',
      clientName: 'Campus Studio',
      status: 'submitted',
      coverLetter: 'I can build this.',
    })
  })

  it('maps only returned public student profiles onto client applications', async () => {
    const application = { ...applicationRow, project: { title: 'Build a portfolio', client_name: 'Campus Studio' } }
    const publicProfile = {
      user_id: 'student-1',
      display_name: 'Aarav Deshmukh',
      headline: 'Frontend developer',
      college: 'COEP',
      university: 'COEP Technological University',
      avatar_url: '',
      skills: [{ name: 'React', category: 'dev' }],
    }
    const { client, builders } = fakeClient([
      { data: [application], error: null },
      { data: [publicProfile], error: null },
    ])
    const repository = createSupabaseApplicationRepository(client)

    const applications = await repository.listForOwnerProjects([
      { id: 'project-1', title: 'Build a portfolio', clientName: 'Campus Studio' },
    ])

    expect(builders[1].eq).toHaveBeenCalledWith('is_public', true)
    expect(applications[0].applicantProfile).toMatchObject({
      userId: 'student-1',
      name: 'Aarav Deshmukh',
      college: 'COEP',
      skills: ['React'],
    })
  })

  it('does not expose an applicant profile when it is not returned as public', async () => {
    const { client } = fakeClient([
      { data: [applicationRow], error: null },
      { data: [], error: null },
    ])
    const repository = createSupabaseApplicationRepository(client)

    const applications = await repository.listForOwnerProjects([
      { id: 'project-1', title: 'Build a portfolio', clientName: 'Campus Studio' },
    ])

    expect(applications[0].applicantProfile).toBeNull()
  })

  it('returns a friendly error for duplicate submissions', async () => {
    const { client } = fakeClient([{
      data: null,
      error: { message: 'duplicate key violates applications_one_per_student_project' },
    }])
    const repository = createSupabaseApplicationRepository(client)

    await expect(repository.submit('student-1', 'project-1', 'My pitch'))
      .rejects.toThrow('You have already applied to this project.')
  })

  it('sends client shortlisting through the status RPC', async () => {
    const { client, rpc } = fakeClient()
    const repository = createSupabaseApplicationRepository(client)

    await repository.setClientStatus('application-1', 'shortlisted')

    expect(rpc).toHaveBeenCalledWith('set_application_status', {
      application_id: 'application-1',
      new_status: 'shortlisted',
    })
  })

  it('sends applicant withdrawal through the status RPC', async () => {
    const { client, rpc } = fakeClient()
    const repository = createSupabaseApplicationRepository(client)

    await repository.withdraw('application-1')

    expect(rpc).toHaveBeenCalledWith('set_application_status', {
      application_id: 'application-1',
      new_status: 'withdrawn',
    })
  })

  it('fails clearly when Supabase is not configured', async () => {
    const repository = createSupabaseApplicationRepository(null)

    await expect(repository.listMine('student-1')).rejects.toThrow('Applications are not configured.')
    await expect(repository.submit('student-1', 'project-1', 'Pitch'))
      .rejects.toThrow('Application saving is not configured.')
  })
})
