import { useState } from 'react'
import {
  ArrowLeft, CheckCircle2, Clock, Calendar, MapPin,
  Users, ChevronDown, Sparkles, Building2,
} from 'lucide-react'
import {
  getEventById, getClubById, getCollegeById, saveStoredApplication,
  CATEGORY_COLORS, type VolunteerRoleType,
} from '../../data/collegeData'
import { DemoNotice } from '../common/DemoNotice'
import { DEMO_COPY } from '../../config/demoCopy'
import { encodeRoute } from '../../lib/collegeRouter'

interface VolunteerApplyPageProps {
  eventId: string
  roleId: string
  onNavigate: (hash: string) => void
}

type FormStatus = 'idle' | 'submitted'

interface ApplicationForm {
  name: string
  email: string
  phone: string
  college: string
  year: string
  experience: string
  motivation: string
  roleType: string
}

const VOLUNTEER_ROLE_TYPES: VolunteerRoleType[] = [
  'Photography',
  'Event Coordination',
  'Technical Support',
  'Marketing',
  'Design',
  'General Volunteering',
]

const emptyForm: ApplicationForm = {
  name: '',
  email: '',
  phone: '',
  college: '',
  year: '',
  experience: '',
  motivation: '',
  roleType: '',
}

export function VolunteerApplyPage({
  eventId,
  roleId,
  onNavigate,
}: VolunteerApplyPageProps) {
  const event = getEventById(eventId)
  const club = event ? getClubById(event.clubId) : undefined
  const college = event ? getCollegeById(event.collegeId) : undefined

  const selectedRole =
    event?.volunteerRoles.find((r) => r.id === roleId) ?? event?.volunteerRoles[0]

  const [form, setForm] = useState<ApplicationForm>({
    ...emptyForm,
    roleType: selectedRole?.title ?? 'General Volunteering',
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [submittedId, setSubmittedId] = useState<string>('')
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationForm, string>>>({})

  if (!event || !selectedRole) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4 py-20">
        <Users className="w-12 h-12 text-[#E7E8E1]" />
        <p className="font-bold text-[#171916] text-lg">Event or volunteer role not found</p>
        <button
          type="button"
          onClick={() => onNavigate(encodeRoute({ page: 'events' }))}
          className="px-5 py-2.5 rounded-full bg-[#171916] text-white text-sm font-semibold cursor-pointer"
        >
          Back to Events Directory
        </button>
      </div>
    )
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationForm, string>> = {}
    if (!form.name.trim()) newErrors.name = 'Full name is required'
    if (!form.email.trim()) newErrors.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!form.college.trim()) newErrors.college = 'Your college name is required'
    if (!form.year) newErrors.year = 'Please select your current year of study'
    if (!form.roleType) newErrors.roleType = 'Please select a volunteer role'
    if (!form.motivation.trim()) {
      newErrors.motivation = 'Please share your motivation for volunteering'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      const saved = saveStoredApplication({
        type: 'volunteer',
        targetTitle: form.roleType,
        organization: event.title,
        collegeName: college?.shortName ?? form.college,
        applicantName: form.name.trim(),
        applicantEmail: form.email.trim(),
        applicantPhone: form.phone.trim() || undefined,
        statement: form.motivation.trim(),
      })
      setSubmittedId(saved.id)
      setStatus('submitted')
    }
  }

  const colors =
    CATEGORY_COLORS[event.category as keyof typeof CATEGORY_COLORS] ??
    CATEGORY_COLORS['Technical']

  if (status === 'submitted') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl border border-[#08C58A]/50 p-8 sm:p-10 max-w-lg w-full text-center shadow-lg space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#E3F4EB] flex items-center justify-center mx-auto text-[#08C58A]">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="font-mono text-xs font-bold text-[#08C58A] bg-[#E3F4EB] px-3 py-1 rounded-full border border-[#08C58A]/30">
              {submittedId || 'APP-SAVED'}
            </span>
            <h2 className="font-black text-2xl text-[#171916] mt-3">Volunteer Application Received!</h2>
            <p className="text-sm text-[#777A72] mt-1 leading-relaxed">
              Your application for <strong className="text-[#171916]">{form.roleType}</strong> at{' '}
              <strong className="text-[#171916]">{event.title}</strong> has been logged.
            </p>
          </div>

          <div className="bg-[#F7F6F0] rounded-2xl border border-[#E7E8E1] p-4 text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#777A72]">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Status: <strong className="text-amber-700">Pending Review</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#777A72]">
              <Calendar className="w-4 h-4 text-[#08C58A] shrink-0" />
              <span>Event Date: <strong className="text-[#171916]">{event.date} at {event.time}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#777A72]">
              <MapPin className="w-4 h-4 text-[#08C58A] shrink-0" />
              <span className="truncate">Venue: <strong className="text-[#171916]">{event.location}</strong></span>
            </div>
          </div>

          <p className="text-xs text-[#777A72] leading-relaxed">
            The event coordination committee will review your profile and reach out via email
            with volunteer badge details and shift timings.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate(encodeRoute({ page: 'applications' }))}
              className="flex-1 py-3 rounded-2xl bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] text-xs font-bold cursor-pointer transition-colors"
            >
              Track Application Status →
            </button>
            <button
              type="button"
              onClick={() => onNavigate(encodeRoute({ page: 'event-detail', eventId: event.id }))}
              className="flex-1 py-3 rounded-2xl border border-[#E7E8E1] text-[#171916] text-xs font-semibold hover:bg-[#F7F6F0] cursor-pointer transition-colors"
            >
              Back to Event
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#E7E8E1] sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate(encodeRoute({ page: 'event-detail', eventId: event.id }))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F6F0] text-[#171916] text-xs font-semibold border border-[#E7E8E1] hover:bg-[#EAE8DF] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Event
          </button>
          <div className="text-right min-w-0">
            <p className="text-xs font-bold text-[#171916] truncate">{event.title}</p>
            <p className="text-[11px] text-[#777A72]">
              {club ? club.name : 'Organiser'} · {college ? college.shortName : 'Campus'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Application Form (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3F4EB] border border-[#08C58A]/30 text-[#123D30] text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
                Volunteer Application
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#171916] leading-tight mb-2">
                Apply to Volunteer
              </h1>
              <p className="text-sm text-[#777A72] leading-relaxed">
                Contribute to <strong className="text-[#171916]">{event.title}</strong> organized by{' '}
                <strong className="text-[#171916]">{club?.name}</strong> at{' '}
                <strong className="text-[#171916]">{college?.name}</strong>. Choose a role and submit your details.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs space-y-6"
            >
              {/* 1. Role Selection across all 6 roles */}
              <div>
                <label className="block text-xs font-black text-[#171916] uppercase tracking-wider mb-2">
                  Select Volunteer Role *
                </label>
                <div className="relative">
                  <select
                    value={form.roleType}
                    onChange={(e) => setForm((p) => ({ ...p, roleType: e.target.value }))}
                    className={`w-full appearance-none px-4 py-3 rounded-2xl border bg-[#F7F6F0] text-sm font-semibold text-[#171916] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 focus:border-[#08C58A] cursor-pointer ${
                      errors.roleType ? 'border-red-400' : 'border-[#E7E8E1]'
                    }`}
                  >
                    <option value="">Select a volunteer role…</option>
                    {VOLUNTEER_ROLE_TYPES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777A72] pointer-events-none" />
                </div>
                {errors.roleType && <p className="text-xs text-red-500 mt-1">{errors.roleType}</p>}

                {/* Quick Selection Buttons for Roles Open in This Event */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-[11px] font-bold text-[#777A72] self-center">
                    Roles needed in this event:
                  </span>
                  {event.volunteerRoles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, roleType: r.title }))}
                      className={`text-xs font-bold px-3 py-1 rounded-full border cursor-pointer transition-all ${
                        form.roleType === r.title
                          ? 'bg-[#08C58A] text-[#0A261D] border-[#07B27C] shadow-2xs'
                          : 'bg-[#F7F6F0] text-[#777A72] border-[#E7E8E1] hover:text-[#171916]'
                      }`}
                    >
                      {r.title} ({r.count})
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-[#E7E8E1]" />

              {/* 2. Personal Information */}
              <div className="space-y-4">
                <p className="text-xs font-black text-[#171916] uppercase tracking-wider">
                  Personal & Academic Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name *" error={errors.name}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Arjun Patel"
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#F7F6F0] text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 ${
                        errors.name ? 'border-red-400' : 'border-[#E7E8E1]'
                      }`}
                    />
                  </FormField>

                  <FormField label="Email Address *" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="student@college.edu"
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#F7F6F0] text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 ${
                        errors.email ? 'border-red-400' : 'border-[#E7E8E1]'
                      }`}
                    />
                  </FormField>

                  <FormField label="Phone Number (for Volunteer WhatsApp Group)">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E8E1] bg-[#F7F6F0] text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30"
                    />
                  </FormField>

                  <FormField label="Current College / Institution *" error={errors.college}>
                    <input
                      type="text"
                      value={form.college}
                      onChange={(e) => setForm((p) => ({ ...p, college: e.target.value }))}
                      placeholder="Name of your college"
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#F7F6F0] text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 ${
                        errors.college ? 'border-red-400' : 'border-[#E7E8E1]'
                      }`}
                    />
                  </FormField>
                </div>

                <FormField label="Year of Study *" error={errors.year}>
                  <div className="relative">
                    <select
                      value={form.year}
                      onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                      className={`w-full appearance-none px-3.5 py-2.5 rounded-xl border bg-[#F7F6F0] text-sm text-[#171916] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 cursor-pointer ${
                        errors.year ? 'border-red-400' : 'border-[#E7E8E1]'
                      }`}
                    >
                      <option value="">Select year of study…</option>
                      {['1st Year Undergrad', '2nd Year Undergrad', '3rd Year Undergrad', '4th Year Undergrad', 'Postgraduate / Master\'s', 'PhD Scholar'].map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777A72] pointer-events-none" />
                  </div>
                </FormField>
              </div>

              <hr className="border-[#E7E8E1]" />

              {/* 3. Experience & Motivation */}
              <div className="space-y-4">
                <p className="text-xs font-black text-[#171916] uppercase tracking-wider">
                  Relevant Experience & Motivation
                </p>

                <FormField label="Relevant Experience (Past Events / Skills)">
                  <textarea
                    value={form.experience}
                    onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
                    placeholder="Mention any past volunteering, organizing, photography, or technical work you have done…"
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E8E1] bg-[#F7F6F0] text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 resize-none"
                  />
                </FormField>

                <FormField label="Why do you want to volunteer for this event? *" error={errors.motivation}>
                  <textarea
                    value={form.motivation}
                    onChange={(e) => setForm((p) => ({ ...p, motivation: e.target.value }))}
                    placeholder="Tell the committee what excites you about this event and what you hope to learn or achieve…"
                    rows={4}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#F7F6F0] text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 resize-none ${
                      errors.motivation ? 'border-red-400' : 'border-[#E7E8E1]'
                    }`}
                  />
                </FormField>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-2xl bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] text-sm font-bold transition-all shadow-sm cursor-pointer"
                >
                  Submit Volunteer Application
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(encodeRoute({ page: 'event-detail', eventId: event.id }))}
                  className="px-6 py-3 rounded-2xl border border-[#E7E8E1] text-[#777A72] text-sm font-semibold hover:text-[#171916] hover:bg-[#F7F6F0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <DemoNotice>
                <strong>Demo application.</strong> {DEMO_COPY.device} This sample will not be reviewed by an event team.
              </DemoNotice>
            </form>
          </div>

          {/* Right Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Event Summary Card */}
            <div className="bg-white rounded-3xl border border-[#E7E8E1] p-6 shadow-2xs space-y-4">
              <div className="relative h-32 rounded-2xl overflow-hidden bg-[#F7F6F0]">
                <img
                  src={event.coverUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                  {event.category}
                </span>
              </div>

              <div>
                <h3 className="font-black text-sm text-[#171916] leading-snug">
                  {event.title}
                </h3>
              </div>

              {/* Renders club and college explicitly */}
              <div className="space-y-2 text-xs text-[#777A72] pt-1 border-t border-[#E7E8E1]">
                {club && (
                  <div className="flex items-center gap-2">
                    <img
                      src={club.logoUrl}
                      alt={club.name}
                      className="w-4 h-4 rounded object-cover shrink-0"
                    />
                    <span className="truncate font-semibold text-[#171916]">Club: {club.name}</span>
                  </div>
                )}
                {college && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#08C58A] shrink-0" />
                    <span className="truncate">Campus: {college.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#08C58A] shrink-0" />
                  <span>{event.date} · {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#08C58A] shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>

            {/* Selected Role Detail */}
            <div className="bg-[#F7F6F0] rounded-3xl border border-[#E7E8E1] p-6 space-y-3">
              <span className="text-[10px] font-bold text-[#777A72] uppercase tracking-wider block">
                Selected Volunteer Role
              </span>
              <p className="text-lg font-black text-[#08C58A]">
                {form.roleType || 'Choose a role'}
              </p>
              {selectedRole && (
                <>
                  <p className="text-xs text-[#777A72] leading-relaxed">
                    {selectedRole.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedRole.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#E7E8E1] text-[#171916]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Track Existing Applications CTA */}
            <div className="bg-[#171916] rounded-3xl p-6 text-white space-y-3">
              <Sparkles className="w-5 h-5 text-[#08C58A]" />
              <h3 className="font-black text-sm">Track Applications</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Check whether your volunteer applications have been reviewed and accepted.
              </p>
              <button
                type="button"
                onClick={() => onNavigate(encodeRoute({ page: 'applications' }))}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors cursor-pointer"
              >
                Open Application Status →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormField({
  label,
  children,
  error,
}: {
  label: string
  children: React.ReactNode
  error?: string
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#171916] mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
