export interface StudentProfile {
  id: string
  name: string
  headline: string
  university: string
  graduationYear: string
  avatarUrl: string
  hourlyRate: number
  projectsCompleted: number
  rating: number
  reviewsCount: number
  availability: 'Available now' | 'Available soon' | 'Limited hours'
  skills: { name: string; category: 'design' | 'dev' | 'ai' | 'other' }[]
  featuredWork: string
  bio: string
}

export type VerificationStatus = 'unverified' | 'pending' | 'verified'
export type VerificationType =
  | 'college_identity'
  | 'phone_number'
  | 'experience'
  | 'skills'
  | 'portfolio_ownership'

export interface Verification {
  id: string
  type: VerificationType
  status: VerificationStatus
  label: string
  description: string
  updatedAt?: string
}

export interface AvailabilityPreferences {
  paidProjects: boolean
  collaborators: boolean
  internships: boolean
  events: boolean
}

export interface Experience {
  id: string
  organization: string
  role: string
  type: 'work' | 'internship' | 'volunteering' | 'club'
  startDate: string
  endDate?: string
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  graduationYear: string
}

export interface PortfolioProject {
  id: string
  name: string
  description: string
  skills: string[]
  url?: string
  imageUrl?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issuedOn: string
}

export interface SocialLinks {
  github?: string
  linkedin?: string
  behance?: string
  portfolio?: string
}

/**
 * The complete student contract builds on the lightweight profile shape used
 * by the landing-page talent cards.
 */
export interface Student extends StudentProfile {
  coverImageUrl: string
  college: string
  degree: string
  fieldOfStudy: string
  profileCompletion: number
  profileViews: number
  activeProjects: number
  applicationsSent: number
  about: string
  interests: string[]
  availabilityPreferences: AvailabilityPreferences
  experiences: Experience[]
  education: Education[]
  portfolioProjects: PortfolioProject[]
  certifications: Certification[]
  socialLinks: SocialLinks
  verifications: Verification[]
  isPlusMember: boolean
}

export interface Client {
  id: string
  name: string
  organizationName: string
  headline: string
  avatarUrl?: string
  location?: string
}

export interface College {
  id: string
  name: string
  city: string
  state: string
  logoUrl?: string
  verified: boolean
  description?: string
  studentCount?: number
  clubCount?: number
  eventCount?: number
  focusAreas?: string[]
}

export interface Club {
  id: string
  name: string
  collegeId: string
  description: string
  category: string
  memberCount: number
  collegeName?: string
  nextEvent?: string
  tags?: string[]
  isOpenToMembers?: boolean
}

export interface ProjectOpportunity {
  id: string
  title: string
  clientName: string
  clientType: string
  clientLocation: string
  clientLogo?: string
  budget: number
  budgetType: 'Fixed Escrow' | 'Milestone Escrow' | 'Hourly'
  duration: string
  hoursPerWeek: string
  description: string
  skillsRequired: string[]
  badge?: 'High Urgency' | 'Featured' | 'New' | 'Verified Client'
  applicantsCount: number
  postedTimeAgo: string
}

export interface Project extends ProjectOpportunity {
  clientId: string
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'closed'
  createdAt: string
}

export interface Application {
  id: string
  projectId: string
  studentId: string
  coverLetter: string
  status: 'draft' | 'submitted' | 'shortlisted' | 'rejected' | 'accepted'
  createdAt: string
}

export interface Event {
  id: string
  title: string
  collegeId?: string
  clubId?: string
  startsAt: string
  endsAt: string
  location: string
  description: string
  attendeeCount: number
  organizerName?: string
  category?: string
  capacity?: number
  isFree?: boolean
}

export interface Review {
  id: string
  authorId: string
  recipientId: string
  projectId?: string
  rating: number
  comment: string
  createdAt: string
}

export type SkillCategory = 'all' | 'design' | 'dev' | 'ai' | 'mobile'

export interface NavItem {
  label: string
  href: string
  badge?: string
}
