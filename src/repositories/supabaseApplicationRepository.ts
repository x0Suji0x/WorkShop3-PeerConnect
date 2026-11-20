import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Application, Student } from '../types'
import type {
  AccountApplication,
  ApplicationRepository,
  ClientApplicationStatus,
  PublicApplicantProfile,
} from './applicationRepository'

interface ApplicationRow {
  id: string
  project_id: string
  student_id: string
  cover_letter: string
  status: Application['status']
  created_at: string
  updated_at: string
  project?: { title: string; client_name: string } | Array<{ title: string; client_name: string }> | null
}

interface PublicStudentProfileRow {
  user_id: string
  display_name: string
  headline: string
  college: string
  university: string
  avatar_url: string
  skills: Student['skills']
}

const applicationFields = 'id,project_id,student_id,cover_letter,status,created_at,updated_at,project:projects(title,client_name)'

function fromRow(row: ApplicationRow): AccountApplication {
  const project = Array.isArray(row.project) ? row.project[0] : row.project
  return {
    id: row.id,
    projectId: row.project_id,
    studentId: row.student_id,
    coverLetter: row.cover_letter,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    projectTitle: project?.title ?? 'Project listing',
    clientName: project?.client_name ?? '',
  }
}

function fromPublicProfile(row: PublicStudentProfileRow): PublicApplicantProfile {
  return {
    userId: row.user_id,
    name: row.display_name || 'Student applicant',
    headline: row.headline,
    college: row.college,
    university: row.university,
    avatarUrl: row.avatar_url,
    skills: (row.skills ?? []).map((skill) => skill.name),
  }
}

function requireClient(client: SupabaseClient | null): SupabaseClient {
  if (!client) throw new Error('Application saving is not configured.')
  return client
}

function checkError(error: { message?: string } | null, message: string) {
  if (!error) return
  if (error.message?.toLowerCase().includes('applications_one_per_student_project')) {
    throw new Error('You have already applied to this project.')
  }
  throw new Error(message)
}

export function createSupabaseApplicationRepository(client: SupabaseClient | null): ApplicationRepository {
  return {
    async getMineForProject(studentId, projectId) {
      if (!client) return null
      const { data, error } = await client
        .from('applications')
        .select(applicationFields)
        .eq('student_id', studentId)
        .eq('project_id', projectId)
        .maybeSingle()
      if (error) throw new Error('Could not check your application. Please try again.')
      return data ? fromRow(data as ApplicationRow) : null
    },

    async listMine(studentId) {
      if (!client) throw new Error('Applications are not configured.')
      const { data, error } = await client
        .from('applications')
        .select(applicationFields)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
      if (error) throw new Error('Could not load your applications. Please try again.')
      return (data ?? []).map((row) => fromRow(row as ApplicationRow))
    },

    async listForOwnerProjects(projects) {
      if (!client) throw new Error('Applications are not configured.')
      if (!projects.length) return []

      const projectById = new Map(projects.map((project) => [project.id, project]))
      const { data, error } = await client
        .from('applications')
        .select(applicationFields)
        .in('project_id', projects.map((project) => project.id))
        .order('created_at', { ascending: false })
      if (error) throw new Error('Could not load applicants for your projects. Please try again.')

      const rows = (data ?? []) as ApplicationRow[]
      if (!rows.length) return []

      const studentIds = [...new Set(rows.map((row) => row.student_id))]
      const { data: profileRows, error: profileError } = await client
        .from('student_profiles')
        .select('user_id,display_name,headline,college,university,avatar_url,skills')
        .in('user_id', studentIds)
        .eq('is_public', true)
      if (profileError) throw new Error('Could not load public applicant profiles. Please try again.')

      const profiles = new Map(
        ((profileRows ?? []) as PublicStudentProfileRow[]).map((row) => [row.user_id, fromPublicProfile(row)]),
      )

      return rows.map((row) => {
        const project = projectById.get(row.project_id)
        const joinedProject = Array.isArray(row.project) ? row.project[0] : row.project
        return {
          ...fromRow(row),
          projectTitle: project?.title ?? joinedProject?.title ?? 'Project listing',
          clientName: project?.clientName ?? joinedProject?.client_name ?? '',
          applicantProfile: profiles.get(row.student_id) ?? null,
        }
      })
    },

    async submit(studentId, projectId, coverLetter) {
      const supabaseClient = requireClient(client)
      const { data, error } = await supabaseClient
        .from('applications')
        .insert({
          project_id: projectId,
          student_id: studentId,
          cover_letter: coverLetter.trim(),
        })
        .select(applicationFields)
        .single()
      if (error || !data) {
        checkError(error, 'Could not submit your application. Please try again.')
        throw new Error('Could not submit your application. Please try again.')
      }
      return fromRow(data as ApplicationRow)
    },

    async setClientStatus(applicationId, status: ClientApplicationStatus) {
      const supabaseClient = requireClient(client)
      const { error } = await supabaseClient.rpc('set_application_status', {
        application_id: applicationId,
        new_status: status,
      })
      if (error) throw new Error('Could not update this application. Please try again.')
    },

    async withdraw(applicationId) {
      const supabaseClient = requireClient(client)
      const { error } = await supabaseClient.rpc('set_application_status', {
        application_id: applicationId,
        new_status: 'withdrawn',
      })
      if (error) throw new Error('Could not withdraw this application. Please try again.')
    },
  }
}

export const supabaseApplicationRepository = createSupabaseApplicationRepository(supabase)
