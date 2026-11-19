import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { demoStudent } from '../../data/studentMockData'
import { studentRepository, type StudentUpdate } from '../../repositories/studentRepository'
import type { Student } from '../../types'
import { StudentProfileContext } from './studentProfileContext'
import { useAuth } from '../../hooks/useAuth'

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const { user, token, refreshUser } = useAuth()
  const [baseStudent, setBaseStudent] = useState<Student>(demoStudent)
  const [isSaving, setIsSaving] = useState(false)

  // 1. Initial load from local storage/repository
  useEffect(() => {
    void studentRepository.getById(demoStudent.id).then((storedStudent) => {
      if (storedStudent) setBaseStudent(storedStudent)
    })
  }, [])

  // 2. Derive merged student directly during render (zero extra effect, zero cascading render)
  const student = useMemo<Student>(() => {
    if (!user || user.role !== 'student') return baseStudent

    const isSeededAccount = user.email === 'sofia.rodriguez@nid.edu'
    const accountDefaults: Student = isSeededAccount
      ? baseStudent
      : {
          ...baseStudent,
          id: user.id,
          projectsCompleted: 0,
          activeProjects: 0,
          applicationsSent: 0,
          profileViews: 0,
          rating: 0,
          reviewsCount: 0,
          profileCompletion: 35,
          featuredWork: 'Add your strongest work to help collaborators find you.',
          bio: '',
          about: 'Tell collaborators what you are learning, building, and looking for.',
          availabilityPreferences: {
            paidProjects: false,
            collaborators: false,
            internships: false,
            events: false,
          },
          experiences: [],
          education: [],
          portfolioProjects: [],
          certifications: [],
          socialLinks: {},
          verifications: baseStudent.verifications.map((verification) => ({
            ...verification,
            status: 'unverified',
            updatedAt: undefined,
          })),
          isPlusMember: false,
        }
    const savedProfile = user.profileData ?? {}

    return {
      ...accountDefaults,
      ...savedProfile,
      id: user.id || accountDefaults.id,
      name: user.fullName || accountDefaults.name,
      headline: user.headline || accountDefaults.headline,
      avatarUrl: user.avatarUrl || accountDefaults.avatarUrl,
      college: user.collegeName || accountDefaults.college,
      university: user.collegeName || accountDefaults.university,
      degree: user.degree || accountDefaults.degree,
      fieldOfStudy: user.fieldOfStudy || accountDefaults.fieldOfStudy,
      graduationYear: user.graduationYear || accountDefaults.graduationYear,
      skills:
        user.skills && user.skills.length > 0
          ? user.skills.map((s) => ({
              name: s.name,
              category: (s.category as 'design' | 'dev' | 'ai' | 'other') || 'other',
            }))
          : accountDefaults.skills,
      interests: user.interests && user.interests.length > 0 ? user.interests : accountDefaults.interests,
      socialLinks: {
        ...accountDefaults.socialLinks,
        ...savedProfile.socialLinks,
        ...(user.portfolio?.githubUrl ? { github: user.portfolio.githubUrl } : {}),
        ...(user.portfolio?.linkedinUrl ? { linkedin: user.portfolio.linkedinUrl } : {}),
        ...(user.portfolio?.behanceUrl ? { behance: user.portfolio.behanceUrl } : {}),
        ...(user.portfolio?.portfolioUrl ? { portfolio: user.portfolio.portfolioUrl } : {}),
      },
      about: (user.portfolio?.aboutBio as string) || savedProfile.about || accountDefaults.about,
    }
  }, [baseStudent, user])

  const updateStudent = useCallback(async (changes: StudentUpdate) => {
    setIsSaving(true)

    try {
      const storedToken = (() => {
        try {
          return localStorage.getItem('peerconnect_token')
        } catch {
          return null
        }
      })()
      const storedUser = (() => {
        try {
          const rawUser = localStorage.getItem('peerconnect_user')
          return rawUser ? (JSON.parse(rawUser) as { role?: string }) : null
        } catch {
          return null
        }
      })()
      const activeToken = token || storedToken
      const activeRole = user?.role || storedUser?.role

      if (activeRole === 'student' && activeToken) {
        const response = await fetch('/api/auth/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({ profile: { ...student, ...changes } }),
        })

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as { error?: string } | null
          throw new Error(data?.error || 'Could not save your profile.')
        }

        await refreshUser()
        return
      }

      const updatedStudent = await studentRepository.update(student.id, changes)
      setBaseStudent(updatedStudent)
    } finally {
      setIsSaving(false)
    }
  }, [refreshUser, student, token, user?.role])

  const value = useMemo(() => ({ student, isSaving, updateStudent }), [student, isSaving, updateStudent])

  return <StudentProfileContext.Provider value={value}>{children}</StudentProfileContext.Provider>
}
