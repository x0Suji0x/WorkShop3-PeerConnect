import { ArrowLeft, CheckCircle2, Clock3, MapPin, Send, Wallet, ExternalLink, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { routes } from '../../app/routes'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { MarketplaceTabs } from '../../components/marketplace/MarketplaceTabs'
import { marketplaceProjects } from '../../data/projectMarketplaceMockData'
import { useStudentProfile } from '../../hooks/useStudentProfile'
import { getStoredApplications, saveApplication } from '../../lib/applicationStorage'
import type { Project } from '../../types'

const formatBudget = (budget: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    budget
  )

interface BackendProjectDetailRaw {
  id: string
  title: string
  clientName?: string
  clientType?: string
  clientLocation?: string
  budget?: number
  budgetType?: 'Fixed Escrow' | 'Milestone Escrow' | 'Hourly'
  duration?: string
  hoursPerWeek?: string
  description?: string
  skillsRequired?: string[]
  badge?: 'High Urgency' | 'Featured' | 'New' | 'Verified Client'
  applicantsCount?: number
  postedTimeAgo?: string
  category?: string
  workMode?: 'Remote' | 'Hybrid' | 'On-site'
  deliverables?: string[]
  clientId?: string
  createdAt?: string
}

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const { student } = useStudentProfile()
  const initialProject = useMemo(
    () => marketplaceProjects.find((item) => item.id === projectId) || null,
    [projectId]
  )
  const [apiProject, setApiProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(!initialProject)
  const [isApplying, setIsApplying] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const project = apiProject || initialProject

  useEffect(() => {
    if (!projectId) return

    let isMounted = true
    fetch(`/api/projects/${projectId}`)
      .then(async (res) => {
        if (!res.ok) return
        const data = (await res.json()) as { project?: BackendProjectDetailRaw }
        if (isMounted && data.project) {
          const p = data.project
          setApiProject({
            id: p.id,
            title: p.title,
            clientId: p.clientId || 'client-api',
            clientName: p.clientName || 'Apex Studio & Labs',
            clientType: p.clientType || 'Verified Employer',
            clientLocation: p.clientLocation || 'Remote Scope',
            budget: Number(p.budget) || 50000,
            budgetType: p.budgetType || 'Milestone Escrow',
            duration: p.duration || '3-4 Weeks',
            hoursPerWeek: p.hoursPerWeek || '15-20 hrs/wk',
            description: p.description || '',
            skillsRequired: Array.isArray(p.skillsRequired) ? p.skillsRequired : [],
            badge: p.badge || 'New',
            applicantsCount: p.applicantsCount || 0,
            postedTimeAgo: p.postedTimeAgo || 'Just now',
            status: 'open',
            createdAt: p.createdAt || new Date().toISOString(),
            category: p.category || 'Design & development',
            workMode: p.workMode || (p.clientLocation?.includes('Campus') ? 'Hybrid' : 'Remote'),
            clientVerified: true,
            deliverables: p.deliverables || [
              'Initial scope discovery & milestone plan',
              'Sprint deliverables with clean code and tests',
              'Code walkthrough and project documentation',
            ],
          })
        }
      })
      .catch((err) => {
        console.warn('[ProjectDetailPage] Could not fetch project detail:', err)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [projectId])

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#08A876]" />
          <p className="text-sm font-semibold text-[#525A55]">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          title="That project is no longer available"
          description="It may have been removed, closed, or the link may be incorrect."
          action={
            <Link to={routes.projects}>
              <Button>Browse projects</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const existingApp = getStoredApplications().find((a) => a.projectId === project.id)
  const isAlreadySubmitted = Boolean(existingApp) || submitted

  const handleApply = (note: string) => {
    saveApplication({
      projectId: project.id,
      studentId: student.id,
      coverLetter: note.trim(),
      status: 'submitted',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      projectTitle: project.title,
      clientName: project.clientName,
      studentName: student.name,
      studentCollege: student.college,
      studentRole: student.headline,
      studentAvatar: student.avatarUrl,
      skills: student.skills.map((s) => s.name),
      portfolioUrl: student.socialLinks?.portfolio || student.socialLinks?.github,
      proposedRate: project.budget,
    })

    setSubmitted(true)
    setIsApplying(false)
  }

  const deliverables = project.deliverables && project.deliverables.length > 0
    ? project.deliverables
    : [
        'Discovery sprint and milestone alignment',
        'High quality implementation with reviews',
        'Handoff documentation and support',
      ]

  const skillsList = project.skillsRequired || []

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
                {project.badge && (
                  <Badge variant={project.badge === 'High Urgency' ? 'peach' : 'green'}>
                    {project.badge}
                  </Badge>
                )}
                {project.clientVerified && (
                  <Badge variant="neutral">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified client
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
                  {deliverables.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-[#525A55]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#08C58A]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {skillsList.length > 0 && (
                <section className="mt-8 peer-divider-fade-t pt-6">
                  <h2 className="text-lg font-black text-[#171916]">Skills that will help</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skillsList.map((skill) => (
                      <Badge key={skill} variant="neutral">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </Card>
          </main>

          <aside className="space-y-5 lg:col-span-4">
            <Card padding="md">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">
                Project terms
              </p>
              <dl className="mt-5 space-y-4 text-sm">
                <Term
                  icon={Wallet}
                  label="Budget (Milestone Escrow)"
                  value={formatBudget(project.budget)}
                />
                <Term
                  icon={Clock3}
                  label="Commitment"
                  value={`${project.duration} · ${project.hoursPerWeek}`}
                />
                <Term
                  icon={MapPin}
                  label="Work mode"
                  value={project.workMode ?? 'Remote'}
                />
              </dl>

              <div className="mt-6 peer-divider-fade-t pt-5">
                {isAlreadySubmitted ? (
                  <div className="rounded-2xl border border-[#08C58A]/30 bg-[#E3F4EB] p-4 text-xs font-semibold text-[#123D30] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="h-4 w-4 text-[#08A876]" />
                      <span>Proposal Submitted!</span>
                    </div>
                    <p className="text-[#525A55]">
                      Your application is live and visible to the client in their Employer Workspace.
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
                  />
                ) : (
                  <Button className="w-full" onClick={() => setIsApplying(true)}>
                    <Send className="h-4 w-4 mr-1.5" /> Apply to project
                  </Button>
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
}: {
  studentName: string
  onCancel: () => void
  onSubmit: (note: string) => void
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
        <Button size="sm" onClick={() => onSubmit(note)} disabled={!note.trim()} className="flex-1">
          Send Proposal
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
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
