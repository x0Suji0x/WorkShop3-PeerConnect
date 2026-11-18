import { useState, useMemo } from 'react'
import {
  Search, CheckCircle2, Clock, AlertCircle, Calendar,
  Building2, Users, ArrowRight, ArrowLeft, RefreshCw,
  Sparkles, Mail,
} from 'lucide-react'
import {
  getStoredApplications, type SubmittedApplication,
} from '../../data/collegeData'
import { encodeRoute } from '../../lib/collegeRouter'

interface ApplicationStatusPageProps {
  initialEmail?: string
  onNavigate: (hash: string) => void
}

export function ApplicationStatusPage({ initialEmail = '', onNavigate }: ApplicationStatusPageProps) {
  const [emailSearch, setEmailSearch] = useState(initialEmail)
  const [filterType, setFilterType] = useState<'All' | 'club' | 'volunteer'>('All')
  const [applications, setApplications] = useState<SubmittedApplication[]>(() => getStoredApplications())

  const handleRefresh = () => {
    setApplications(getStoredApplications())
  }

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchEmail =
        !emailSearch ||
        app.applicantEmail.toLowerCase().includes(emailSearch.toLowerCase()) ||
        app.applicantName.toLowerCase().includes(emailSearch.toLowerCase()) ||
        app.id.toLowerCase().includes(emailSearch.toLowerCase())
      const matchType = filterType === 'All' || app.type === filterType
      return matchEmail && matchType
    })
  }, [applications, emailSearch, filterType])

  return (
    <section className="min-h-screen bg-[#FAF8F5] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => onNavigate(encodeRoute({ page: 'colleges' }))}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#171916] text-xs font-semibold border border-[#E7E8E1] hover:bg-[#F7F6F0] cursor-pointer shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Discovery
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 text-xs text-[#777A72] hover:text-[#171916] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Statuses
          </button>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3F4EB] border border-[#08C58A]/30 text-[#123D30] text-xs font-bold tracking-wider uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
            Application Tracker
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#171916] tracking-tight mb-3">
            Track Application{' '}
            <span className="text-[#08C58A] relative inline-block">
              Status
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 w-full h-2.5 bg-[#E3F4EB] -rotate-1 -z-10 rounded-sm"
              />
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#777A72] max-w-2xl leading-relaxed">
            Check the review progress of your club recruitments and event volunteer applications.
            Enter your email or application ID below to view live status updates.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#E7E8E1] p-4 sm:p-5 mb-8 shadow-2xs space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777A72]" />
            <input
              type="text"
              placeholder="Search by your email address, name, or Application ID (e.g. APP-7021)…"
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E8E1] bg-[#F7F6F0] text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 focus:border-[#08C58A] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#777A72]">Filter by:</span>
              {(['All', 'club', 'volunteer'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                    filterType === t
                      ? 'bg-[#171916] text-white'
                      : 'bg-[#F7F6F0] text-[#777A72] border border-[#E7E8E1] hover:text-[#171916]'
                  }`}
                >
                  {t === 'All' ? 'All Applications' : t === 'club' ? 'Club Openings' : 'Volunteer Roles'}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#777A72]">
              Showing <strong className="text-[#171916]">{filtered.length}</strong> of {applications.length} submitted
            </div>
          </div>
        </div>

        {/* Application Cards List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E7E8E1] p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F6F0] flex items-center justify-center mx-auto text-[#777A72]">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#171916] text-lg">No matching applications found</h3>
              <p className="text-sm text-[#777A72] mt-1 max-w-md mx-auto">
                We couldn't find applications matching "{emailSearch}". Clear the search or explore
                open club recruitments and volunteer opportunities.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEmailSearch('')}
                className="px-5 py-2 rounded-xl bg-[#F7F6F0] text-xs font-semibold border border-[#E7E8E1] text-[#171916] hover:bg-[#EAE8DF] cursor-pointer"
              >
                Clear Search
              </button>
              <button
                type="button"
                onClick={() => onNavigate(encodeRoute({ page: 'clubs' }))}
                className="px-5 py-2 rounded-xl bg-[#08C58A] text-xs font-bold text-[#0A261D] hover:bg-[#07B27C] cursor-pointer"
              >
                Browse Clubs
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((app) => (
              <ApplicationStatusCard
                key={app.id}
                application={app}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ApplicationStatusCard({
  application,
  onNavigate,
}: {
  application: SubmittedApplication
  onNavigate: (hash: string) => void
}) {
  const isClub = application.type === 'club'

  const statusConfig = {
    'Pending Review': {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200/80',
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      step: 1,
    },
    'Under Review': {
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200/80',
      icon: <Clock className="w-4 h-4 text-sky-600" />,
      step: 2,
    },
    'Interview Scheduled': {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200/80',
      icon: <Calendar className="w-4 h-4 text-purple-600" />,
      step: 3,
    },
    Accepted: {
      bg: 'bg-[#E3F4EB]',
      text: 'text-[#123D30]',
      border: 'border-[#08C58A]/40',
      icon: <CheckCircle2 className="w-4 h-4 text-[#08C58A]" />,
      step: 4,
    },
  }[application.status] ?? {
    bg: 'bg-gray-50',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: <AlertCircle className="w-4 h-4 text-gray-600" />,
    step: 1,
  }

  return (
    <article className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs hover:border-[#08C58A]/40 transition-all">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E7E8E1]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E3F4EB] flex items-center justify-center text-[#08C58A] shrink-0">
            {isClub ? <Users className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#777A72] uppercase tracking-wider">
                {isClub ? 'Club Recruitment' : 'Volunteer Application'}
              </span>
              <span className="text-xs text-[#777A72]">·</span>
              <span className="font-mono text-xs font-bold text-[#171916]">{application.id}</span>
            </div>
            <h3 className="font-black text-[#171916] text-lg leading-snug">
              {application.targetTitle}
            </h3>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold w-fit ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
          {statusConfig.icon}
          <span>{application.status}</span>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="py-6 border-b border-[#E7E8E1]">
        <p className="text-[11px] font-bold text-[#777A72] uppercase tracking-wider mb-3">
          Application Progress
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Submitted', num: 1 },
            { label: 'Under Review', num: 2 },
            { label: 'Interview', num: 3 },
            { label: 'Decision', num: 4 },
          ].map((s) => {
            const isCompleted = s.num <= statusConfig.step
            const isCurrent = s.num === statusConfig.step
            return (
              <div key={s.num} className="space-y-1.5 text-center">
                <div
                  className={`h-2 rounded-full transition-colors ${
                    isCompleted ? 'bg-[#08C58A]' : 'bg-[#E7E8E1]'
                  } ${isCurrent ? 'ring-2 ring-[#08C58A]/30' : ''}`}
                />
                <span
                  className={`text-[11px] font-semibold block truncate ${
                    isCompleted ? 'text-[#171916]' : 'text-[#777A72]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 text-xs text-[#777A72]">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#08C58A] shrink-0" />
          <div className="truncate">
            <span className="block text-[10px] uppercase font-bold text-[#777A72]">Organization</span>
            <span className="font-bold text-[#171916] truncate block">{application.organization}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#08C58A] shrink-0" />
          <div className="truncate">
            <span className="block text-[10px] uppercase font-bold text-[#777A72]">Applicant</span>
            <span className="font-bold text-[#171916] truncate block">{application.applicantName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#08C58A] shrink-0" />
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#777A72]">Applied On</span>
            <span className="font-bold text-[#171916] block">{application.appliedDate}</span>
          </div>
        </div>
      </div>

      {/* Reviewer Notes / Feedback */}
      {application.notes && (
        <div className="p-4 rounded-2xl bg-[#F7F6F0] border border-[#E7E8E1] text-xs space-y-1">
          <span className="font-bold text-[#171916] block">Reviewer Notes:</span>
          <p className="text-[#777A72] leading-relaxed">{application.notes}</p>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-5 mt-2">
        <span className="text-[11px] text-[#777A72]">
          Campus: <strong className="text-[#171916]">{application.collegeName}</strong>
        </span>
        <button
          type="button"
          onClick={() => {
            if (isClub) {
              onNavigate(encodeRoute({ page: 'clubs' }))
            } else {
              onNavigate(encodeRoute({ page: 'events' }))
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08C58A] hover:underline cursor-pointer"
        >
          {isClub ? 'View Club Openings' : 'View Campus Events'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  )
}
