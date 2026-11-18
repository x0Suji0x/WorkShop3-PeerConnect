import {
  Briefcase,
  GraduationCap,
  Users,
  Trophy,
  Rocket,
  Calendar,
  HeartHandshake,
  Compass,
  Clock,
} from 'lucide-react'
import type { OnboardingGoalsAvailability, FormValidationErrors } from '../../types/onboarding'

interface Step4GoalsAvailabilityProps {
  data: OnboardingGoalsAvailability
  errors: FormValidationErrors
  onChange: (field: keyof OnboardingGoalsAvailability, value: any) => void
}

const goalOptions: {
  key: keyof OnboardingGoalsAvailability['lookingFor']
  label: string
  description: string
  icon: typeof Briefcase
}[] = [
  {
    key: 'paidProjects',
    label: 'Paid Client & Startup Work',
    description: 'Find paid freelance briefs and scoped milestone deliverables.',
    icon: Briefcase,
  },
  {
    key: 'internships',
    label: 'Internship Opportunities',
    description: 'Connect with emerging tech startups hiring student talent.',
    icon: GraduationCap,
  },
  {
    key: 'hackathons',
    label: 'Hackathon Teammates',
    description: 'Form winning squads for Smart India Hackathon, EthIndia, etc.',
    icon: Trophy,
  },
  {
    key: 'collaborators',
    label: 'Personal Project Collaborators',
    description: 'Pair with fellow students on passion builds and open source.',
    icon: Users,
  },
  {
    key: 'startups',
    label: 'Startup Co-founders',
    description: 'Find complementary co-builders to validate and launch ventures.',
    icon: Rocket,
  },
  {
    key: 'events',
    label: 'College Events & Tech Fests',
    description: 'Stay posted on campus summits, workshops, and challenges.',
    icon: Calendar,
  },
  {
    key: 'volunteering',
    label: 'Volunteering & Non-Profit',
    description: 'Contribute skills to community, social and education initiatives.',
    icon: HeartHandshake,
  },
  {
    key: 'clubs',
    label: 'Campus Clubs & Teams',
    description: 'Join college developer clubs, design teams, and rover squads.',
    icon: Compass,
  },
]

const availabilityOptions: {
  value: OnboardingGoalsAvailability['availability']
  label: string
  description: string
  badgeText: string
}[] = [
  {
    value: 'Available now',
    label: 'Available Immediately (15-20+ hrs/wk)',
    description: 'Ready to take on active project scopes and team commitments right away.',
    badgeText: 'Active',
  },
  {
    value: 'Limited hours',
    label: 'Part-Time / Limited Hours (5-10 hrs/wk)',
    description: 'Balancing coursework; available for lightweight tasks and reviews.',
    badgeText: 'Moderate',
  },
  {
    value: 'Available soon',
    label: 'Weekends / Available Next Month',
    description: 'Exam season or prior commitments; available for upcoming cycles.',
    badgeText: 'Upcoming',
  },
]

export function Step4GoalsAvailability({ data, errors, onChange }: Step4GoalsAvailabilityProps) {
  const toggleGoal = (key: keyof OnboardingGoalsAvailability['lookingFor']) => {
    onChange('lookingFor', {
      ...data.lookingFor,
      [key]: !data.lookingFor[key],
    })
  }

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#08A876]">
          Step 4 of 6 · Goals & Availability
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#171916]">
          What brings you to PeerConnect?
        </h2>
        <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
          Select what you're seeking so we can curate your dashboard recommendations.
        </p>
      </div>

      {/* Goals Multi-Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#171916]">
            I am looking for: (Select all that apply) *
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {goalOptions.map((goal) => {
            const Icon = goal.icon
            const isSelected = data.lookingFor[goal.key]
            return (
              <button
                key={goal.key}
                type="button"
                onClick={() => toggleGoal(goal.key)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-[#08C58A] bg-[#E3F4EB]/30 ring-1 ring-[#08C58A] shadow-xs'
                    : 'border-[#E7E8E1] bg-white hover:border-[#CBD5E1]'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isSelected ? 'bg-[#123D30] text-[#08C58A]' : 'bg-[#F7F6F0] text-[#525A55]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171916]">{goal.label}</span>
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] ${
                        isSelected
                          ? 'bg-[#08C58A] text-white'
                          : 'border border-[#CBD5E1] bg-white text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#525A55] leading-relaxed">
                    {goal.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
        {errors.lookingFor && (
          <p className="text-xs text-red-600 font-medium">{errors.lookingFor}</p>
        )}
      </div>

      {/* Availability Selection */}
      <div className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#08C58A]" />
            <h3 className="text-sm font-bold text-[#171916]">Current Working Availability *</h3>
          </div>
          <p className="mt-1 text-xs text-[#525A55]">
            Helps prospective project leads know when you can contribute.
          </p>
        </div>

        <div className="space-y-2.5">
          {availabilityOptions.map((opt) => {
            const isSelected = data.availability === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('availability', opt.value)}
                className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? 'border-[#08C58A] bg-[#E3F4EB]/30 ring-1 ring-[#08C58A]'
                    : 'border-[#E7E8E1] hover:border-[#CBD5E1]'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#171916]">{opt.label}</span>
                  <p className="mt-0.5 text-[11px] text-[#525A55]">{opt.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-[#08C58A] bg-[#08C58A]'
                        : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
