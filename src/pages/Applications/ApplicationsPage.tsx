import { BriefcaseBusiness, CheckCircle2, Clock3, FileText, XCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectRoute, routes } from '../../app/routes'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { EmptyState } from '../../components/common/EmptyState'
import { PageHeading } from '../../components/common/PageHeading'
import { DemoNotice } from '../../components/common/DemoNotice'
import { DEMO_COPY } from '../../config/demoCopy'
import { MarketplaceTabs } from '../../components/marketplace/MarketplaceTabs'
import { mockApplications } from '../../data/projectMarketplaceMockData'
import { getStoredApplications, removeApplication } from '../../lib/applicationStorage'
import type { Application } from '../../types'

const statusStyles: Record<
  Application['status'],
  { label: string; variant: 'green' | 'peach' | 'neutral'; icon: typeof Clock3 }
> = {
  draft: { label: 'Draft', variant: 'neutral', icon: FileText },
  submitted: { label: 'Submitted', variant: 'peach', icon: Clock3 },
  shortlisted: { label: 'Shortlisted', variant: 'green', icon: CheckCircle2 },
  rejected: { label: 'Not selected', variant: 'neutral', icon: XCircle },
  accepted: { label: 'Accepted', variant: 'green', icon: CheckCircle2 },
}

export function ApplicationsPage() {
  const [filter, setFilter] = useState<'all' | Application['status']>('all')

  // Load both user-submitted stored applications + mock applications
  const [allApplications, setAllApplications] = useState<Application[]>(() => {
    const stored = getStoredApplications()
    return [...stored, ...mockApplications]
  })

  useEffect(() => {
    const syncApplications = () => {
      const stored = getStoredApplications()
      const storedIds = new Set(stored.map((a) => a.id))
      const deduplicatedMocks = mockApplications.filter((m) => !storedIds.has(m.id))
      setAllApplications([...stored, ...deduplicatedMocks])
    }

    window.addEventListener('peerconnect_applications_updated', syncApplications)
    return () => window.removeEventListener('peerconnect_applications_updated', syncApplications)
  }, [])

  const visibleApplications = useMemo(
    () => allApplications.filter((app) => filter === 'all' || app.status === filter),
    [allApplications, filter]
  )

  const withdraw = (applicationId: string) => {
    removeApplication(applicationId)
    setAllApplications((current) => current.filter((app) => app.id !== applicationId))
  }

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Ambient lighting glows identical to home page */}
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 space-y-6">
        <PageHeading
          eyebrow="Your activity"
          title="Applications in progress."
          description="Review your demo applications and sample status updates."
        />
        <DemoNotice><strong>Submitted applications and status changes.</strong> {DEMO_COPY.device}</DemoNotice>

        <MarketplaceTabs />

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'submitted', 'shortlisted', 'rejected'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition-all ${
                filter === status
                  ? 'bg-[#123D30] text-white shadow-2xs'
                  : 'border border-[rgba(91,112,96,0.18)] bg-white/80 backdrop-blur-xs text-[#525A55] hover:border-[#08C58A]'
              }`}
            >
              {status === 'all' ? 'All applications' : status}
            </button>
          ))}
        </div>

        {visibleApplications.length ? (
          <div className="space-y-3">
            {visibleApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onWithdraw={() => withdraw(application.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              icon={BriefcaseBusiness}
              title="No applications in this view"
              description="Browse open projects to start a new application."
              action={
                <Link to={routes.projects}>
                  <Button>Discover projects</Button>
                </Link>
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ApplicationCard({
  application,
  onWithdraw,
}: {
  application: Application
  onWithdraw: () => void
}) {
  const status = statusStyles[application.status] || statusStyles.submitted
  const Icon = status.icon

  return (
    <div className="peer-card-glass p-5 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant={status.variant} size="sm" className="font-bold">
              <Icon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
            <span className="text-xs text-[#777A72]">
              Submitted {application.updatedAt || 'Recently'}
            </span>
          </div>
          <h2 className="text-base font-black text-[#171916]">{application.projectTitle}</h2>
          <p className="text-xs font-semibold text-[#08A876]">{application.clientName}</p>
          {application.coverLetter && (
            <p className="text-xs text-[#525A55] italic pt-1 max-w-xl line-clamp-2">
              "{application.coverLetter}"
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to={projectRoute(application.projectId)}>
            <Button variant="secondary" size="sm">
              View project
            </Button>
          </Link>
          {application.status === 'submitted' && (
            <Button variant="ghost" size="sm" onClick={onWithdraw}>
              Withdraw
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
