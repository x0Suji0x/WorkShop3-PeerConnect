import { describe, expect, it } from 'vitest'
import { demoStudent } from '../data/studentMockData'
import { buildOnboardingStudentUpdate } from './onboardingStudentUpdate'
import type { OnboardingFormData } from '../types/onboarding'

const onboardingData: OnboardingFormData = {
  basicInfo: {
    fullName: 'Anaya Rao',
    email: 'anaya@example.test',
    phone: '5550100',
    password: 'never-persist-this',
    confirmPassword: 'never-persist-this',
    avatarUrl: 'https://example.test/avatar.png',
    headline: 'Frontend developer',
  },
  college: {
    collegeName: 'Fergusson College',
    degree: 'B.Sc.',
    fieldOfStudy: 'Computer Science',
    academicYear: '3rd Year',
    graduationYear: '2027',
    collegeEmail: 'anaya@college.example.test',
    verificationMethod: 'college_id',
    idCardFileName: 'student-card.png',
  },
  skillsInterests: {
    skills: [{ name: 'React', category: 'dev' }],
    interests: ['Open source'],
  },
  goals: {
    lookingFor: {
      paidProjects: true,
      internships: false,
      collaborators: true,
      hackathons: true,
      startups: false,
      events: false,
      volunteering: true,
      clubs: false,
    },
    availability: 'Available now',
  },
  portfolio: {
    githubUrl: 'https://github.com/anaya',
    linkedinUrl: 'https://linkedin.com/in/anaya',
    behanceUrl: '',
    portfolioUrl: 'https://anaya.example.test',
    aboutBio: 'I build thoughtful interfaces for student teams.',
    featuredProjectName: 'Campus map',
    featuredProjectDesc: 'An accessible campus map app.',
    featuredProjectUrl: 'https://example.test/campus-map',
    organization: 'Campus Lab',
    role: 'Developer',
    experienceType: 'internship',
    experienceDesc: 'Built a student event page.',
    experiences: [],
    certifications: [{ id: 'cert-1', name: 'Web Basics', issuer: 'Open School', issuedOn: '2026' }],
    projects: [],
  },
  agreedToTerms: true,
}

describe('buildOnboardingStudentUpdate', () => {
  it('maps onboarding profile details and excludes account credentials and verification selections', () => {
    const update = buildOnboardingStudentUpdate(onboardingData, demoStudent, 80)

    expect(update).toMatchObject({
      name: 'Anaya Rao',
      college: 'Fergusson College',
      academicYear: '3rd Year',
      skills: onboardingData.skillsInterests.skills,
      availabilityPreferences: onboardingData.goals.lookingFor,
      socialLinks: {
        github: onboardingData.portfolio.githubUrl,
        linkedin: onboardingData.portfolio.linkedinUrl,
        portfolio: onboardingData.portfolio.portfolioUrl,
      },
      education: expect.arrayContaining([
        expect.objectContaining({ institution: 'Fergusson College', degree: 'B.Sc.' }),
      ]),
      certifications: expect.arrayContaining([expect.objectContaining({ name: 'Web Basics' })]),
      profileCompletion: 80,
    })
    expect(update).not.toHaveProperty('password')
    expect(update).not.toHaveProperty('email')
    expect(update).not.toHaveProperty('phone')
    expect(update).not.toHaveProperty('collegeEmail')
    expect(update).not.toHaveProperty('idCardFileName')
    expect(update).not.toHaveProperty('verifications')
  })
})
