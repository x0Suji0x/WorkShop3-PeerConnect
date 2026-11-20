export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6

export interface OnboardingBasicInfo {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  avatarUrl: string
  headline: string
}

export interface OnboardingCollegeIdentity {
  collegeName: string
  degree: string
  fieldOfStudy: string
  academicYear: string
  graduationYear: string
  collegeEmail: string
  verificationMethod: 'college_email' | 'college_id'
  idCardFileName: string | null
}

export interface OnboardingSkillsInterests {
  skills: { name: string; category: 'design' | 'dev' | 'ai' | 'other' }[]
  interests: string[]
}

export interface OnboardingGoalsAvailability {
  lookingFor: {
    paidProjects: boolean
    internships: boolean
    collaborators: boolean
    hackathons: boolean
    startups: boolean
    events: boolean
    volunteering: boolean
    clubs: boolean
  }
  availability: 'Available now' | 'Available soon' | 'Limited hours'
}

export interface OnboardingPortfolioExperience {
  githubUrl: string
  linkedinUrl: string
  behanceUrl: string
  portfolioUrl: string
  aboutBio: string
  featuredProjectName: string
  featuredProjectDesc: string
  featuredProjectUrl: string
  organization: string
  role: string
  experienceType: 'work' | 'internship' | 'volunteering' | 'club'
  experienceDesc: string
  experiences?: {
    id: string
    role: string
    organization: string
    type: 'work' | 'internship' | 'volunteering' | 'club'
    startDate: string
    endDate?: string
    description: string
  }[]
  certifications?: {
    id: string
    name: string
    issuer: string
    issuedOn: string
  }[]
  projects?: {
    id: string
    name: string
    description: string
    skills: string[]
    url?: string
  }[]
}

export interface OnboardingFormData {
  basicInfo: OnboardingBasicInfo
  college: OnboardingCollegeIdentity
  skillsInterests: OnboardingSkillsInterests
  goals: OnboardingGoalsAvailability
  portfolio: OnboardingPortfolioExperience
  agreedToTerms: boolean
}

export interface FormValidationErrors {
  [key: string]: string | undefined
}
