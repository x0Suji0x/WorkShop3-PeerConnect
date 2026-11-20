import { describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseProjectRepository } from './supabaseProjectRepository'

const row = {
  id: 'project-1',
  owner_id: 'client-1',
  title: 'Build a student portal',
  description: 'A concise project brief.',
  client_name: 'Campus Studio',
  client_type: 'Organization',
  client_location: 'Pune',
  budget_amount: '12500.00',
  budget_type: 'Fixed-price',
  duration: '3 weeks',
  hours_per_week: '10 hrs/week',
  skills_required: ['React', 'Figma'],
  category: 'Design & development',
  work_mode: 'Hybrid',
  deadline: '2026-12-15',
  deliverables: ['Working prototype'],
  status: 'published',
  created_at: '2026-11-20T00:00:00.000Z',
  updated_at: '2026-11-20T00:00:00.000Z',
}

function fakeClient(result: { one?: unknown; many?: unknown } = {}) {
  let selectedRows = [row]
  let singleRow = row
  const query: Record<string, ReturnType<typeof vi.fn>> & { then?: unknown } = {}
  for (const method of ['select', 'eq', 'order', 'insert', 'update']) {
    query[method] = vi.fn((value?: unknown) => {
      if (method === 'insert') singleRow = { ...row, ...(value as object) }
      if (method === 'update') singleRow = { ...row, ...(value as object) }
      return query
    })
  }
  query.delete = vi.fn(() => query)
  query.maybeSingle = vi.fn().mockResolvedValue(result.one ?? { data: row, error: null })
  query.single = vi.fn().mockResolvedValue(result.one ?? { data: singleRow, error: null })
  query.then = (resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) =>
    Promise.resolve(result.many ?? { data: selectedRows, error: null }).then(resolve, reject)
  const client = { from: vi.fn(() => query) }
  return { client: client as unknown as SupabaseClient, query, getSelectedRows: () => selectedRows }
}

describe('SupabaseProjectRepository', () => {
  it('loads only published projects and maps them as account projects', async () => {
    const { client, query } = fakeClient()
    const repository = createSupabaseProjectRepository(client)

    const projects = await repository.listPublished()

    expect(query.eq).toHaveBeenCalledWith('status', 'published')
    expect(projects[0]).toMatchObject({
      id: 'project-1',
      budget: 12500,
      source: 'account',
      applicantsCount: 0,
      skillsRequired: ['React', 'Figma'],
    })
  })

  it('reads an individual project only when it is published', async () => {
    const { client, query } = fakeClient()
    const repository = createSupabaseProjectRepository(client)

    await repository.getPublishedById('project-1')

    expect(query.eq).toHaveBeenNthCalledWith(1, 'id', 'project-1')
    expect(query.eq).toHaveBeenNthCalledWith(2, 'status', 'published')
  })

  it('scopes the client dashboard query to the signed-in owner', async () => {
    const { client, query } = fakeClient()
    const repository = createSupabaseProjectRepository(client)

    await repository.listMine('client-1')

    expect(query.eq).toHaveBeenCalledWith('owner_id', 'client-1')
  })

  it('saves a draft with the project form fields', async () => {
    const { client, query } = fakeClient()
    const repository = createSupabaseProjectRepository(client)

    const project = await repository.create('client-1', {
      title: ' Build a student portal ',
      description: ' A concise project brief. ',
      clientName: ' Campus Studio ',
      clientType: ' Organization ',
      clientLocation: ' Pune ',
      budget: 12500,
      budgetType: 'Fixed-price',
      duration: '3 weeks',
      hoursPerWeek: '10 hrs/week',
      skillsRequired: ['React', 'Figma'],
      workMode: 'Hybrid',
    }, 'draft')

    expect(query.insert).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Build a student portal',
      owner_id: 'client-1',
      budget_amount: 12500,
      status: 'draft',
      skills_required: ['React', 'Figma'],
      work_mode: 'Hybrid',
    }))
    expect(project.source).toBe('account')
  })

  it('publishes an existing owner project', async () => {
    const { client, query } = fakeClient()
    const repository = createSupabaseProjectRepository(client)

    await repository.publish('project-1')

    expect(query.update).toHaveBeenCalledWith({ status: 'published' })
    expect(query.eq).toHaveBeenCalledWith('id', 'project-1')
  })

  it('keeps public sample browsing available when Supabase is not configured', async () => {
    const repository = createSupabaseProjectRepository(null)
    await expect(repository.listPublished()).resolves.toEqual([])
    await expect(repository.getPublishedById('project-1')).resolves.toBeNull()
    await expect(repository.listMine('client-1')).rejects.toThrow('Project saving is not configured.')
  })
})
