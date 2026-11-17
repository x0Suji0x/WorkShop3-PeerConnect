import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SmoothScrollProvider } from './components/providers/SmoothScrollProvider'
import { AppShell } from './components/layout/AppShell'
import { routes, communityRoutes } from './app/routes'
import { HomePage } from './pages/Home/HomePage'
import { StudentDashboardPage } from './pages/Dashboard/StudentDashboardPage'
import { StudentProfilePage } from './pages/Profiles/StudentProfilePage'
import { VerificationPage } from './pages/Verification/VerificationPage'
import { ModulePlaceholderPage } from './pages/Shared/ModulePlaceholderPage'
import { NotFoundPage } from './pages/Shared/NotFoundPage'
import { CollegesPage } from './pages/Colleges/CollegesPage'
import { ClubsPage } from './pages/Clubs/ClubsPage'
import { EventsPage } from './pages/Events/EventsPage'
import { ProjectsPage } from './pages/Projects/ProjectsPage'
import { ProjectDetailPage } from './pages/Projects/ProjectDetailPage'
import { NewProjectPage } from './pages/Projects/NewProjectPage'
import { ApplicationsPage } from './pages/Applications/ApplicationsPage'
import { StudentProfileProvider } from './components/providers/StudentProfileProvider'

// Communities and Team Finder pages
import { CommunitiesPage } from './pages/Communities/CommunitiesPage'
import { CommunityDetailPage } from './pages/Communities/CommunityDetailPage'
import { MyCommunitiesPage } from './pages/Communities/MyCommunitiesPage'
import { TeamFinderPage } from './pages/TeamFinder/TeamFinderPage'
import { TeamDetailPage } from './pages/TeamFinder/TeamDetailPage'
import { NewTeamPage } from './pages/TeamFinder/NewTeamPage'
import { TeamBuilderPage } from './pages/TeamFinder/TeamBuilderPage'

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <StudentProfileProvider>
          <AppShell>
            <Routes>
              <Route path={routes.home} element={<HomePage />} />
              <Route path={routes.dashboard} element={<StudentDashboardPage />} />
              <Route path={routes.profiles} element={<ModulePlaceholderPage eyebrow="Talent" title="Student profiles" description="Discover the students, skills, and portfolios shaping the next generation of work." owner="the shared profile directory" />} />
              <Route path="/profiles/:profileId" element={<StudentProfilePage />} />
              <Route path={routes.verification} element={<VerificationPage />} />
              <Route path={routes.projects} element={<ProjectsPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
              <Route path={routes.newProject} element={<NewProjectPage />} />
              <Route path={routes.applications} element={<ApplicationsPage />} />
              <Route path={routes.colleges} element={<CollegesPage />} />
              <Route path={routes.clubs} element={<ClubsPage />} />
              <Route path={routes.events} element={<EventsPage />} />

              {/* Communities & Team Finder module routes */}
              <Route path={communityRoutes.communities} element={<CommunitiesPage />} />
              <Route path={communityRoutes.communityDetail} element={<CommunityDetailPage />} />
              <Route path="/my-communities" element={<MyCommunitiesPage />} />
              <Route path={communityRoutes.teamFinder} element={<TeamFinderPage />} />
              <Route path={communityRoutes.newTeam} element={<NewTeamPage />} />
              <Route path={communityRoutes.teamBuilder} element={<TeamBuilderPage />} />
              <Route path={communityRoutes.teamDetail} element={<TeamDetailPage />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppShell>
        </StudentProfileProvider>
      </SmoothScrollProvider>
    </BrowserRouter>
  )
}
