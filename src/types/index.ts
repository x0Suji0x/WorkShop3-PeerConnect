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

export interface ProjectOpportunity {
  id: string
  title: string
  clientName: string
  clientType: string
  clientLocation: string
  clientLogo?: string
  budget: number
  budgetType: 'Fixed Scope' | 'Milestone Scope' | 'Fixed Escrow' | 'Milestone Escrow' | 'Hourly'
  duration: string
  hoursPerWeek: string
  description: string
  skillsRequired: string[]
  badge?: 'High Urgency' | 'Featured' | 'New' | 'Verified Client' | 'Active Scope'
  applicantsCount: number
  postedTimeAgo: string
}

export type SkillCategory = 'all' | 'design' | 'dev' | 'ai' | 'mobile'

export interface NavItem {
  label: string
  href: string
  badge?: string
}
