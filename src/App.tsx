import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SmoothScrollProvider } from './components/providers/SmoothScrollProvider'
import { AppShell } from './components/layout/AppShell'
import { LoadingState } from './components/common/LoadingState'
import { routes, communityRoutes, authRoutes } from './app/routes'
import { HomePage } from './pages/Home/HomePage'
import { StudentProfileProvider } from './components/providers/StudentProfileProvider'
import { AuthProvider } from './contexts/AuthContext'

const StudentDashboardPage = lazy(() => import('./pages/Dashboard/StudentDashboardPage').then(({ StudentDashboardPage: Page }) => ({ default: Page })))
const StudentProfilePage = lazy(() => import('./pages/Profiles/StudentProfilePage').then(({ StudentProfilePage: Page }) => ({ default: Page })))
const TalentDirectoryPage = lazy(() => import('./pages/Profiles/TalentDirectoryPage').then(({ TalentDirectoryPage: Page }) => ({ default: Page })))
const VerificationPage = lazy(() => import('./pages/Verification/VerificationPage').then(({ VerificationPage: Page }) => ({ default: Page })))
const StudentPlusPage = lazy(() => import('./pages/StudentPlus/StudentPlusPage').then(({ StudentPlusPage: Page }) => ({ default: Page })))
const NotFoundPage = lazy(() => import('./pages/Shared/NotFoundPage').then(({ NotFoundPage: Page }) => ({ default: Page })))
const CollegesPage = lazy(() => import('./pages/Colleges/CollegesPage').then(({ CollegesPage: Page }) => ({ default: Page })))
const ClubsPage = lazy(() => import('./pages/Clubs/ClubsPage').then(({ ClubsPage: Page }) => ({ default: Page })))
const EventsPage = lazy(() => import('./pages/Events/EventsPage').then(({ EventsPage: Page }) => ({ default: Page })))
const ProjectsPage = lazy(() => import('./pages/Projects/ProjectsPage').then(({ ProjectsPage: Page }) => ({ default: Page })))
const ProjectDetailPage = lazy(() => import('./pages/Projects/ProjectDetailPage').then(({ ProjectDetailPage: Page }) => ({ default: Page })))
const NewProjectPage = lazy(() => import('./pages/Projects/NewProjectPage').then(({ NewProjectPage: Page }) => ({ default: Page })))
const GetStartedPage = lazy(() => import('./pages/Shared/GetStartedPage').then(({ GetStartedPage: Page }) => ({ default: Page })))
const ApplicationsPage = lazy(() => import('./pages/Applications/ApplicationsPage').then(({ ApplicationsPage: Page }) => ({ default: Page })))
const SignUpPage = lazy(() => import('./pages/Auth/SignUpPage').then(({ SignUpPage: Page }) => ({ default: Page })))
const SignInPage = lazy(() => import('./pages/Auth/SignInPage').then(({ SignInPage: Page }) => ({ default: Page })))
const OAuthCallbackPage = lazy(() => import('./pages/Auth/OAuthCallbackPage').then(({ OAuthCallbackPage: Page }) => ({ default: Page })))
const StudentOnboardingPage = lazy(() => import('./pages/Onboarding/StudentOnboardingPage').then(({ StudentOnboardingPage: Page }) => ({ default: Page })))
const OnboardingCompletePage = lazy(() => import('./pages/Onboarding/OnboardingCompletePage').then(({ OnboardingCompletePage: Page }) => ({ default: Page })))
const CommunitiesPage = lazy(() => import('./pages/Communities/CommunitiesPage').then(({ CommunitiesPage: Page }) => ({ default: Page })))
const CommunityDetailPage = lazy(() => import('./pages/Communities/CommunityDetailPage').then(({ CommunityDetailPage: Page }) => ({ default: Page })))
const MyCommunitiesPage = lazy(() => import('./pages/Communities/MyCommunitiesPage').then(({ MyCommunitiesPage: Page }) => ({ default: Page })))
const TeamFinderPage = lazy(() => import('./pages/TeamFinder/TeamFinderPage').then(({ TeamFinderPage: Page }) => ({ default: Page })))
const TeamDetailPage = lazy(() => import('./pages/TeamFinder/TeamDetailPage').then(({ TeamDetailPage: Page }) => ({ default: Page })))
const NewTeamPage = lazy(() => import('./pages/TeamFinder/NewTeamPage').then(({ NewTeamPage: Page }) => ({ default: Page })))
const TeamBuilderPage = lazy(() => import('./pages/TeamFinder/TeamBuilderPage').then(({ TeamBuilderPage: Page }) => ({ default: Page })))

function RouteBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingState label="Loading page…" />}>{children}</Suspense>
}

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <AuthProvider>
          <StudentProfileProvider>
            <AppShell>
            <Routes>
              <Route path={routes.home} element={<HomePage />} />
              <Route path={routes.getStarted} element={<RouteBoundary><GetStartedPage /></RouteBoundary>} />
              <Route path={routes.dashboard} element={<RouteBoundary><StudentDashboardPage /></RouteBoundary>} />
              <Route path={routes.profiles} element={<RouteBoundary><TalentDirectoryPage /></RouteBoundary>} />
              <Route path="/profiles/:profileId" element={<RouteBoundary><StudentProfilePage /></RouteBoundary>} />
              <Route path={routes.verification} element={<RouteBoundary><VerificationPage /></RouteBoundary>} />
              <Route path={routes.studentPlus} element={<RouteBoundary><StudentPlusPage /></RouteBoundary>} />
              <Route path={routes.projects} element={<RouteBoundary><ProjectsPage /></RouteBoundary>} />
              <Route path="/projects/:projectId" element={<RouteBoundary><ProjectDetailPage /></RouteBoundary>} />
              <Route path={routes.newProject} element={<RouteBoundary><NewProjectPage /></RouteBoundary>} />
              <Route path={routes.applications} element={<RouteBoundary><ApplicationsPage /></RouteBoundary>} />
              <Route path={routes.colleges} element={<RouteBoundary><CollegesPage /></RouteBoundary>} />
              <Route path={routes.clubs} element={<RouteBoundary><ClubsPage /></RouteBoundary>} />
              <Route path={routes.events} element={<RouteBoundary><EventsPage /></RouteBoundary>} />

              {/* Authentication & Onboarding routes */}
              <Route path={authRoutes.googleCallback} element={<RouteBoundary><OAuthCallbackPage /></RouteBoundary>} />
              <Route path={authRoutes.signup} element={<RouteBoundary><SignUpPage /></RouteBoundary>} />
              <Route path={authRoutes.signupStudent} element={<RouteBoundary><StudentOnboardingPage /></RouteBoundary>} />
              <Route path={authRoutes.signupComplete} element={<RouteBoundary><OnboardingCompletePage /></RouteBoundary>} />
              <Route path={authRoutes.signin} element={<RouteBoundary><SignInPage /></RouteBoundary>} />

              {/* Communities & Team Finder module routes */}
              <Route path={communityRoutes.communities} element={<RouteBoundary><CommunitiesPage /></RouteBoundary>} />
              <Route path={communityRoutes.communityDetail} element={<RouteBoundary><CommunityDetailPage /></RouteBoundary>} />
              <Route path="/my-communities" element={<RouteBoundary><MyCommunitiesPage /></RouteBoundary>} />
              <Route path={communityRoutes.teamFinder} element={<RouteBoundary><TeamFinderPage /></RouteBoundary>} />
              <Route path={communityRoutes.newTeam} element={<RouteBoundary><NewTeamPage /></RouteBoundary>} />
              <Route path={communityRoutes.teamBuilder} element={<RouteBoundary><TeamBuilderPage /></RouteBoundary>} />
              <Route path={communityRoutes.teamDetail} element={<RouteBoundary><TeamDetailPage /></RouteBoundary>} />

              <Route path="*" element={<RouteBoundary><NotFoundPage /></RouteBoundary>} />
            </Routes>
          </AppShell>
        </StudentProfileProvider>
      </AuthProvider>
    </SmoothScrollProvider>
  </BrowserRouter>
  )
}
