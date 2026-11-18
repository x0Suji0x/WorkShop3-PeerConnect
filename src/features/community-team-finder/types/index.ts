// ─── Community Types ──────────────────────────────────────────────────────────

export type ActivityLevel = 'very-active' | 'active' | 'moderate' | 'quiet'

export interface Community {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  category: string
  tags: string[]
  coverImageUrl: string
  logoEmoji: string
  memberCount: number
  postCount: number
  isJoined: boolean
  guidelines: string[]
  createdAt: string
  activityLevel: ActivityLevel
}

export interface CommunityCategory {
  id: string
  label: string
  color: string
}

export interface CommunityComment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorCollege?: string
  content: string
  likes: number
  createdAt: string
}

export interface CommunityPost {
  id: string
  communityId: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorCollege: string
  title: string
  content: string
  tags: string[]
  likes: number
  comments: CommunityComment[]
  createdAt: string
  isPinned: boolean
  isAnnouncement: boolean
}

export interface CommunityMember {
  id: string
  name: string
  avatarUrl: string
  college: string
  skills: string[]
  role: 'admin' | 'moderator' | 'member'
  joinedAt: string
}

export interface CommunityRecommendation {
  community: Community
  reason: string
  matchScore: number
  matchedSkills: string[]
  matchedInterests: string[]
  matchedAcademicField?: string
}

// ─── Team Finder Types ────────────────────────────────────────────────────────

export type CollabType = 'remote' | 'on-campus' | 'hybrid'
export type CollabCategory =
  | 'hackathon'
  | 'college-project'
  | 'personal-project'
  | 'startup'
  | 'research'
  | 'open-source'

export interface TeamRole {
  id: string
  title: string
  description: string
  skills: string[]
  filled: boolean
  priority?: 'required' | 'optional'
}

export interface TeamMember {
  id: string
  name: string
  avatarUrl: string
  role: string
  college: string
}

export interface TeamPost {
  id: string
  title: string
  description: string
  category: CollabCategory
  skills: string[]
  roles: TeamRole[]
  teamSize: number
  currentMembers: TeamMember[]
  collabType: CollabType
  deadline: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorCollege: string
  applicantsCount: number
  createdAt: string
  status: 'open' | 'closed' | 'filled'
}

export interface TeamApplication {
  id: string
  teamPostId: string
  roleId?: string
  roleTitle?: string
  applicantId: string
  applicantName: string
  applicantAvatar: string
  applicantCollege: string
  message: string
  appliedAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

// ─── AI Matching & Builder Types ──────────────────────────────────────────────

export interface StudentMatchProfile {
  id: string
  name: string
  avatarUrl: string
  college: string
  skills: string[]
  interests: string[]
  availability: string
  preferredCollabType: CollabType
  bio: string
  portfolioProjects: string[]
  matchScore: number
  matchReason: string
  matchedSkills: string[]
  complementarySkills?: string[]
}

export interface SuggestedRole {
  title: string
  description: string
  skills: string[]
  priority: 'required' | 'optional'
}

export interface TeamBuilderSuggestion {
  roles: SuggestedRole[]
  communities: {
    id: string
    name: string
    slug: string
    logoEmoji: string
    description: string
  }[]
}

