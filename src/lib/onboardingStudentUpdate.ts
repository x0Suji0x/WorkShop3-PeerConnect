import type { OnboardingFormData } from '../types/onboarding'
import type { Student } from '../types'
import type { StudentUpdate } from '../repositories/studentRepository'

/** Persist the profile fields onboarding collects; credentials and verification evidence are excluded. */
export function buildOnboardingStudentUpdate(
  data: OnboardingFormData,
  currentStudent: Student,
  profileCompletion: number,
): StudentUpdate {
  const portfolioProjects = [
    ...(data.portfolio.projects ?? []),
    ...(data.portfolio.featuredProjectName
      ? [{
          id: `onboarding-featured-${Date.now()}`,
          name: data.portfolio.featuredProjectName,
          description: data.portfolio.featuredProjectDesc || 'Student showcase project',
          skills: data.skillsInterests.skills.map((skill) => skill.name).slice(0, 3),
          url: data.portfolio.featuredProjectUrl || undefined,
        }]
      : []),
    ...currentStudent.portfolioProjects,
  ]

  const experiences = [
    ...(data.portfolio.experiences ?? []),
    ...(data.portfolio.organization
      ? [{
          id: `onboarding-experience-${Date.now()}`,
          organization: data.portfolio.organization,
          role: data.portfolio.role || 'Contributor',
          type: data.portfolio.experienceType,
          startDate: 'Recent',
          description: data.portfolio.experienceDesc || 'Added during onboarding',
        }]
      : []),
    ...currentStudent.experiences,
  ]

  const education = data.college.collegeName
    ? [{
        id: 'onboarding-education',
        institution: data.college.collegeName,
        degree: data.college.degree,
        fieldOfStudy: data.college.fieldOfStudy,
        graduationYear: data.college.graduationYear,
      }, ...currentStudent.education]
    : currentStudent.education

  return {
    name: data.basicInfo.fullName || currentStudent.name,
    headline: data.basicInfo.headline || `${data.college.degree} Student`,
    avatarUrl: data.basicInfo.avatarUrl || currentStudent.avatarUrl,
    college: data.college.collegeName || currentStudent.college,
    university: data.college.collegeName || currentStudent.university,
    degree: data.college.degree || currentStudent.degree,
    fieldOfStudy: data.college.fieldOfStudy || currentStudent.fieldOfStudy,
    academicYear: data.college.academicYear,
    graduationYear: data.college.graduationYear || currentStudent.graduationYear,
    skills: data.skillsInterests.skills,
    interests: data.skillsInterests.interests,
    availability: data.goals.availability,
    availabilityPreferences: { ...data.goals.lookingFor },
    about: data.portfolio.aboutBio || currentStudent.about,
    bio: data.portfolio.aboutBio || currentStudent.bio,
    socialLinks: {
      github: data.portfolio.githubUrl || currentStudent.socialLinks.github,
      linkedin: data.portfolio.linkedinUrl || currentStudent.socialLinks.linkedin,
      behance: data.portfolio.behanceUrl || currentStudent.socialLinks.behance,
      portfolio: data.portfolio.portfolioUrl || currentStudent.socialLinks.portfolio,
    },
    portfolioProjects,
    experiences,
    education,
    certifications: [...(data.portfolio.certifications ?? []), ...currentStudent.certifications],
    profileCompletion,
  }
}
