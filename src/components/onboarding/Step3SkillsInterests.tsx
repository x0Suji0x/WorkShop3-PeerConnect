import { useState } from 'react'
import { Plus, X, Search, Sparkles, Tag, Check } from 'lucide-react'
import type { OnboardingSkillsInterests, FormValidationErrors } from '../../types/onboarding'

interface Step3SkillsInterestsProps {
  data: OnboardingSkillsInterests
  errors: FormValidationErrors
  onChange: (field: keyof OnboardingSkillsInterests, value: any) => void
}

const suggestedSkills: { name: string; category: 'dev' | 'design' | 'ai' | 'other' }[] = [
  { name: 'React', category: 'dev' },
  { name: 'TypeScript', category: 'dev' },
  { name: 'Python', category: 'ai' },
  { name: 'UI/UX Design', category: 'design' },
  { name: 'Figma', category: 'design' },
  { name: 'C++', category: 'dev' },
  { name: 'AI/ML', category: 'ai' },
  { name: 'Tailwind CSS', category: 'dev' },
  { name: 'Graphic Design', category: 'design' },
  { name: 'Data Analysis', category: 'ai' },
  { name: 'Video Editing', category: 'other' },
  { name: 'Digital Marketing', category: 'other' },
  { name: 'Content Writing', category: 'other' },
  { name: 'Java', category: 'dev' },
  { name: 'Event Management', category: 'other' },
  { name: 'Next.js', category: 'dev' },
  { name: 'Deep Learning', category: 'ai' },
  { name: 'Communication', category: 'other' },
]

const interestCategories = [
  'Artificial Intelligence & Machine Learning',
  'Full-Stack Web Development',
  'Mobile App Development',
  'UI/UX & Product Design',
  'Open Source Software',
  'Startup Building & Venture Design',
  'Hackathons & Coding Competitions',
  'Blockchain & Web3',
  'Robotics & Hardware Systems',
  'Cybersecurity & Ethical Hacking',
  'Creative Writing & Media',
  'Brand Design & Motion',
]

export function Step3SkillsInterests({ data, errors, onChange }: Step3SkillsInterestsProps) {
  const [skillInput, setSkillInput] = useState('')
  const [searchFilter, setSearchFilter] = useState('')

  const handleAddCustomSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const clean = skillInput.trim().replace(/,$/, '')
      if (clean && !data.skills.some((s) => s.name.toLowerCase() === clean.toLowerCase())) {
        onChange('skills', [...data.skills, { name: clean, category: 'other' }])
      }
      setSkillInput('')
    }
  }

  const toggleSuggestedSkill = (item: { name: string; category: 'dev' | 'design' | 'ai' | 'other' }) => {
    if (data.skills.some((s) => s.name.toLowerCase() === item.name.toLowerCase())) {
      onChange(
        'skills',
        data.skills.filter((s) => s.name.toLowerCase() !== item.name.toLowerCase()),
      )
    } else {
      onChange('skills', [...data.skills, item])
    }
  }

  const removeSkill = (skillName: string) => {
    onChange(
      'skills',
      data.skills.filter((s) => s.name !== skillName),
    )
  }

  const toggleInterest = (interest: string) => {
    if (data.interests.includes(interest)) {
      onChange(
        'interests',
        data.interests.filter((i) => i !== interest),
      )
    } else {
      onChange('interests', [...data.interests, interest])
    }
  }

  const filteredSuggested = suggestedSkills.filter((s) =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase().trim()),
  )

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#08A876]">
          Step 3 of 6 · Skills & Interests
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#171916]">
          Showcase your skills and what excites you.
        </h2>
        <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
          Our recommendation engine uses these to match you with hackathon squads and project briefs.
        </p>
      </div>

      {/* Selected Skills Section */}
      <div className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-[#08C58A]" />
            <h3 className="text-sm font-bold text-[#171916]">
              Your Selected Skills ({data.skills.length})
            </h3>
          </div>
          <span className="text-xs text-[#777A72]">Select at least 2</span>
        </div>

        {/* Selected skills pill container */}
        <div className="flex flex-wrap items-center gap-1.5 min-h-[44px] rounded-xl border border-[#E7E8E1] bg-[#FAF8F5] p-2.5">
          {data.skills.length > 0 ? (
            data.skills.map((skill) => (
              <span
                key={skill.name}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#E7E8E1] px-2.5 py-1 text-xs font-bold text-[#171916] shadow-2xs"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => removeSkill(skill.name)}
                  className="text-[#777A72] hover:text-red-600"
                  aria-label={`Remove ${skill.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-[#777A72] italic">
              No skills selected yet. Click from suggestions below or type custom skills.
            </span>
          )}
        </div>
        {errors.skills && <p className="text-xs text-red-600 font-medium">{errors.skills}</p>}

        {/* Custom skill input */}
        <div>
          <label htmlFor="custom-skill" className="block text-xs font-semibold text-[#171916]">
            Type a skill and press Enter:
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="custom-skill"
              type="text"
              placeholder="e.g. Kotlin, Solvers, Blender, Rust..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddCustomSkill}
              className="flex-1 rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
            />
            <button
              type="button"
              onClick={() => {
                const clean = skillInput.trim().replace(/,$/, '')
                if (clean && !data.skills.some((s) => s.name.toLowerCase() === clean.toLowerCase())) {
                  onChange('skills', [...data.skills, { name: clean, category: 'other' }])
                  setSkillInput('')
                }
              }}
              disabled={!skillInput.trim()}
              className="inline-flex items-center gap-1 rounded-xl bg-[#171916] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#2A2E28] disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        </div>

        {/* Suggested skills quick chips */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-[#525A55]">Popular Student Skills:</span>
            <div className="relative w-44">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#777A72]" />
              <input
                type="text"
                placeholder="Filter suggestions..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full rounded-lg border border-[#E7E8E1] py-1 pl-7 pr-2 text-[11px] text-[#171916] outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredSuggested.map((item) => {
              const isSelected = data.skills.some(
                (s) => s.name.toLowerCase() === item.name.toLowerCase(),
              )
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => toggleSuggestedSkill(item)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#123D30] text-[#08C58A] font-bold shadow-xs'
                      : 'bg-[#F7F6F0] text-[#525A55] border border-[#E7E8E1] hover:border-[#171916]'
                  }`}
                >
                  {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 text-[#777A72]" />}
                  {item.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Areas of Interest Section */}
      <div className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#08C58A]" />
            <h3 className="text-sm font-bold text-[#171916]">
              Areas of Interest ({data.interests.length})
            </h3>
          </div>
          <span className="text-xs text-[#777A72]">Select at least 1</span>
        </div>
        <p className="text-xs text-[#525A55]">
          Which domains or industries are you passionate about collaborating in?
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2">
          {interestCategories.map((interest) => {
            const isSelected = data.interests.includes(interest)
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-[#08C58A] bg-[#E3F4EB]/30 ring-1 ring-[#08C58A]'
                    : 'border-[#E7E8E1] hover:border-[#CBD5E1]'
                }`}
              >
                <span className="text-xs font-semibold text-[#171916]">{interest}</span>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    isSelected
                      ? 'bg-[#08C58A] text-white'
                      : 'border border-[#CBD5E1] bg-white text-transparent'
                  }`}
                >
                  ✓
                </span>
              </button>
            )
          })}
        </div>
        {errors.interests && (
          <p className="mt-1 text-xs text-red-600 font-medium">{errors.interests}</p>
        )}
      </div>
    </div>
  )
}
