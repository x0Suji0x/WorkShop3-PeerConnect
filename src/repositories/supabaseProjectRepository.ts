import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { ProjectOpportunity } from '../types'
import type { AccountProject, ProjectCreateInput, ProjectRepository } from './projectRepository'

interface ProjectRow {
  id: string
  owner_id: string
  title: string
  description: string
  client_name: string
  client_type: string
  client_location: string
  budget_amount: number | string
  budget_type: ProjectOpportunity['budgetType']
  duration: string
  hours_per_week: string
  skills_required: string[]
  category: string
  work_mode: NonNullable<ProjectOpportunity['workMode']>
  deadline: string | null
  deliverables: string[]
  status: AccountProject['status']
  created_at: string
  updated_at: string
}

const postedTimeAgo = (createdAt: string) => {
  const elapsedMs = Math.max(0, Date.now() - new Date(createdAt).getTime())
  const minutes = Math.floor(elapsedMs / 60_000)
  if (minutes < 60) return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  const days = Math.floor(hours / 24)
  return `${days} ${days === 1 ? 'day' : 'days'} ago`
}

function fromRow(row: ProjectRow): AccountProject {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description,
    clientName: row.client_name,
    clientType: row.client_type,
    clientLocation: row.client_location,
    budget: Number(row.budget_amount),
    budgetType: row.budget_type,
    duration: row.duration,
    hoursPerWeek: row.hours_per_week,
    skillsRequired: row.skills_required ?? [],
    category: row.category,
    workMode: row.work_mode,
    deadline: row.deadline ?? undefined,
    deliverables: row.deliverables ?? [],
    applicantsCount: 0,
    postedTimeAgo: postedTimeAgo(row.created_at),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    source: 'account',
  }
}

function toRow(project: ProjectCreateInput, status: 'draft' | 'published') {
  return {
    title: project.title.trim(),
    description: project.description.trim(),
    client_name: project.clientName.trim(),
    client_type: project.clientType.trim(),
    client_location: project.clientLocation.trim(),
    budget_amount: project.budget,
    budget_type: project.budgetType,
    duration: project.duration.trim(),
    hours_per_week: project.hoursPerWeek.trim(),
    skills_required: project.skillsRequired,
    category: project.category?.trim() ?? '',
    work_mode: project.workMode ?? 'Remote',
    deadline: project.deadline || null,
    deliverables: project.deliverables ?? [],
    status,
  }
}

const projectFields = 'id,owner_id,title,description,client_name,client_type,client_location,budget_amount,budget_type,duration,hours_per_week,skills_required,category,work_mode,deadline,deliverables,status,created_at,updated_at'

export function createSupabaseProjectRepository(client: SupabaseClient | null): ProjectRepository {
  return {
    async listPublished() {
      if (!client) return []
      const { data, error } = await client
        .from('projects')
        .select(projectFields)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      if (error) throw new Error('Could not load published projects. Please try again.')
      return (data ?? []).map((row) => fromRow(row as ProjectRow))
    },

    async getPublishedById(projectId) {
      if (!client) return null
      const { data, error } = await client
        .from('projects')
        .select(projectFields)
        .eq('id', projectId)
        .eq('status', 'published')
        .maybeSingle()
      if (error) throw new Error('Could not load this project. Please try again.')
      return data ? fromRow(data as ProjectRow) : null
    },

    async listMine(ownerId) {
      if (!client) throw new Error('Project saving is not configured.')
      const { data, error } = await client
        .from('projects')
        .select(projectFields)
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })
      if (error) throw new Error('Could not load your projects. Please try again.')
      return (data ?? []).map((row) => fromRow(row as ProjectRow))
    },

    async create(ownerId, project, status) {
      if (!client) throw new Error('Project saving is not configured.')
      const { data, error } = await client
        .from('projects')
        .insert({ ...toRow(project, status), owner_id: ownerId })
        .select(projectFields)
        .single()
      if (error || !data) throw new Error('Could not save this project. Please try again.')
      return fromRow(data as ProjectRow)
    },

    async publish(projectId) {
      if (!client) throw new Error('Project publishing is not configured.')
      const { data, error } = await client
        .from('projects')
        .update({ status: 'published' })
        .eq('id', projectId)
        .select(projectFields)
        .single()
      if (error || !data) throw new Error('Could not publish this project. Please try again.')
      return fromRow(data as ProjectRow)
    },
  }
}

export const supabaseProjectRepository = createSupabaseProjectRepository(supabase)
