import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  FileText,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { profileRoute, routes } from '../../app/routes'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { PageHeading } from '../../components/common/PageHeading'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import { calculateProfileCompletion } from '../../lib/profileCompletion'
import { dashboardNotifications, recommendedProjects } from '../../data/studentMockData'
import { ClientDashboardView } from '../../components/dashboard/ClientDashboardView'
import { useAuth } from '../../lib/auth/AuthProvider'
import { LoadingState } from '../../components/common/LoadingState'

export function StudentDashboardPage() {
  const { profile } = useAuth()
  const activeRole = profile?.role

  // If in Client Mode, render Client Dashboard View
  if (activeRole === 'client') {
    return <ClientDashboardView />
  }

  // Otherwise render Student Dashboard
  return <StudentDashboardContent />
}

function StudentDashboardContent() {
  const { profile } = useAuth()
  const { student, needsProfileCompletion, isLoadingProfile, profileError, refreshStudentProfile } = useStudentProfile()

  if (isLoadingProfile) return <LoadingState label="Loading your student profile…" />
  if (profileError) return <main className="peer-page-surface flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12"><section className="peer-card-glass w-full max-w-lg p-8 text-center"><h1 className="text-2xl font-bold">We couldn’t load your profile</h1><p role="alert" className="mt-3 text-sm text-[#525A55]">{profileError}</p><button type="button" onClick={() => void refreshStudentProfile()} className="mt-5 rounded-full bg-[#123D30] px-5 py-2.5 font-semibold text-white">Retry</button></section></main>

  if (needsProfileCompletion) {
    return (
      <main className="peer-page-surface relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-12">
        <div className="peer-ambient-glow peer-glow-gold -left-24 -top-24 h-96 w-96" />
        <section className="peer-card-glass relative z-10 w-full max-w-2xl p-8 text-center sm:p-12">
          <p className="peer-eyebrow-pill mx-auto">STUDENT DASHBOARD</p>
          <h1 className="mt-5 text-3xl font-black text-[#171916]">
            Let’s complete your profile, {student.name.split(' ')[0]}.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#525A55]">
            Add your education, skills, and work samples so project owners can understand what you bring to a team.
          </p>
          <Link to="/signup/student" className="mt-6 inline-flex rounded-full bg-[#123D30] px-6 py-3 text-sm font-bold text-white">
            Complete your profile <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </section>
      </main>
    )
  }

  const completionReport = calculateProfileCompletion(student)
  const firstName = student.name.split(' ')[0]
  const stats = [
    { label: 'Projects completed', value: student.projectsCompleted, icon: CheckCircle2, detail: 'Across paid and campus work' },
    { label: 'Active projects', value: student.activeProjects, icon: BriefcaseBusiness, detail: 'In progress right now' },
    { label: 'Applications sent', value: student.applicationsSent, icon: FileText, detail: '2 awaiting a response' },
    { label: 'Profile views', value: student.profileViews, icon: Eye, detail: 'In the last 30 days' },
  ]

  const statTones = [
    { glow: 'peer-card-glow-mint', iconBg: 'bg-[#E8F3EA]', iconColor: 'text-[#176B4C]' },
    { glow: 'peer-card-glow-gold', iconBg: 'bg-[#FBF0DC]', iconColor: 'text-[#9A6A24]' },
    { glow: 'peer-card-glow-rose', iconBg: 'bg-[#F7E9EB]', iconColor: 'text-[#9D5C6C]' },
    { glow: 'peer-card-glow-mint', iconBg: 'bg-[#E8F3EA]', iconColor: 'text-[#08A876]' },
  ]

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Ambient lighting glows identical to home page */}
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Top Role Switcher */}
        <div className="flex items-center justify-between peer-divider-fade pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm" className="font-bold flex items-center gap-1.5">
              🎓 Student Workspace
            </Badge>
            <span className="text-xs text-[#777A72]">
              Signed in as <strong className="text-[#171916]">{student.name}</strong>
            </span>
          </div>

        </div>

        <PageHeading
          eyebrow="Student dashboard"
          title={`Good to see you, ${firstName}.`}
          description="A focused view of your profile, opportunities, and collaboration activity."
          actions={
            <Link to={profileRoute(student.id)}>
              <Button size="sm">View profile <ArrowRight className="h-3.5 w-3.5" /></Button>
            </Link>
          }
        />

        <section className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="peer-card-glass peer-card-glow-mint overflow-hidden lg:col-span-7">
            <div className="peer-divider-fade bg-gradient-to-r from-white/90 via-[#FDFBF7] to-[#F7F6F0] px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#08C58A]" />
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#123D30]">Profile momentum</p>
                  </div>
                  <h2 className="mt-2 text-xl font-black text-[#171916]">Your profile is {completionReport.percentage}% complete</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#777A72]">{completionReport.nextStepRecommendation}</p>
                </div>
                <span className="font-mono text-2xl font-black text-[#08A876]">{completionReport.percentage}%</span>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E7E8E1]" role="progressbar" aria-label="Profile completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completionReport.percentage}>
                <div className="h-full rounded-full bg-[#08C58A] transition-all duration-500" style={{ width: `${completionReport.percentage}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
              <div className="rounded-2xl border border-[rgba(91,112,96,0.18)] bg-white/70 p-4 backdrop-blur-xs">
                <ShieldCheck className="h-4 w-4 text-[#08A876]" />
                <p className="mt-3 text-sm font-bold text-[#171916]">Verification</p>
                <p className="mt-1 text-xs leading-relaxed text-[#777A72]">{profile?.is_verified ? 'Approved by manual review' : 'Manual review available'}</p>
              </div>
              <div className="rounded-2xl border border-[rgba(91,112,96,0.18)] bg-white/70 p-4 backdrop-blur-xs">
                <UserRoundCheck className="h-4 w-4 text-[#08A876]" />
                <p className="mt-3 text-sm font-bold text-[#171916]">Availability</p>
                <p className="mt-1 text-xs leading-relaxed text-[#777A72]">Open to paid projects</p>
              </div>
              <Link to={routes.verification} className="rounded-2xl bg-[#123D30] p-4 text-white transition hover:bg-[#0E3127] shadow-xs">
                <p className="text-sm font-bold">Strengthen trust</p>
                <p className="mt-1 text-xs leading-relaxed text-emerald-100/75">Submit or check a review request <ArrowRight className="inline h-3 w-3" /></p>
              </Link>
            </div>
          </div>

          <div className="peer-card-glass peer-card-glow-gold lg:col-span-5 p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D79A39]" />
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9A6A24]">Student Plus</p>
            </div>
            <h2 className="mt-2 text-xl font-black text-[#171916]">Be easier to discover.</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#777A72]">A proposed ₹99/month plan for a more visible profile and practical insight into opportunity interest.</p>
            <ul className="mt-5 space-y-2.5 text-sm text-[#171916]">
              {['Featured profile placement', 'Plus profile badge', 'Profile-view analytics', 'Project-interest analytics'].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#08C58A]" />{benefit}</li>
              ))}
            </ul>
            <Link to={routes.studentPlus} className="mt-6 block">
              <Button variant="dark" className="w-full">
                {student.isPlusMember ? 'Manage Student Plus' : 'Try Student Plus demo · ₹99/month'}
              </Button>
            </Link>
            <p className="mt-2 text-center text-[11px] text-[#777A72]">
              {student.isPlusMember ? 'Demo access is active for this session.' : 'Demo interface only — no payment is collected.'}
            </p>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {stats.map(({ label, value, icon: Icon, detail }, index) => {
            const tone = statTones[index % statTones.length]
            return (
              <div
                key={label}
                className={`peer-card-glass ${tone.glow} p-5 hover:-translate-y-1 transition-all duration-200`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone.iconBg} ${tone.iconColor} border border-black/5`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <p className="mt-4 font-mono text-2xl font-black text-[#171916]">{value}</p>
                <p className="mt-1 text-sm font-bold text-[#171916]">{label}</p>
                <p className="mt-1 hidden text-xs leading-relaxed text-[#777A72] sm:block">{detail}</p>
              </div>
            )
          })}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-black text-[#171916]">Recommended for you</p>
                <p className="mt-0.5 text-sm text-[#777A72]">Based on your demo skills and interests</p>
              </div>
              <Link to={routes.projects} className="text-sm font-bold text-[#123D30] hover:text-[#08A876]">Browse all</Link>
            </div>
            <div className="space-y-3">
              {recommendedProjects.map((project) => (
                <div
                  key={project.id}
                  className="peer-card-glass p-5 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start relative z-10">
                    <div>
                      <p className="text-xs font-semibold text-[#777A72]">{project.organization}</p>
                      <h3 className="mt-1 text-base font-black text-[#171916] group-hover:text-[#08A876]">{project.title}</h3>
                      <div className="mt-3 flex flex-wrap gap-1.5">{project.skills.map((skill) => <Badge key={skill} size="sm" variant="neutral">{skill}</Badge>)}</div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                      <p className="font-mono text-base font-black text-[#171916]">{project.budget}</p>
                      <Link to={routes.projects} className="mt-2 inline-flex text-xs font-bold text-[#123D30] hover:text-[#08A876]">See opportunity <ArrowRight className="ml-1 h-3 w-3" /></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="mb-4">
              <p className="text-lg font-black text-[#171916]">Recent notifications</p>
              <p className="mt-0.5 text-sm text-[#777A72]">Updates around your PeerConnect activity</p>
            </div>
            <div className="peer-card-glass overflow-hidden">
              <div className="divide-y divide-[#E7E8E1]">
                {dashboardNotifications.map((notification) => (
                  <div key={notification.id} className="flex gap-3 p-5 hover:bg-white/50 transition-colors">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#08C58A] animate-pulse" />
                    <div>
                      <p className="text-sm font-semibold leading-relaxed text-[#171916]">{notification.title}</p>
                      <p className="mt-1 text-xs text-[#777A72]">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
