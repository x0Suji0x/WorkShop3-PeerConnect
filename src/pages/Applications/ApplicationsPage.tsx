import { BriefcaseBusiness, CheckCircle2, Clock3, FileText, XCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectRoute, routes } from '../../app/routes'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { EmptyState } from '../../components/common/EmptyState'
import { PageHeading } from '../../components/common/PageHeading'
import { MarketplaceTabs } from '../../components/marketplace/MarketplaceTabs'
import { useAuth } from '../../lib/auth/AuthProvider'
import { supabaseApplicationRepository } from '../../repositories/supabaseApplicationRepository'
import type { Application } from '../../types'

const statusStyles: Record<
  Application['status'],
  { label: string; variant: 'green' | 'peach' | 'neutral'; icon: typeof Clock3 }
> = {
  submitted: { label: 'Submitted', variant: 'peach', icon: Clock3 },
  shortlisted: { label: 'Shortlisted', variant: 'green', icon: CheckCircle2 },
  rejected: { label: 'Not selected', variant: 'neutral', icon: XCircle },
  accepted: { label: 'Accepted', variant: 'green', icon: CheckCircle2 },
  withdrawn: { label: 'Withdrawn', variant: 'neutral', icon: FileText },
}

const filters: Array<'all' | Application['status']> = [
  'all', 'submitted', 'shortlisted', 'accepted', 'rejected', 'withdrawn',
]

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Recently'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ApplicationsPage() {
  const { user, profile } = useAuth()
  const [filter, setFilter] = useState<'all' | Application['status']>('all')
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id || profile?.role !== 'student') {
      setApplications([])
      setIsLoading(false)
      setError(null)
      return
    }

    let active = true
    setApplications([])
    setIsLoading(true)
    setError(null)
    void supabaseApplicationRepository.listMine(user.id)
      .then((rows) => { if (active) setApplications(rows) })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load your applications.')
      })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [user?.id, profile?.role, retryKey])

  const visibleApplications = useMemo(
    () => applications.filter((app) => filter === 'all' || app.status === filter),
    [applications, filter],
  )

  const withdraw = async (applicationId: string) => {
    setUpdatingId(applicationId)
    setError(null)
    try {
      await supabaseApplicationRepository.withdraw(applicationId)
      setApplications((current) => current.map((app) =>
        app.id === applicationId ? { ...app, status: 'withdrawn' } : app,
      ))
    } catch (withdrawError) {
      setError(withdrawError instanceof Error ? withdrawError.message : 'Could not withdraw this application.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden">
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 space-y-6">
        <PageHeading
          eyebrow="Your activity"
          title="Your project applications."
          description="Track proposals you’ve sent and see status changes from project owners."
        />
        <MarketplaceTabs />

        {profile?.role === 'client' ? (
          <EmptyState
            icon={BriefcaseBusiness}
            title="Review applicants from your dashboard"
            description="Project applicants and shortlist decisions appear in your client dashboard."
            action={<Link to={routes.dashboard}><Button>Open client dashboard</Button></Link>}
          />
        ) : (
          <>
            {error && (
              <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <span>{error}</span>
                <button type="button" className="font-bold underline" onClick={() => setRetryKey((value) => value + 1)}>Retry</button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {filters.map((status) => (
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

            {isLoading ? (
              <p role="status" className="py-8 text-center text-sm text-[#777A72]">Loading your applications…</p>
            ) : visibleApplications.length ? (
              <div className="space-y-3">
                {visibleApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    isUpdating={updatingId === application.id}
                    onWithdraw={() => void withdraw(application.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BriefcaseBusiness}
                title={filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
                description="Browse published projects to send a proposal. Your applications will appear here."
                action={<Link to={routes.projects}><Button>Discover projects</Button></Link>}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ApplicationCard({
  application,
  isUpdating,
  onWithdraw,
}: {
  application: Application
  isUpdating: boolean
  onWithdraw: () => void
}) {
  const status = statusStyles[application.status]
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
            <span className="text-xs text-[#777A72]">Submitted {formatDate(application.createdAt)}</span>
          </div>
          <h2 className="text-base font-black text-[#171916]">{application.projectTitle || 'Project listing'}</h2>
          {application.clientName && <p className="text-xs font-semibold text-[#08A876]">{application.clientName}</p>}
          {application.coverLetter && (
            <p className="text-xs text-[#525A55] italic pt-1 max-w-xl line-clamp-2">“{application.coverLetter}”</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to={projectRoute(application.projectId)}>
            <Button variant="secondary" size="sm">View project</Button>
          </Link>
          {application.status === 'submitted' && (
            <Button variant="ghost" size="sm" disabled={isUpdating} onClick={onWithdraw}>
              {isUpdating ? 'Withdrawing…' : 'Withdraw'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
