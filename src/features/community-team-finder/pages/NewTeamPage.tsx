import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, CheckCircle2, Sparkles, Tag } from 'lucide-react'
import { Button } from '../../../components/common/Button'
import type { CollabCategory, CollabType, TeamRole } from '../types'

interface LocationState {
  prefilledTitle?: string
  prefilledDescription?: string
  prefilledSkills?: string[]
  prefilledRoles?: Omit<TeamRole, 'id' | 'filled'>[]
}

export function NewTeamPage() {
  const location = useLocation()
  const state = location.state as LocationState | null

  const [title, setTitle] = useState(() => state?.prefilledTitle || '')
  const [description, setDescription] = useState(() => state?.prefilledDescription || '')
  const [category, setCategory] = useState<CollabCategory>('hackathon')
  const [collabType, setCollabType] = useState<CollabType>('hybrid')
  const [teamSize, setTeamSize] = useState(4)
  const [deadline, setDeadline] = useState('2026-03-31')

  // Required skills chip input
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>(
    () => state?.prefilledSkills || ['React', 'TypeScript', 'Python', 'TailwindCSS'],
  )

  // Dynamic roles list
  const [roles, setRoles] = useState<Omit<TeamRole, 'id' | 'filled'>[]>(
    () =>
      state?.prefilledRoles && state.prefilledRoles.length > 0
        ? state.prefilledRoles
        : [
          {
            title: 'Frontend Developer',
            description: 'Build web dashboard components and client interaction flows.',
            skills: ['React', 'TypeScript', 'TailwindCSS'],
          },
          {
            title: 'UI/UX Designer',
            description: 'Craft high-fidelity Figma components and user journeys.',
            skills: ['Figma', 'UI/UX', 'Design Systems'],
          },
        ],
  )

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const clean = skillInput.trim().replace(/,$/, '')
      if (clean && !skills.includes(clean)) {
        setSkills([...skills, clean])
      }
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove))
  }

  const handleAddRole = () => {
    setRoles([
      ...roles,
      {
        title: '',
        description: '',
        skills: [],
      },
    ])
  }

  const handleUpdateRole = (index: number, field: string, value: any) => {
    const updated = [...roles]
    updated[index] = { ...updated[index], [field]: value }
    setRoles(updated)
  }

  const handleRemoveRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center animate-in fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E3F4EB] text-[#08C58A] shadow-md">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-[#171916]">
          Collaboration Post Live!
        </h1>
        <p className="mt-2 text-sm text-[#525A55] leading-relaxed max-w-md mx-auto">
          Your squad opening <strong>"{title}"</strong> has been broadcast across the student network.
          Peers can now review required roles and submit applications.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/team-finder"
            className="rounded-full bg-[#171916] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#2A2E28]"
          >
            Return to Team Finder
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false)
              setTitle('')
              setDescription('')
            }}
            className="rounded-full border border-[#E7E8E1] bg-white px-6 py-2.5 text-xs font-bold text-[#171916] hover:bg-[#F7F6F0]"
          >
            Post Another Project
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/team-finder"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#08A876] transition-colors hover:text-[#06805a]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Team Finder
      </Link>

      <div className="mt-4 border-b border-[#E7E8E1] pb-6">
        <h1 className="text-2xl font-black text-[#171916] sm:text-3xl">
          Create a Collaboration Post
        </h1>
        <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
          Recruit skilled student teammates for hackathons, capstones, startups, and open-source packages.
        </p>

        {state?.prefilledRoles && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#E3F4EB]/60 p-3 text-xs text-[#123D30] border border-[#08C58A]/30">
            <Sparkles className="h-4 w-4 text-[#08C58A]" />
            <span>
              Pre-filled with squad architecture from the <strong>AI Team Builder</strong>. Review and customize before publishing!
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Project Name and Category */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="proj-name" className="block text-xs font-bold text-[#171916]">
              Project Name *
            </label>
            <input
              id="proj-name"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI for Healthcare Hackathon Team — SIH 2026"
              className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
            />
          </div>

          <div>
            <label htmlFor="proj-cat" className="block text-xs font-bold text-[#171916]">
              Opportunity Category *
            </label>
            <select
              id="proj-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value as CollabCategory)}
              className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
            >
              <option value="hackathon">Hackathon</option>
              <option value="startup">Startup Idea</option>
              <option value="college-project">College Capstone</option>
              <option value="research">Research Paper</option>
              <option value="open-source">Open Source</option>
              <option value="personal-project">Personal Project</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="proj-desc" className="block text-xs font-bold text-[#171916]">
            Project Scope & Goals *
          </label>
          <textarea
            id="proj-desc"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what problem your project solves, target milestones, and what you have built so far..."
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
          />
        </div>

        {/* Format, Deadline & Squad Capacity */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="proj-format" className="block text-xs font-bold text-[#171916]">
              Collaboration Format *
            </label>
            <select
              id="proj-format"
              value={collabType}
              onChange={(e) => setCollabType(e.target.value as CollabType)}
              className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
            >
              <option value="hybrid">Hybrid (Campus + Remote)</option>
              <option value="remote">Remote Only</option>
              <option value="on-campus">On Campus Only</option>
            </select>
          </div>

          <div>
            <label htmlFor="proj-deadline" className="block text-xs font-bold text-[#171916]">
              Application Deadline *
            </label>
            <input
              id="proj-deadline"
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
            />
          </div>

          <div>
            <label htmlFor="proj-size" className="block text-xs font-bold text-[#171916]">
              Target Squad Size *
            </label>
            <input
              id="proj-size"
              type="number"
              min={2}
              max={10}
              required
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value, 10) || 4)}
              className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-1 focus:ring-[#08C58A]"
            />
          </div>
        </div>

        {/* Required Tech Stack */}
        <div>
          <label htmlFor="proj-skills" className="block text-xs font-bold text-[#171916]">
            Target Tech Stack & Skills (Press Enter or comma)
          </label>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E7E8E1] bg-white p-2.5 focus-within:border-[#08C58A] focus-within:ring-1 focus-within:ring-[#08C58A]">
            <Tag className="h-3.5 w-3.5 text-[#777A72] ml-1" />
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-md bg-[#F7F6F0] border border-[#E7E8E1] px-2 py-0.5 text-xs font-medium text-[#171916]"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-[#777A72] hover:text-rose-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              id="proj-skills"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder={skills.length === 0 ? 'e.g. React, PyTorch, Docker' : ''}
              className="flex-1 min-w-28 text-xs outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Dynamic Roles Needed Builder */}
        <div className="rounded-2xl border border-[#E7E8E1] bg-[#FAF8F5]/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#171916]">Specific Roles Needed ({roles.length})</h3>
              <p className="text-[11px] text-[#525A55]">Define specific positions so teammates can apply directly</p>
            </div>
            <button
              type="button"
              onClick={handleAddRole}
              className="inline-flex items-center gap-1 rounded-full border border-[#171916] bg-white px-3 py-1 text-xs font-bold text-[#171916] hover:bg-[#171916] hover:text-white transition-all"
            >
              <Plus className="h-3 w-3" />
              Add Another Role
            </button>
          </div>

          <div className="space-y-3">
            {roles.map((role, idx) => (
              <div key={idx} className="rounded-xl border border-[#E7E8E1] bg-white p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Role Title (e.g. Full-Stack Developer)"
                    value={role.title}
                    onChange={(e) => handleUpdateRole(idx, 'title', e.target.value)}
                    className="flex-1 rounded-lg border border-[#E7E8E1] px-3 py-1.5 text-xs font-bold text-[#171916] outline-none focus:border-[#08C58A]"
                  />
                  {roles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(idx)}
                      className="p-1 text-[#777A72] hover:text-rose-600 rounded"
                      aria-label="Remove role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <textarea
                  rows={2}
                  required
                  placeholder="Role responsibilities and expectations..."
                  value={role.description}
                  onChange={(e) => handleUpdateRole(idx, 'description', e.target.value)}
                  className="w-full rounded-lg border border-[#E7E8E1] p-2 text-xs text-[#525A55] outline-none focus:border-[#08C58A]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E8E1]">
          <Link to="/team-finder">
            <Button type="button" variant="secondary" size="md">
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="md" disabled={!title.trim() || !description.trim()}>
            Publish Collaboration Request
          </Button>
        </div>
      </form>
    </div>
  )
}
