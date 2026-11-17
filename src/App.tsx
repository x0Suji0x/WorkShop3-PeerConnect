import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SmoothScrollProvider } from './components/providers/SmoothScrollProvider'
import { StudentProfileProvider } from './components/providers/StudentProfileProvider'
import { AppShell } from './components/layout/AppShell'
import { routes } from './app/routes'
import { HomePage } from './pages/Home/HomePage'
import { StudentDashboardPage } from './pages/Dashboard/StudentDashboardPage'
import { StudentProfilePage } from './pages/Profiles/StudentProfilePage'
import { VerificationPage } from './pages/Verification/VerificationPage'
import { ModulePlaceholderPage } from './pages/Shared/ModulePlaceholderPage'
import { NotFoundPage } from './pages/Shared/NotFoundPage'

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
            <Route path={routes.projects} element={<ModulePlaceholderPage eyebrow="Marketplace" title="Project marketplace" description="Find scoped opportunities and student talent for meaningful work." owner="Sujay" />} />
            <Route path="/projects/:projectId" element={<ModulePlaceholderPage eyebrow="Marketplace" title="Project details" description="The project-detail route is reserved for the marketplace module." owner="Sujay" />} />
            <Route path={routes.newProject} element={<ModulePlaceholderPage eyebrow="Marketplace" title="Post a project" description="This route is ready for the project-creation workflow." owner="Sujay" />} />
            <Route path={routes.applications} element={<ModulePlaceholderPage eyebrow="Marketplace" title="Applications" description="This route is ready for applicant and application management." owner="Sujay" />} />
            <Route path={routes.colleges} element={<ModulePlaceholderPage eyebrow="Community" title="Colleges" description="Discover the institutions and communities behind student talent." owner="Adi" />} />
            <Route path={routes.clubs} element={<ModulePlaceholderPage eyebrow="Community" title="Clubs" description="Find clubs, teams, and communities to join or collaborate with." owner="Adi" />} />
            <Route path={routes.events} element={<ModulePlaceholderPage eyebrow="Community" title="Events" description="Explore upcoming campus events and opportunities to contribute." owner="Adi" />} />
            <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppShell>
        </StudentProfileProvider>
      </SmoothScrollProvider>
    </BrowserRouter>
  )
}
