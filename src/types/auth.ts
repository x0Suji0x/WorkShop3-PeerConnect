import type { Student } from '.'

export interface AuthUser {
  id: string
  role: 'student' | 'client'
  email: string
  fullName: string
  avatarUrl?: string
  headline?: string
  phone?: string
  collegeName?: string
  degree?: string
  fieldOfStudy?: string
  academicYear?: string
  graduationYear?: string
  collegeEmail?: string
  isVerified?: boolean
  skills?: Array<{ name: string; category: string }>
  interests?: string[]
  portfolio?: {
    githubUrl?: string
    linkedinUrl?: string
    portfolioUrl?: string
    behanceUrl?: string
    aboutBio?: string
    [key: string]: unknown
  }
  companyName?: string
  contactName?: string
  designation?: string
  website?: string
  orgType?: string
  selectedNeeds?: string[]
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string
  /** Additional student-only profile fields persisted by the local API. */
  profileData?: Partial<Student>
}

export interface StudentSignupPayload {
  fullName: string
  email: string
  password: string
  phone?: string
  collegeName?: string
  degree?: string
  fieldOfStudy?: string
  academicYear?: string
  graduationYear?: string
  collegeEmail?: string
  isVerified?: boolean
  skills?: Array<{ name: string; category: string }>
  interests?: string[]
  portfolio?: Record<string, unknown>
  avatarUrl?: string
  headline?: string
}

export interface ClientSignupPayload {
  companyName: string
  contactName?: string
  email: string
  password: string
  designation?: string
  website?: string
  orgType?: string
  selectedNeeds?: string[]
  phone?: string
  avatarUrl?: string
  headline?: string
}

export interface SocialAuthPayload {
  email: string
  fullName?: string
  avatarUrl?: string
  role?: 'student' | 'client'
}

export interface AuthResponse {
  success: boolean
  error?: string
  user?: AuthUser
  token?: string
}

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  role: 'student' | 'client' | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: { email: string; password: string; role?: 'student' | 'client' }) => Promise<AuthResponse>
  signupStudent: (payload: StudentSignupPayload) => Promise<AuthResponse>
  signupClient: (payload: ClientSignupPayload) => Promise<AuthResponse>
  loginWithGoogle: (payload: SocialAuthPayload) => Promise<AuthResponse>
  loginWithGithub: (payload: SocialAuthPayload) => Promise<AuthResponse>
  logout: () => void
  refreshUser: () => Promise<void>
}
