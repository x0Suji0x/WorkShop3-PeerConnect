import {
  User,
  GraduationCap,
  Sparkles,
  Clock,
  Link2,
  Pencil,
} from 'lucide-react'
import type { OnboardingFormData, OnboardingStep } from '../../types/onboarding'
import { Badge } from '../common/Badge'

interface Step6ReviewSubmitProps {
  data: OnboardingFormData
  onEditStep: (step: OnboardingStep) => void
  onToggleTerms: (agreed: boolean) => void
  estimatedCompletion: number
}

export function Step6ReviewSubmit({
  data,
  onEditStep,
  onToggleTerms,
  estimatedCompletion,
}: Step6ReviewSubmitProps) {
  const selectedGoalsList = Object.entries(data.goals.lookingFor)
    .filter(([, val]) => val)
    .map(([key]) => {
      const labels: Record<string, string> = {
        paidProjects: 'Paid Projects',
        internships: 'Internships',
        hackathons: 'Hackathons',
        collaborators: 'Collaborators',
        startups: 'Startups',
        events: 'College Events',
        volunteering: 'Volunteering',
        clubs: 'Clubs',
      }
      return labels[key] || key
    })

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#08A876]">
          Step 6 of 6 · Review & Confirmation
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#171916]">
          Review your student profile.
        </h2>
        <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
          Everything look good? You can edit any section or click to jump back.
        </p>
      </div>

      {/* Profile Momentum Banner */}
      <div className="rounded-2xl border border-[#08C58A]/30 bg-gradient-to-r from-[#E3F4EB]/60 via-[#F7F6F0] to-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#123D30] text-[#08C58A] shadow-xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#171916]">Profile Readiness Score</h3>
                <Badge variant="green" size="sm">
                  {estimatedCompletion}% Complete
                </Badge>
              </div>
              <p className="text-xs text-[#525A55] mt-0.5">
                Your profile establishes your presence across student circles, hackathons, and discovery.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-36">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E7E8E1]">
              <div
                className="h-full rounded-full bg-[#08C58A] transition-all duration-500"
                style={{ width: `${estimatedCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="space-y-4">
        {/* Card 1: Basic Credentials */}
        <div className="rounded-2xl border border-[#E7E8E1] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F1EA]">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#08C58A]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171916]">
                1. Basic Identity
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#08A876] hover:underline"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          </div>

          <div className="mt-3 flex items-start gap-3.5">
            <img
              src={data.basicInfo.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={data.basicInfo.fullName}
              className="h-12 w-12 rounded-xl object-cover border border-[#E7E8E1]"
            />
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-[#171916] text-sm">{data.basicInfo.fullName || '—'}</p>
              <p className="font-medium text-[#08A876]">{data.basicInfo.headline || 'Student'}</p>
              <p className="text-[#525A55]">{data.basicInfo.email} • {data.basicInfo.phone}</p>
            </div>
          </div>
        </div>

        {/* Card 2: College Identity */}
        <div className="rounded-2xl border border-[#E7E8E1] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F1EA]">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-[#08C58A]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171916]">
                2. College Affiliation
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#08A876] hover:underline"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          </div>

          <div className="mt-3 text-xs space-y-1">
            <p className="font-bold text-[#171916]">{data.college.collegeName || '—'}</p>
            <p className="text-[#525A55]">
              {data.college.degree} — {data.college.fieldOfStudy} ({data.college.academicYear})
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[#777A72]">Graduation: Class of {data.college.graduationYear}</span>
              <span>•</span>
              <Badge
                variant={
                  data.college.isEmailVerified
                    ? 'green'
                    : data.college.idCardFileName
                    ? 'peach'
                    : 'neutral'
                }
                size="sm"
              >
                {data.college.isEmailVerified
                  ? 'Institutional Email Verified (Demo)'
                  : data.college.idCardFileName
                  ? 'ID Uploaded (Pending Review)'
                  : 'Unverified'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Card 3: Skills & Interests */}
        <div className="rounded-2xl border border-[#E7E8E1] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F1EA]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#08C58A]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171916]">
                3. Skills & Interests
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#08A876] hover:underline"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            <div>
              <span className="text-[11px] font-semibold text-[#777A72]">Skills ({data.skillsInterests.skills.length}):</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {data.skillsInterests.skills.map((s) => (
                  <span
                    key={s.name}
                    className="rounded-md bg-[#F7F6F0] border border-[#E7E8E1] px-2 py-0.5 text-[11px] font-medium text-[#171916]"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#777A72]">Interests ({data.skillsInterests.interests.length}):</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {data.skillsInterests.interests.map((i) => (
                  <span
                    key={i}
                    className="rounded-md bg-[#E3F4EB] text-[#123D30] px-2 py-0.5 text-[11px] font-medium"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Goals & Availability */}
        <div className="rounded-2xl border border-[#E7E8E1] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F1EA]">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#08C58A]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171916]">
                4. Goals & Availability
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#08A876] hover:underline"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          </div>

          <div className="mt-3 text-xs space-y-1.5">
            <div>
              <span className="text-[11px] font-semibold text-[#777A72]">Looking for:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {selectedGoalsList.map((g) => (
                  <span
                    key={g}
                    className="rounded-md bg-[#F7F6F0] px-2 py-0.5 text-[11px] font-medium text-[#171916]"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <p className="pt-1 text-[#525A55]">
              <span className="font-semibold text-[#171916]">Availability:</span> {data.goals.availability}
            </p>
          </div>
        </div>

        {/* Card 5: Portfolio links */}
        <div className="rounded-2xl border border-[#E7E8E1] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2F1EA]">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-[#08C58A]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171916]">
                5. Links & Bio
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(5)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#08A876] hover:underline"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          </div>

          <div className="mt-3 text-xs space-y-1">
            {data.portfolio.aboutBio && (
              <p className="text-[#525A55] italic">"{data.portfolio.aboutBio}"</p>
            )}
            <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-[#08A876]">
              {data.portfolio.githubUrl && <span>GitHub: {data.portfolio.githubUrl}</span>}
              {data.portfolio.linkedinUrl && <span>LinkedIn: {data.portfolio.linkedinUrl}</span>}
              {data.portfolio.portfolioUrl && <span>Portfolio: {data.portfolio.portfolioUrl}</span>}
              {!data.portfolio.githubUrl && !data.portfolio.linkedinUrl && !data.portfolio.portfolioUrl && (
                <span className="text-[#777A72] italic">Skipped for now (can be added on your profile)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Privacy Consent */}
      <div className="rounded-2xl border border-[#E7E8E1] bg-[#FAF8F5] p-4.5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.agreedToTerms}
            onChange={(e) => onToggleTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] text-[#08C58A] focus:ring-[#08C58A]"
          />
          <div className="text-xs text-[#525A55] leading-relaxed">
            <span className="font-bold text-[#171916]">
              I accept the PeerConnect Terms of Service and Privacy Policy. *
            </span>
            <p className="mt-0.5 text-[11px] text-[#777A72]">
              I confirm that my academic and skills details are accurate and acknowledge that PeerConnect keeps my phone number and verification documents private.
            </p>
          </div>
        </label>
      </div>
    </div>
  )
}
