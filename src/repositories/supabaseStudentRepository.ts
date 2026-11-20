import type { SupabaseClient } from '@supabase/supabase-js'
import { calculateProfileCompletion } from '../lib/profileCompletion'
import { supabase } from '../lib/supabase'
import type { Student } from '../types'
import type { StudentRepository, StudentUpdate } from './studentRepository'

interface StudentProfileRow {
  user_id: string
  display_name: string
  headline: string
  bio: string
  university: string
  college: string
  degree: string
  field_of_study: string
  academic_year: string
  graduation_year: string
  avatar_url: string
  availability: Student['availability']
  skills: Student['skills']
  interests: string[]
  availability_preferences: Student['availabilityPreferences']
  experiences: Student['experiences']
  education: Student['education']
  portfolio_projects: Student['portfolioProjects']
  certifications: Student['certifications']
  social_links: Student['socialLinks']
  is_public: boolean
}

const emptyStudent = (id: string): Student => ({
  id,
  name: '',
  headline: '',
  university: '',
  college: '',
  degree: '',
  fieldOfStudy: '',
  academicYear: '',
  graduationYear: '',
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
  availabilityPreferences: {
    paidProjects: false,
    collaborators: false,
    internships: false,
    events: false,
    hackathons: false,
    startups: false,
    volunteering: false,
    clubs: false,
  },
  skills: [],
  interests: [],
  featuredWork: '',
  bio: '',
  about: '',
  profileCompletion: 0,
  experiences: [],
  education: [],
  portfolioProjects: [],
  certifications: [],
  socialLinks: {},
  verifications: [],
  isPlusMember: false,
  isPublic: false,
  source: 'account',
})

function fromRow(row: StudentProfileRow): Student {
  const student: Student = {
    ...emptyStudent(row.user_id),
    name: row.display_name,
    headline: row.headline,
    bio: row.bio,
    about: row.bio,
    university: row.university,
    college: row.college,
    degree: row.degree,
    fieldOfStudy: row.field_of_study,
    academicYear: row.academic_year,
    graduationYear: row.graduation_year,
    avatarUrl: row.avatar_url,
    availability: row.availability,
    skills: row.skills,
    interests: row.interests,
    availabilityPreferences: row.availability_preferences,
    experiences: row.experiences,
    education: row.education,
    portfolioProjects: row.portfolio_projects,
    certifications: row.certifications,
    socialLinks: row.social_links,
    featuredWork: row.portfolio_projects[0]?.name ?? '',
    isPublic: row.is_public,
  }
  student.profileCompletion = calculateProfileCompletion(student).percentage
  return student
}

async function withVerifiedBadge(client: SupabaseClient, student: Student): Promise<Student> {
  const { data, error } = await client
    .from('verified_users')
    .select('user_id')
    .eq('user_id', student.id)
    .eq('kind', 'student')
    .maybeSingle()
  if (error) throw new Error('Could not load the student verification status.')
  return { ...student, isVerified: Boolean(data) }
}

function toRow(userId: string, changes: StudentUpdate): Partial<StudentProfileRow> & Pick<StudentProfileRow, 'user_id'> {
  const row: Partial<StudentProfileRow> & Pick<StudentProfileRow, 'user_id'> = { user_id: userId }
  if (changes.name !== undefined) row.display_name = changes.name
  if (changes.headline !== undefined) row.headline = changes.headline
  if (changes.bio !== undefined || changes.about !== undefined) row.bio = changes.bio ?? changes.about ?? ''
  if (changes.university !== undefined) row.university = changes.university
  if (changes.college !== undefined) row.college = changes.college
  if (changes.degree !== undefined) row.degree = changes.degree
  if (changes.fieldOfStudy !== undefined) row.field_of_study = changes.fieldOfStudy
  if (changes.academicYear !== undefined) row.academic_year = changes.academicYear
  if (changes.graduationYear !== undefined) row.graduation_year = changes.graduationYear
  if (changes.avatarUrl !== undefined) row.avatar_url = changes.avatarUrl
  if (changes.availability !== undefined) row.availability = changes.availability
  if (changes.skills !== undefined) row.skills = changes.skills
  if (changes.interests !== undefined) row.interests = changes.interests
  if (changes.availabilityPreferences !== undefined) row.availability_preferences = changes.availabilityPreferences
  if (changes.experiences !== undefined) row.experiences = changes.experiences
  if (changes.education !== undefined) row.education = changes.education
  if (changes.portfolioProjects !== undefined) row.portfolio_projects = changes.portfolioProjects
  if (changes.certifications !== undefined) row.certifications = changes.certifications
  if (changes.socialLinks !== undefined) row.social_links = changes.socialLinks
  if (changes.isPublic !== undefined) row.is_public = changes.isPublic
  return row
}

export function createSupabaseStudentRepository(client: SupabaseClient | null): StudentRepository {
  return {
    async getById(studentId) {
      if (!client) return null
      const { data, error } = await client
        .from('student_profiles')
        .select('*')
        .eq('user_id', studentId)
        .maybeSingle()
      if (error) throw new Error('Could not load this student profile. Please try again.')
      return data ? withVerifiedBadge(client, fromRow(data as StudentProfileRow)) : null
    },

    async update(studentId, changes) {
      if (!client) throw new Error('Student profile saving is not configured.')
      const { data, error } = await client
        .from('student_profiles')
        .upsert(toRow(studentId, changes), { onConflict: 'user_id' })
        .select('*')
        .single()
      if (error || !data) throw new Error('Could not save your student profile. Please try again.')
      return withVerifiedBadge(client, fromRow(data as StudentProfileRow))
    },

    async getPublicProfiles() {
      if (!client) return []
      const { data, error } = await client
        .from('student_profiles')
        .select('*')
        .eq('is_public', true)
      if (error) throw new Error('Could not load public student profiles.')
      const students = (data ?? []).map((row) => fromRow(row as StudentProfileRow))
      if (!students.length) return []

      const { data: verifiedRows, error: verificationError } = await client
        .from('verified_users')
        .select('user_id')
        .eq('kind', 'student')
        .in('user_id', students.map((student) => student.id))
      if (verificationError) throw new Error('Could not load student verification statuses.')
      const verifiedIds = new Set((verifiedRows ?? []).map((row) => (row as { user_id: string }).user_id))
      return students.map((student) => ({ ...student, isVerified: verifiedIds.has(student.id) }))
    },
  }
}

export const supabaseStudentRepository = createSupabaseStudentRepository(supabase)
