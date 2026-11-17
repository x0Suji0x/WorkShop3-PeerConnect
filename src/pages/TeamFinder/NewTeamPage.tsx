import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, CheckCircle2 } from 'lucide-react'
import { communityRoutes } from '../../app/routes'
import { Button } from '../../components/common/Button'
import type { CollabCategory, CollabType, TeamRole } from '../../types/community'

export function NewTeamPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<CollabCategory>('hackathon')
  const [collabType, setCollabType] = useState<CollabType>('remote')
  const [teamSize, setTeamSize] = useState(4)
  const [deadline, setDeadline] = useState('2026-12-15')

  // Required skills chip input
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([
    'React',
    'TypeScript',
    'Python',
    'Figma',
  ])

  // Dynamic roles list
  const [roles, setRoles] = useState<Omit<TeamRole, 'id' | 'filled'>[]>([
    {
      title: 'Full-Stack Developer',
      description: 'Build backend APIs and integrate frontend UI components.',
      skills: ['React', 'Node.js', 'PostgreSQL'],
    },
    {
      title: 'UI/UX Designer',
      description: 'Design interactive mockups, design tokens, and user journeys.',
      skills: ['Figma', 'Prototyping'],
    },
  ])

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
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E3F4EB] text-[#08C58A]">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-[#171916]">
          Collaboration Post Created!
        </h1>
        <p className="mt-2 text-sm text-[#525A55] leading-relaxed">
          Your project <strong>"{title}"</strong> has been published to the student network. Peers
          can now discover your opportunity and apply to join your squad.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to={communityRoutes.teamFinder}
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
            Post Another Opportunity
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={communityRoutes.teamFinder}
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
          Recruit skilled teammates for hackathons, capstones, startups, and open-source packages.
        </p>
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
              placeholder="e.g. MedAssist AI — Clinical Note Summarizer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
            />
          </div>

          <div>
            <label htmlFor="proj-category" className="block text-xs font-bold text-[#171916]">
              Project Category *
            </label>
            <select
              id="proj-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CollabCategory)}
              className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
            >
              <option value="hackathon">Hackathon</option>
              <option value="startup">Startup Idea</option>
              <option value="college-project">College Project / Capstone</option>
              <option value="research">Research Project</option>
              <option value="open-source">Open Source</option>
              <option value="personal-project">Personal Project</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="proj-desc" className="block text-xs font-bold text-[#171916]">
            Project Description & Vision *
          </label>
          <textarea
            id="proj-desc"
            required
            rows={4}
            placeholder="Explain the problem you're tackling, what you plan to build, current progress, and what you expect from your collaborators..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
          />
        </div>

        {/* Collaboration Type, Squad Size, Deadline */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="collab-type" className="block text-xs font-bold text-[#171916]">
              Collaboration Format *
            </label>
            <select
              id="collab-type"
              value={collabType}
              onChange={(e) => setCollabType(e.target.value as CollabType)}
              className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
            >
              <option value="remote">Remote (Online)</option>
              <option value="on-campus">On Campus</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label htmlFor="team-size" className="block text-xs font-bold text-[#171916]">
              Total Squad Size *
            </label>
            <input
              id="team-size"
              type="number"
              min={2}
              max={10}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
            />
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
              className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
            />
          </div>
        </div>

        {/* Required Skills Chips */}
        <div>
          <label htmlFor="skills-input" className="block text-xs font-bold text-[#171916]">
            Overall Required Skills (Press Enter to add)
          </label>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E7E8E1] bg-white p-2.5 focus-within:border-[#08C58A] focus-within:ring-2 focus-within:ring-[#08C58A]/20">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-md bg-[#E3F4EB] px-2.5 py-1 text-xs font-semibold text-[#123D30]"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              id="skills-input"
              type="text"
              placeholder="Add skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              className="flex-1 min-w-[120px] bg-transparent text-xs text-[#171916] outline-none"
            />
          </div>
        </div>

        {/* Dynamic Roles Needed */}
        <div className="rounded-2xl border border-[#E7E8E1] bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#171916]">Roles You Need to Fill</h3>
              <p className="text-[11px] text-[#525A55]">
                Specify specific positions so candidates can apply for exact roles
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddRole}
              className="inline-flex items-center gap-1 rounded-full border border-[#E7E8E1] bg-[#F7F6F0] px-3 py-1.5 text-xs font-bold text-[#171916] hover:border-[#171916]"
            >
              <Plus className="h-3 w-3" />
              Add Position
            </button>
          </div>

          <div className="space-y-3">
            {roles.map((role, idx) => (
              <div key={idx} className="relative rounded-xl border border-[#E7E8E1] p-3.5 space-y-2 bg-[#FAF8F5]">
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Role title (e.g. AI Engineer, UI/UX Designer)"
                    value={role.title}
                    onChange={(e) => handleUpdateRole(idx, 'title', e.target.value)}
                    className="w-full rounded-lg border border-[#E7E8E1] bg-white px-3 py-1.5 text-xs font-bold text-[#171916] outline-none focus:border-[#08C58A]"
                  />
                  {roles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(idx)}
                      className="text-[#777A72] hover:text-red-600"
                      title="Remove role"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Responsibilities or key deliverable"
                  value={role.description}
                  onChange={(e) => handleUpdateRole(idx, 'description', e.target.value)}
                  className="w-full rounded-lg border border-[#E7E8E1] bg-white px-3 py-1.5 text-xs text-[#525A55] outline-none focus:border-[#08C58A]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E7E8E1] pt-4">
          <button
            type="button"
            onClick={() => navigate(communityRoutes.teamFinder)}
            className="rounded-full border border-[#E7E8E1] px-5 py-2 text-xs font-semibold text-[#525A55] hover:text-[#171916]"
          >
            Cancel
          </button>
          <Button type="submit" variant="primary" size="md">
            Publish Opportunity
          </Button>
        </div>
      </form>
    </div>
  )
}
