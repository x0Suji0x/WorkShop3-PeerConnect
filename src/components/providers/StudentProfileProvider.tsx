import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { demoStudent } from '../../data/studentMockData'
import { useAuth } from '../../lib/auth/AuthProvider'
import { studentRepository, type StudentUpdate } from '../../repositories/studentRepository'
import { supabaseStudentRepository } from '../../repositories/supabaseStudentRepository'
import type { Student } from '../../types'
import { StudentProfileContext } from './studentProfileContext'

function createAccountStudentDraft(id: string, fullName: string | null): Student {
  return {
    id,
    name: fullName?.trim() || '',
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
  }
}

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const [student, setStudent] = useState<Student>(demoStudent)
  const [profileMode, setProfileMode] = useState<'demo' | 'account'>('demo')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [hasLoadedStudentProfile, setHasLoadedStudentProfile] = useState(false)

  const userId = auth.user?.id
  const authRole = auth.profile?.role
  const fullName = auth.profile?.full_name ?? null
  const isStudentAccount = auth.status === 'signedIn' && Boolean(userId) && authRole === 'student'

  useEffect(() => {
    if (isStudentAccount && userId) {
      let active = true
      const fallback = createAccountStudentDraft(userId, fullName)
      setProfileMode('account')
      setIsLoadingProfile(true)
      setProfileError(null)
      setHasLoadedStudentProfile(false)
      setStudent((current) => current.id === userId ? current : fallback)

      void supabaseStudentRepository.getById(userId)
        .then((storedStudent) => {
          if (!active) return
          setStudent(storedStudent ?? fallback)
          setHasLoadedStudentProfile(true)
        })
        .catch((error: unknown) => {
          if (!active) return
          setProfileError(error instanceof Error ? error.message : 'Could not load your profile.')
        })
        .finally(() => {
          if (active) setIsLoadingProfile(false)
        })

      return () => { active = false }
    }

    if (auth.status === 'signedOut' || auth.status === 'unconfigured' || authRole === 'client') {
      let active = true
      setProfileMode('demo')
      setIsLoadingProfile(false)
      setProfileError(null)
      setHasLoadedStudentProfile(true)
      setStudent(demoStudent)
      void studentRepository.getById(demoStudent.id).then((storedStudent) => {
        if (active && storedStudent) setStudent(storedStudent)
      })
      return () => { active = false }
    }
  }, [auth.status, authRole, userId, isStudentAccount])

  const refreshStudentProfile = useCallback(async () => {
    if (profileMode !== 'account' || !userId) return
    if (!hasLoadedStudentProfile) setIsLoadingProfile(true)
    setProfileError(null)
    try {
      const storedStudent = await supabaseStudentRepository.getById(userId)
      setStudent(storedStudent ?? createAccountStudentDraft(userId, fullName))
      setHasLoadedStudentProfile(true)
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Could not load your profile.')
    } finally {
      setIsLoadingProfile(false)
    }
  }, [profileMode, userId, hasLoadedStudentProfile, fullName])

  const updateStudent = useCallback(async (changes: StudentUpdate) => {
    setIsSaving(true)
    setProfileError(null)
    try {
      if (profileMode === 'account') {
        if (isLoadingProfile || profileError) {
          throw new Error('Your profile is not ready yet. Retry loading it, then save again.')
        }
        const updatedStudent = await supabaseStudentRepository.update(student.id, changes)
        setStudent(updatedStudent)
        setHasLoadedStudentProfile(true)
        return
      }

      const updatedStudent = await studentRepository.update(student.id, changes)
      setStudent(updatedStudent)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save your profile.'
      setProfileError(message)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [profileMode, isLoadingProfile, profileError, student.id])

  const value = useMemo(() => ({
    student,
    isSaving,
    isLoadingProfile,
    profileError,
    profileMode,
    needsProfileCompletion: profileMode === 'account' && student.profileCompletion === 0,
    updateStudent,
    refreshStudentProfile,
  }), [student, isSaving, isLoadingProfile, profileError, profileMode, updateStudent, refreshStudentProfile])

  return <StudentProfileContext.Provider value={value}>{children}</StudentProfileContext.Provider>
}
