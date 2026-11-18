// Public API for Community & Team Finder Module

// Pages
export { CommunitiesPage } from './pages/CommunitiesPage'
export { CommunityDetailPage } from './pages/CommunityDetailPage'
export { MyCommunitiesPage } from './pages/MyCommunitiesPage'
export { TeamFinderPage } from './pages/TeamFinderPage'
export { TeamDetailPage } from './pages/TeamDetailPage'
export { NewTeamPage } from './pages/NewTeamPage'
export { TeamBuilderPage } from './pages/TeamBuilderPage'

// Components
export { CommunityCard } from './components/CommunityCard'
export { CommunityRecommendationCard } from './components/CommunityRecommendationCard'
export { DiscussionPostCard } from './components/DiscussionPostCard'
export { CreatePostModal } from './components/CreatePostModal'
export { TeamPostCard } from './components/TeamPostCard'
export { StudentMatchCard } from './components/StudentMatchCard'
export { ApplicationForm } from './components/ApplicationForm'

// AI & Matching Engine
export {
  recommendCommunities,
  matchTeammates,
  suggestTeamRoles,
} from './engine/recommendationEngine'

// Routes & Paths
export {
  communityTeamFinderRoutes,
  communityDetailPath,
  teamDetailPath,
} from './routes'
export { CommunityTeamFinderApp } from './CommunityTeamFinderRoutes'

// Types
export type * from './types'
