import { ArrowLeft, CheckCircle2, Clock3, MapPin, Send, Wallet, ExternalLink } from 'lucide-react'
import { useState } from 'react'
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

const formatBudget = (budget: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    budget
  )

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const { student } = useStudentProfile()
  const project = marketplaceProjects.find((item) => item.id === projectId)
  const [isApplying, setIsApplying] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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
    })

    setSubmitted(true)
    setIsApplying(false)
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
              <Term icon={Wallet} label="Budget (Milestone Escrow)" value={formatBudget(project.budget)} />
              <Term icon={Clock3} label="Commitment" value={`${project.duration} · ${project.hoursPerWeek}`} />
              <Term icon={MapPin} label="Work mode" value={project.workMode ?? 'Remote'} />
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
