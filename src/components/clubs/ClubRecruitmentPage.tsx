import { useState } from 'react'
import {
  ArrowLeft, Users, Calendar, CheckCircle2, Clock,
  ChevronDown, ChevronUp, ArrowRight, Sparkles, Building2,
} from 'lucide-react'
import {
  getClubById, getOpeningsByClub, getCollegeById, saveStoredApplication,
  getStoredApplications, type ClubOpening, type SubmittedApplication,
} from '../../data/collegeData'
import { encodeRoute } from '../../lib/collegeRouter'

interface ClubRecruitmentPageProps {
  clubId: string
  initialOpeningId?: string
  onNavigate: (hash: string) => void
}

type TabType = 'openings' | 'status'

interface ApplicationForm {
  name: string
  email: string
  phone: string
  portfolio: string
  statement: string
}

const emptyForm: ApplicationForm = {
  name: '',
  email: '',
  phone: '',
  portfolio: '',
  statement: '',
}

export function ClubRecruitmentPage({
  clubId,
  initialOpeningId,
  onNavigate,
}: ClubRecruitmentPageProps) {
  const club = getClubById(clubId)
  const openings = getOpeningsByClub(clubId)
  const college = club ? getCollegeById(club.collegeId) : undefined

  const [activeTab, setActiveTab] = useState<TabType>('openings')
  const [expandedId, setExpandedId] = useState<string | null>(
    initialOpeningId ?? (openings[0]?.id ?? null)
  )
  const [applyingTo, setApplyingTo] = useState<string | null>(null)
  const [form, setForm] = useState<ApplicationForm>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationForm, string>>>({})
  const [submittedApp, setSubmittedApp] = useState<SubmittedApplication | null>(null)

  if (!club) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4 py-20">
        <Users className="w-12 h-12 text-[#E7E8E1]" />
        <p className="font-bold text-[#171916] text-lg">Club not found</p>
        <button
          type="button"
          onClick={() => onNavigate(encodeRoute({ page: 'clubs' }))}
          className="px-5 py-2.5 rounded-full bg-[#171916] text-white text-sm font-semibold cursor-pointer"
        >
          Back to Clubs
        </button>
      </div>
    )
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ApplicationForm, string>> = {}
    if (!form.name.trim()) errs.name = 'Please provide your full name'
    if (!form.email.trim()) errs.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address'
    }
    if (!form.statement.trim()) errs.statement = 'Please write a brief statement on why you wish to join'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (opening: ClubOpening) => {
    if (!validate()) return

    const newApp = saveStoredApplication({
      type: 'club',
      targetTitle: opening.role,
      organization: club.name,
      collegeName: college?.shortName ?? 'Campus',
      applicantName: form.name.trim(),
      applicantEmail: form.email.trim(),
      applicantPhone: form.phone.trim() || undefined,
      portfolio: form.portfolio.trim() || undefined,
      statement: form.statement.trim(),
    })

    setSubmittedApp(newApp)
    setApplyingTo(null)
    setForm(emptyForm)
    setErrors({})
  }

  const userApplications = getStoredApplications().filter(
    (app) => app.organization === club.name
  )

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-[#E7E8E1] sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate(encodeRoute({ page: 'club-profile', clubId }))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F6F0] text-[#171916] text-xs font-semibold border border-[#E7E8E1] hover:bg-[#EAE8DF] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Club
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <img
                src={club.logoUrl}
                alt={club.name}
                className="w-7 h-7 rounded-lg object-cover border border-[#E7E8E1]"
              />
              <span className="text-xs font-bold text-[#171916]">{club.name}</span>
            </div>
          </div>

          {/* Toggle between Openings and Check Status */}
          <div className="flex items-center gap-1 bg-[#F7F6F0] p-1 rounded-xl border border-[#E7E8E1]">
            <button
              type="button"
              onClick={() => setActiveTab('openings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'openings'
                  ? 'bg-white text-[#171916] shadow-2xs'
                  : 'text-[#777A72] hover:text-[#171916]'
              }`}
            >
              Openings ({openings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('status')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'status'
                  ? 'bg-white text-[#171916] shadow-2xs'
                  : 'text-[#777A72] hover:text-[#171916]'
              }`}
            >
              Check Application Status
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Recruitment Listing Header Example (e.g. "Photography Club – Recruiting 3 photographers.") */}
        <div className="mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3F4EB] border border-[#08C58A]/30 text-[#123D30] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
            Recruitment Drive 2026–2027
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#171916] leading-tight">
            {openings[0]?.headline ?? `${club.name} – Recruiting ${club.openings} Members.`}
          </h1>

          <p className="text-sm text-[#777A72] leading-relaxed max-w-2xl">
            {club.description} Review open positions, examine candidate requirements and role
            responsibilities, and submit your application below.
          </p>

          {college && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#777A72] pt-1">
              <Building2 className="w-3.5 h-3.5 text-[#08C58A]" />
              <span>Campus Affiliation: {college.name} ({college.shortName})</span>
            </div>
          )}
        </div>

        {/* TAB 1: OPENINGS LISTING */}
        {activeTab === 'openings' && (
          <div className="space-y-6">
            {/* If user recently submitted an app */}
            {submittedApp && (
              <div className="bg-white rounded-3xl border-2 border-[#08C58A] p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E3F4EB] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-[#08C58A]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#08C58A] bg-[#E3F4EB] px-2 py-0.5 rounded-md">
                      {submittedApp.id}
                    </span>
                    <h3 className="font-black text-[#171916] text-base mt-1">
                      Application Submitted Successfully!
                    </h3>
                    <p className="text-xs text-[#777A72] mt-0.5">
                      Your application for <strong>{submittedApp.targetTitle}</strong> at {club.name} has been received.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('status')}
                  className="px-5 py-2.5 rounded-xl bg-[#171916] hover:bg-[#242723] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Track Application Status →
                </button>
              </div>
            )}

            {openings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E7E8E1] p-12 text-center space-y-3">
                <Users className="w-12 h-12 text-[#E7E8E1] mx-auto" />
                <h3 className="font-bold text-[#171916] text-base">No active openings right now</h3>
                <p className="text-sm text-[#777A72]">
                  This club has filled its current positions. Check back next session or explore other clubs.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {openings.map((opening) => {
                  const isExpanded = expandedId === opening.id
                  const isApplying = applyingTo === opening.id

                  return (
                    <article
                      key={opening.id}
                      className={`bg-white rounded-3xl border transition-all duration-200 shadow-2xs overflow-hidden ${
                        isExpanded ? 'border-[#08C58A]/60 ring-2 ring-[#08C58A]/10' : 'border-[#E7E8E1] hover:border-[#D1D2C9]'
                      }`}
                    >
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : opening.id)}
                        className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#E3F4EB] flex items-center justify-center text-[#08C58A] shrink-0">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-[#08C58A] uppercase tracking-wider block mb-0.5">
                              {opening.headline}
                            </span>
                            <h2 className="font-black text-lg text-[#171916] leading-snug">
                              {opening.role}
                            </h2>
                            <div className="flex items-center gap-3 text-xs text-[#777A72] mt-1">
                              <span><strong>{opening.count}</strong> positions open</span>
                              <span>·</span>
                              <div className="flex items-center gap-1 text-amber-700 font-semibold">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Deadline: {opening.deadline}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="hidden sm:inline-flex text-xs font-bold text-[#08C58A] bg-[#E3F4EB] px-3 py-1 rounded-full border border-[#08C58A]/30">
                            {opening.count} open
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-[#777A72]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#777A72]" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Section: Requirements & Responsibilities */}
                      {isExpanded && (
                        <div className="px-6 sm:px-7 pb-7 border-t border-[#E7E8E1] pt-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Requirements */}
                            <div className="p-5 rounded-2xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-3">
                              <h3 className="text-xs font-black text-[#171916] uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#08C58A]" />
                                Candidate Requirements
                              </h3>
                              <ul className="space-y-2">
                                {opening.requirements.map((req) => (
                                  <li key={req} className="flex items-start gap-2 text-xs text-[#777A72]">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#08C58A] shrink-0 mt-0.5" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Responsibilities */}
                            <div className="p-5 rounded-2xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-3">
                              <h3 className="text-xs font-black text-[#171916] uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#171916]" />
                                Key Responsibilities
                              </h3>
                              <ul className="space-y-2">
                                {opening.responsibilities.map((resp) => (
                                  <li key={resp} className="flex items-start gap-2 text-xs text-[#777A72]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#171916] shrink-0 mt-1.5" />
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Application Action / Form */}
                          {!isApplying ? (
                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <span className="text-xs text-[#777A72]">
                                Applying as a student member of {club.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => setApplyingTo(opening.id)}
                                className="px-6 py-3 rounded-2xl bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                              >
                                <span>Apply for this Position</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault()
                                handleSubmit(opening)
                              }}
                              className="p-6 rounded-3xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-4"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-black text-base text-[#171916]">
                                  Submit Application: {opening.role}
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => setApplyingTo(null)}
                                  className="text-xs text-[#777A72] hover:text-[#171916] font-semibold cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-[#171916] mb-1.5">
                                    Full Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    placeholder="Your full name"
                                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 ${
                                      errors.name ? 'border-red-400' : 'border-[#E7E8E1]'
                                    }`}
                                  />
                                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-[#171916] mb-1.5">
                                    Email Address *
                                  </label>
                                  <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    placeholder="student@college.edu"
                                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 ${
                                      errors.email ? 'border-red-400' : 'border-[#E7E8E1]'
                                    }`}
                                  />
                                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-[#171916] mb-1.5">
                                    Phone Number <span className="font-normal text-[#777A72]">(optional)</span>
                                  </label>
                                  <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                    placeholder="+91 98765 43210"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E8E1] bg-white text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-[#171916] mb-1.5">
                                    Portfolio / Work Link <span className="font-normal text-[#777A72]">(optional)</span>
                                  </label>
                                  <input
                                    type="url"
                                    value={form.portfolio}
                                    onChange={(e) => setForm((p) => ({ ...p, portfolio: e.target.value }))}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E8E1] bg-white text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-[#171916] mb-1.5">
                                  Why do you want to join? (Statement of Purpose) *
                                </label>
                                <textarea
                                  value={form.statement}
                                  onChange={(e) => setForm((p) => ({ ...p, statement: e.target.value }))}
                                  placeholder="Describe your background, motivation, and how you will contribute to the club…"
                                  rows={4}
                                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 resize-none ${
                                    errors.statement ? 'border-red-400' : 'border-[#E7E8E1]'
                                  }`}
                                />
                                {errors.statement && <p className="text-xs text-red-500 mt-1">{errors.statement}</p>}
                              </div>

                              <div className="pt-2 flex flex-wrap gap-3">
                                <button
                                  type="submit"
                                  className="px-6 py-2.5 rounded-xl bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] text-sm font-bold transition-colors cursor-pointer"
                                >
                                  Submit Application
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setApplyingTo(null)}
                                  className="px-5 py-2.5 rounded-xl bg-white border border-[#E7E8E1] text-xs font-semibold text-[#777A72] hover:text-[#171916] cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CHECK APPLICATION STATUS */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-black text-xl text-[#171916] flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#08C58A]" />
                    Applications for {club.name}
                  </h2>
                  <p className="text-xs text-[#777A72] mt-0.5">
                    Live status tracking for student recruitment applications submitted to this club
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(encodeRoute({ page: 'applications' }))}
                  className="px-4 py-2 rounded-xl bg-[#171916] text-white text-xs font-bold hover:bg-[#242723] cursor-pointer"
                >
                  View All College Applications →
                </button>
              </div>

              {userApplications.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#777A72] space-y-2">
                  <p>No applications logged for {club.name} yet.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('openings')}
                    className="text-[#08C58A] font-bold hover:underline"
                  >
                    View Open Positions and Apply
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {userApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#08C58A]">{app.id}</span>
                          <h3 className="font-black text-[#171916] text-base">{app.targetTitle}</h3>
                          <p className="text-xs text-[#777A72]">
                            Applicant: <strong>{app.applicantName}</strong> ({app.applicantEmail})
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E3F4EB] text-[#123D30] border border-[#08C58A]/30 w-fit">
                          {app.status}
                        </span>
                      </div>

                      {app.notes && (
                        <div className="p-3 rounded-xl bg-white border border-[#E7E8E1] text-xs text-[#777A72]">
                          <strong className="text-[#171916]">Status Note:</strong> {app.notes}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-[#777A72] pt-1">
                        <span>Submitted on: {app.appliedDate}</span>
                        <span className="font-semibold text-[#08C58A]">In Review by Core Committee</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
