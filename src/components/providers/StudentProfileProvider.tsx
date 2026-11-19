import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { demoStudent } from '../../data/studentMockData'
import { useAuth } from '../../lib/auth/AuthProvider'
import { studentRepository, type StudentUpdate } from '../../repositories/studentRepository'
import type { Student } from '../../types'
import { StudentProfileContext } from './studentProfileContext'

function createAccountStudentDraft(id: string, fullName: string | null): Student {
  return {
    id,
    name: fullName?.trim() || 'Your profile',
    headline: '',
    university: '',
    college: '',
    degree: '',
    fieldOfStudy: '',
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
    verifications: [
      {
        id: 'verification-college',
        type: 'college_identity',
        status: 'unverified',
        label: 'Institutional enrollment',
        description: 'No identity or enrollment checks have been performed.',
      },
      {
        id: 'verification-phone',
        type: 'phone_number',
        status: 'unverified',
        label: 'Phone number',
        description: 'No phone verification has been performed.',
      },
      {
        id: 'verification-experience',
        type: 'experience',
        status: 'unverified',
        label: 'Experience',
        description: 'Experience details have not been reviewed.',
      },
      {
        id: 'verification-skills',
        type: 'skills',
        status: 'unverified',
        label: 'Skills',
        description: 'No skill assessment has been performed.',
      },
      {
        id: 'verification-portfolio',
        type: 'portfolio_ownership',
        status: 'unverified',
        label: 'Portfolio ownership',
        description: 'Portfolio ownership has not been checked.',
      },
    ],
    isPlusMember: false,
  }
}

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const [student, setStudent] = useState<Student>(demoStudent)
  const [profileMode, setProfileMode] = useState<'demo' | 'account'>('demo')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const hasAccount = Boolean(auth.user?.id)
    const shouldUseAccountDraft = hasAccount && (
      auth.status === 'loading' ||
      auth.status === 'profileError' ||
      (auth.status === 'signedIn' && auth.profile?.role !== 'client')
    )

    if (shouldUseAccountDraft && auth.user) {
      const userId = auth.user.id
      const fullName = auth.profile?.id === userId ? auth.profile.full_name : null
      setProfileMode('account')
      setStudent((current) => (
        current.id === userId
          ? { ...current, name: fullName?.trim() || current.name || 'Your profile' }
          : createAccountStudentDraft(userId, fullName)
      ))
      return
    }

    if (auth.status === 'signedOut' || auth.status === 'unconfigured' || auth.profile?.role === 'client') {
      setProfileMode('demo')
      setStudent(demoStudent)
      let active = true
      void studentRepository.getById(demoStudent.id).then((storedStudent) => {
        if (active && storedStudent) setStudent(storedStudent)
      })
      return () => {
        active = false
      }
    }
  }, [auth.status, auth.user, auth.profile?.id, auth.profile?.full_name, auth.profile?.role])

  const updateStudent = useCallback(async (changes: StudentUpdate) => {
    setIsSaving(true)
    try {
      if (profileMode === 'account') {
        setStudent((current) => ({ ...current, ...changes }))
        return
      }

      const updatedStudent = await studentRepository.update(student.id, changes)
      setStudent(updatedStudent)
    } finally {
      setIsSaving(false)
    }
  }, [profileMode, student.id])

  const value = useMemo(() => ({
    student,
    isSaving,
    profileMode,
    needsProfileCompletion: profileMode === 'account' && student.profileCompletion === 0,
    updateStudent,
  }), [student, isSaving, profileMode, updateStudent])

  return <StudentProfileContext.Provider value={value}>{children}</StudentProfileContext.Provider>
}
