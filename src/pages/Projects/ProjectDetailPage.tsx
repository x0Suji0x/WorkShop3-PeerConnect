import { ArrowLeft, CheckCircle2, Clock3, MapPin, Send, Wallet, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { routes } from '../../app/routes'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { MarketplaceTabs } from '../../components/marketplace/MarketplaceTabs'
import { marketplaceProjects } from '../../data/projectMarketplaceMockData'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import { useAuth } from '../../lib/auth/AuthProvider'
import { supabaseApplicationRepository } from '../../repositories/supabaseApplicationRepository'
import type { AccountApplication } from '../../repositories/applicationRepository'
import type { ProjectOpportunity } from '../../types'
import { supabaseProjectRepository } from '../../repositories/supabaseProjectRepository'

const formatBudget = (budget: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    budget
  )

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const { student } = useStudentProfile()
  const auth = useAuth()
  const sampleProject = marketplaceProjects.find((item) => item.id === projectId) ?? null
  const [project, setProject] = useState<ProjectOpportunity | null>(sampleProject)
  const [isLoading, setIsLoading] = useState(!sampleProject)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const [isApplying, setIsApplying] = useState(false)
  const [application, setApplication] = useState<AccountApplication | null>(null)
  const [isCheckingApplication, setIsCheckingApplication] = useState(false)
  const [applicationError, setApplicationError] = useState<string | null>(null)
  const [applicationRetryKey, setApplicationRetryKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const sample = marketplaceProjects.find((item) => item.id === projectId)
    if (sample) {
      setProject(sample)
      setIsLoading(false)
      setLoadError(null)
      return
    }

    let active = true
    setProject(null)
    setIsLoading(true)
    setLoadError(null)
    supabaseProjectRepository.getPublishedById(projectId ?? '')
      .then((publishedProject) => {
        if (active) setProject(publishedProject)
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Could not load this project.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => { active = false }
  }, [projectId, retryKey])

  useEffect(() => {
    if (
      !project || project.source !== 'account' || auth.status !== 'signedIn'
      || auth.profile?.role !== 'student' || !auth.user?.id
    ) {
      setApplication(null)
      setIsCheckingApplication(false)
      setApplicationError(null)
      return
    }

    let active = true
    setIsCheckingApplication(true)
    setApplicationError(null)
    void supabaseApplicationRepository.getMineForProject(auth.user.id, project.id)
      .then((current) => { if (active) setApplication(current) })
      .catch((error: unknown) => {
        if (active) setApplicationError(error instanceof Error ? error.message : 'Could not check your application.')
      })
      .finally(() => { if (active) setIsCheckingApplication(false) })
    return () => { active = false }
  }, [project?.id, project?.source, auth.status, auth.profile?.role, auth.user?.id, applicationRetryKey])

  if (isLoading) {
    return <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8" role="status">Loading project…</div>
  }

  if (!project) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          title="That project is no longer available"
          description={loadError ?? 'It may have been removed, closed, or the link may be incorrect.'}
          action={
            loadError
              ? <Button onClick={() => setRetryKey((value) => value + 1)}>Retry</Button>
              : <Link to={routes.projects}><Button>Browse projects</Button></Link>
          }
        />
      </div>
    )
  }

  const handleApply = async (note: string) => {
    if (!auth.user?.id || !project.id) return
    setIsSubmitting(true)
    setApplicationError(null)
    try {
      const submittedApplication = await supabaseApplicationRepository.submit(auth.user.id, project.id, note)
      setApplication(submittedApplication)
      setIsApplying(false)
    } catch (error) {
      setApplicationError(error instanceof Error ? error.message : 'Could not submit your application.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Ambient lighting glows identical to home page */}
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 space-y-6">
        <Link
          to={routes.projects}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#525A55] hover:text-[#123D30] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>

      <MarketplaceTabs />

      <div className="grid gap-6 lg:grid-cols-12">
        <main className="lg:col-span-8 space-y-6">
          <Card padding="lg">
            <div className="flex flex-wrap gap-2">
              {project.source === 'sample' && <Badge variant="neutral">Sample</Badge>}
              {project.badge && (
                <Badge variant={project.badge === 'High Urgency' ? 'peach' : 'green'}>
                  {project.badge}
                </Badge>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#171916] sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-2 text-base font-semibold text-[#08A876]">
              {project.clientName} · {project.clientType}
            </p>

            <p className="mt-6 text-sm leading-7 text-[#525A55]">{project.description}</p>

            <section className="mt-8 peer-divider-fade-t pt-6">
              <h2 className="text-lg font-black text-[#171916]">What you’ll deliver</h2>
              <ul className="mt-4 space-y-3">
                {project.deliverables?.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-[#525A55]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#08C58A]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8 peer-divider-fade-t pt-6">
              <h2 className="text-lg font-black text-[#171916]">Skills that will help</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.skillsRequired.map((skill) => (
                  <Badge key={skill} variant="neutral">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          </Card>
        </main>

        <aside className="space-y-5 lg:col-span-4">
          <Card padding="md">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">
              Project terms
            </p>
            <dl className="mt-5 space-y-4 text-sm">
              <Term icon={Wallet} label="Budget schedule" value={formatBudget(project.budget)} />
              <Term icon={Clock3} label="Commitment" value={`${project.duration} · ${project.hoursPerWeek}`} />
              <Term icon={MapPin} label="Work mode" value={project.workMode ?? 'Remote'} />
            </dl>

            <div className="mt-6 peer-divider-fade-t pt-5">
              {applicationError && (
                <div role="alert" className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  <p>{applicationError}</p>
                  {!application && !isApplying && !isCheckingApplication && project.source === 'account' && auth.profile?.role === 'student' && (
                    <button type="button" onClick={() => setApplicationRetryKey((value) => value + 1)} className="mt-1 font-bold underline">Retry check</button>
                  )}
                </div>
              )}
              {project.source === 'sample' ? (
                <div className="rounded-2xl border border-[#E7E8E1] bg-[#FAF8F5] p-4 text-xs text-[#525A55]">
                  This is a sample listing. Applications are available on published projects posted by client accounts.
                </div>
              ) : isCheckingApplication && auth.status === 'signedIn' && auth.profile?.role === 'student' ? (
                <p role="status" className="text-xs text-[#777A72]">Checking your application…</p>
              ) : application ? (
                <div className="rounded-2xl border border-[#08C58A]/30 bg-[#E3F4EB] p-4 text-xs font-semibold text-[#123D30] space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-[#08A876]" />
                    <span>Application {application.status === 'submitted' ? 'submitted' : `is ${application.status}`}</span>
                  </div>
                  <p className="text-[#525A55]">
                    Your proposal is saved to your account. The project owner can review it and update its status.
                  </p>
                  <Link
                    to={routes.applications}
                    className="inline-flex items-center gap-1 font-bold text-[#08A876] hover:underline pt-1"
                  >
                    View in My Applications <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              ) : isApplying ? (
                <ApplicationComposer
                  studentName={student.name}
                  onCancel={() => setIsApplying(false)}
                  onSubmit={handleApply}
                  isSubmitting={isSubmitting}
                />
              ) : auth.status === 'signedIn' && auth.profile?.role === 'student' ? (
                <Button className="w-full" onClick={() => setIsApplying(true)}>
                  <Send className="h-4 w-4 mr-1.5" /> Apply to project
                </Button>
              ) : auth.status === 'signedOut' ? (
                <Link to="/signin"><Button className="w-full">Sign in as a student to apply</Button></Link>
              ) : auth.status === 'signedIn' && auth.profile?.role !== 'student' ? (
                <p className="rounded-xl bg-[#FAF8F5] p-3 text-xs text-[#525A55]">Only student accounts can apply to projects.</p>
              ) : auth.status === 'unconfigured' ? (
                <p role="alert" className="rounded-xl bg-[#FAF8F5] p-3 text-xs text-[#525A55]">Sign-in isn’t configured, so you can’t submit an application right now.</p>
              ) : (
                <p role="status" className="text-xs text-[#777A72]">Checking your account…</p>
              )}
            </div>
          </Card>
        </aside>
      </div>
      </div>
    </div>
  )
}

function ApplicationComposer({
  studentName,
  onCancel,
  onSubmit,
  isSubmitting,
}: {
  studentName: string
  onCancel: () => void
  onSubmit: (note: string) => Promise<void>
  isSubmitting: boolean
}) {
  const [note, setNote] = useState(
    `Hi, I'm ${studentName}. I have hands-on experience building projects in this domain and would love to collaborate on this scope.`
  )

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-[#171916]" htmlFor="application-note">
        Your Proposal Pitch
      </label>
      <textarea
        id="application-note"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows={4}
        className="w-full rounded-xl border border-[#E7E8E1] p-3 text-xs outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
        placeholder="Share a short note explaining your relevant experience..."
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => void onSubmit(note)} disabled={!note.trim() || isSubmitting} className="flex-1">
          {isSubmitting ? 'Sending…' : 'Send Proposal'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

function Term({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wallet
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#08A876]" />
      <div>
        <dt className="text-xs text-[#777A72]">{label}</dt>
        <dd className="mt-0.5 font-bold text-[#171916]">{value}</dd>
      </div>
    </div>
  )
}
