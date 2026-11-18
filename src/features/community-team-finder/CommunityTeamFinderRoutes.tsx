import { Route, Routes } from 'react-router-dom'
import { CommunitiesPage } from './pages/CommunitiesPage'
import { CommunityDetailPage } from './pages/CommunityDetailPage'
import { MyCommunitiesPage } from './pages/MyCommunitiesPage'
import { TeamFinderPage } from './pages/TeamFinderPage'
import { TeamDetailPage } from './pages/TeamDetailPage'
import { NewTeamPage } from './pages/NewTeamPage'
import { TeamBuilderPage } from './pages/TeamBuilderPage'

/**
 * Standalone router for the Community & Team Finder module.
 * Can be mounted directly under a parent route (e.g. `/community-hub/*`)
 * or individual routes can be wired by Kritagya into App.tsx.
 */
export function CommunityTeamFinderApp() {
  return (
    <Routes>
      <Route path="communities" element={<CommunitiesPage />} />
      <Route path="communities/:slug" element={<CommunityDetailPage />} />
      <Route path="my-communities" element={<MyCommunitiesPage />} />
      <Route path="team-finder" element={<TeamFinderPage />} />
      <Route path="team-finder/new" element={<NewTeamPage />} />
      <Route path="team-finder/builder" element={<TeamBuilderPage />} />
      <Route path="team-finder/:teamId" element={<TeamDetailPage />} />
    </Routes>
  )
}
