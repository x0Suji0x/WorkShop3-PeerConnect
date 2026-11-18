import { useState } from 'react'
import {
  Code2,
  Link2,
  Globe,
  Palette,
  FolderGit2,
  Briefcase,
  FileText,
  Plus,
  Trash2,
  Award,
  Sparkles,
  ExternalLink,
  Check,
} from 'lucide-react'
import type { OnboardingPortfolioExperience, FormValidationErrors } from '../../types/onboarding'
import { Badge } from '../common/Badge'

interface Step5PortfolioExperienceProps {
  data: OnboardingPortfolioExperience
  errors: FormValidationErrors
  onChange: (field: keyof OnboardingPortfolioExperience, value: any) => void
}

const COMMON_SKILLS = [
  'React',
  'TypeScript',
  'Python',
  'UI/UX Design',
  'Figma',
  'Node.js',
  'Next.js',
  'Tailwind CSS',
  'C++',
  'Java',
  'AI/ML',
  'Data Science',
  'Video Editing',
  'Digital Marketing',
  'Content Writing',
  'Event Management',
]

export function Step5PortfolioExperience({
  data,
  errors,
  onChange,
}: Step5PortfolioExperienceProps) {
  // Experience list local state
  const [experiences, setExperiences] = useState(data.experiences || [])
  const [showAddExp, setShowAddExp] = useState(false)
  const [newExpRole, setNewExpRole] = useState('')
  const [newExpOrg, setNewExpOrg] = useState('')
  const [newExpType, setNewExpType] = useState<'internship' | 'work' | 'club' | 'volunteering'>('internship')
  const [newExpStart, setNewExpStart] = useState('')
  const [newExpEnd, setNewExpEnd] = useState('')
  const [newExpCurrent, setNewExpCurrent] = useState(false)
  const [newExpDesc, setNewExpDesc] = useState('')

  // Projects list local state
  const [projects, setProjects] = useState(data.projects || [])
  const [showAddProj, setShowAddProj] = useState(false)
  const [newProjName, setNewProjName] = useState('')
  const [newProjDesc, setNewProjDesc] = useState('')
  const [newProjSkills, setNewProjSkills] = useState('')
  const [newProjUrl, setNewProjUrl] = useState('')

  // Certifications list local state
  const [certifications, setCertifications] = useState(data.certifications || [])
  const [showAddCert, setShowAddCert] = useState(false)
  const [newCertName, setNewCertName] = useState('')
  const [newCertIssuer, setNewCertIssuer] = useState('')
  const [newCertYear, setNewCertYear] = useState('')

  // Custom skill input
  const [customSkill, setCustomSkill] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'React',
    'TypeScript',
    'UI/UX Design',
  ])

  // Experience handlers
  const handleAddExperience = () => {
    if (!newExpRole.trim() || !newExpOrg.trim()) return
    const updated = [
      ...experiences,
      {
        id: `exp-${Date.now()}`,
        role: newExpRole.trim(),
        organization: newExpOrg.trim(),
        type: newExpType,
        startDate: newExpStart.trim() || 'Recent',
        endDate: newExpCurrent ? 'Present' : newExpEnd.trim(),
        description: newExpDesc.trim() || 'Role responsibilities and achievements',
      },
    ]
    setExperiences(updated)
    onChange('experiences', updated)
    onChange('organization', newExpOrg.trim())
    onChange('role', newExpRole.trim())
    // reset
    setNewExpRole('')
    setNewExpOrg('')
    setNewExpStart('')
    setNewExpEnd('')
    setNewExpCurrent(false)
    setNewExpDesc('')
    setShowAddExp(false)
  }

  const handleRemoveExperience = (id: string) => {
    const updated = experiences.filter((e) => e.id !== id)
    setExperiences(updated)
    onChange('experiences', updated)
  }

  // Projects handlers
  const handleAddProject = () => {
    if (!newProjName.trim()) return
    const skillsArray = newProjSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const updated = [
      ...projects,
      {
        id: `proj-${Date.now()}`,
        name: newProjName.trim(),
        description: newProjDesc.trim() || 'Showcase student project',
        skills: skillsArray.length > 0 ? skillsArray : ['React', 'Web'],
        url: newProjUrl.trim() || undefined,
      },
    ]
    setProjects(updated)
    onChange('projects', updated)
    onChange('featuredProjectName', newProjName.trim())
    onChange('featuredProjectDesc', newProjDesc.trim())
    onChange('featuredProjectUrl', newProjUrl.trim())
    // reset
    setNewProjName('')
    setNewProjDesc('')
    setNewProjSkills('')
    setNewProjUrl('')
    setShowAddProj(false)
  }

  const handleRemoveProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id)
    setProjects(updated)
    onChange('projects', updated)
  }

  // Certifications handlers
  const handleAddCert = () => {
    if (!newCertName.trim() || !newCertIssuer.trim()) return
    const updated = [
      ...certifications,
      {
        id: `cert-${Date.now()}`,
        name: newCertName.trim(),
        issuer: newCertIssuer.trim(),
        issuedOn: newCertYear.trim() || '2024',
      },
    ]
    setCertifications(updated)
    onChange('certifications', updated)
    // reset
    setNewCertName('')
    setNewCertIssuer('')
    setNewCertYear('')
    setShowAddCert(false)
  }

  const handleRemoveCert = (id: string) => {
    const updated = certifications.filter((c) => c.id !== id)
    setCertifications(updated)
    onChange('certifications', updated)
  }

  // Skills handlers
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const handleAddCustomSkill = () => {
    const val = customSkill.trim()
    if (!val || selectedSkills.includes(val)) return
    setSelectedSkills([...selectedSkills, val])
    setCustomSkill('')
  }

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#08A876]">
          Step 5 of 6 · Portfolio, Experience & Achievements
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#171916]">
          Show your craft, track record and skills.
        </h2>
        <p className="mt-1 text-xs text-[#525A55] sm:text-sm">
          Add past experience, skills, certifications, and portfolio projects to boost your visibility.
        </p>
      </div>

      {/* Social & Portfolio Links */}
      <div className="rounded-3xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#171916]">Professional Profile & Portfolio Links</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* GitHub */}
          <div>
            <label htmlFor="pf-github" className="block text-xs font-bold text-[#171916]">
              GitHub Profile URL
            </label>
            <div className="relative mt-1.5">
              <Code2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <input
                id="pf-github"
                type="url"
                placeholder="https://github.com/yourhandle"
                value={data.githubUrl}
                onChange={(e) => onChange('githubUrl', e.target.value)}
                className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2 pl-10 pr-3.5 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
              />
            </div>
            {errors.githubUrl && <p className="mt-1 text-xs text-red-600">{errors.githubUrl}</p>}
          </div>

          {/* LinkedIn */}
          <div>
            <label htmlFor="pf-linkedin" className="block text-xs font-bold text-[#171916]">
              LinkedIn Profile URL
            </label>
            <div className="relative mt-1.5">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <input
                id="pf-linkedin"
                type="url"
                placeholder="https://linkedin.com/in/yourhandle"
                value={data.linkedinUrl}
                onChange={(e) => onChange('linkedinUrl', e.target.value)}
                className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2 pl-10 pr-3.5 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
              />
            </div>
            {errors.linkedinUrl && <p className="mt-1 text-xs text-red-600">{errors.linkedinUrl}</p>}
          </div>

          {/* Behance / Dribbble */}
          <div>
            <label htmlFor="pf-behance" className="block text-xs font-bold text-[#171916]">
              Behance or Design Portfolio
            </label>
            <div className="relative mt-1.5">
              <Palette className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <input
                id="pf-behance"
                type="url"
                placeholder="https://behance.net/yourhandle"
                value={data.behanceUrl}
                onChange={(e) => onChange('behanceUrl', e.target.value)}
                className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2 pl-10 pr-3.5 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
              />
            </div>
          </div>

          {/* Personal Website */}
          <div>
            <label htmlFor="pf-site" className="block text-xs font-bold text-[#171916]">
              Personal Website / Live Domain
            </label>
            <div className="relative mt-1.5">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777A72]" />
              <input
                id="pf-site"
                type="url"
                placeholder="https://yourportfolio.dev"
                value={data.portfolioUrl}
                onChange={(e) => onChange('portfolioUrl', e.target.value)}
                className="w-full rounded-xl border border-[#E7E8E1] bg-white py-2 pl-10 pr-3.5 text-xs text-[#171916] outline-none focus:border-[#08C58A]"
              />
            </div>
            {errors.portfolioUrl && <p className="mt-1 text-xs text-red-600">{errors.portfolioUrl}</p>}
          </div>
        </div>
      </div>

      {/* About statement */}
      <div className="rounded-3xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#08C58A]" />
          <h3 className="text-sm font-bold text-[#171916]">Short Bio / Professional Statement</h3>
        </div>
        <textarea
          rows={3}
          placeholder="I am an aspiring software engineer and interaction designer passionate about building user-centred technology..."
          value={data.aboutBio}
          onChange={(e) => onChange('aboutBio', e.target.value)}
          className="w-full rounded-xl border border-[#E7E8E1] bg-white p-3 text-xs text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
        />
      </div>

      {/* Experience Section */}
      <div className="rounded-3xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#08C58A]" />
            <h3 className="text-sm font-bold text-[#171916]">
              Professional Experience ({experiences.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddExp(!showAddExp)}
            className="inline-flex items-center gap-1 rounded-xl bg-[#E3F4EB] px-3 py-1.5 text-xs font-bold text-[#123D30] hover:bg-[#08C58A]/20 transition"
          >
            <Plus className="h-3.5 w-3.5 text-[#08A876]" />
            Add Experience
          </button>
        </div>

        {/* Existing experience cards */}
        {experiences.length > 0 && (
          <div className="space-y-2.5">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="flex items-start justify-between rounded-2xl border border-[#E7E8E1] bg-[#FAF8F5] p-3.5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#171916]">{exp.role}</h4>
                    <Badge variant="green" size="sm">
                      {exp.type}
                    </Badge>
                  </div>
                  <p className="text-[11px] font-semibold text-[#08A876]">{exp.organization}</p>
                  <p className="text-[10px] text-[#777A72]">
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </p>
                  {exp.description && (
                    <p className="mt-1 text-xs text-[#525A55] leading-relaxed line-clamp-2">
                      {exp.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(exp.id)}
                  className="rounded-lg p-1 text-[#777A72] hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Experience form */}
        {showAddExp && (
          <div className="rounded-2xl border border-[#08C58A]/30 bg-[#FAF8F5] p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Job / Role Title (e.g. Frontend Intern)"
                value={newExpRole}
                onChange={(e) => setNewExpRole(e.target.value)}
                className="rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs outline-none focus:border-[#08C58A]"
              />
              <input
                type="text"
                placeholder="Company / Organisation (e.g. Acme Tech, GDSC)"
                value={newExpOrg}
                onChange={(e) => setNewExpOrg(e.target.value)}
                className="rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs outline-none focus:border-[#08C58A]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(['internship', 'work', 'club', 'volunteering'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewExpType(t)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-bold capitalize transition ${
                    newExpType === t
                      ? 'border-[#08C58A] bg-[#E3F4EB] text-[#123D30]'
                      : 'border-[#E7E8E1] bg-white text-[#525A55]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Start Date (e.g. May 2024)"
                value={newExpStart}
                onChange={(e) => setNewExpStart(e.target.value)}
                className="rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs outline-none focus:border-[#08C58A]"
              />
              <input
                type="text"
                disabled={newExpCurrent}
                placeholder={newExpCurrent ? 'Present' : 'End Date (e.g. Aug 2024)'}
                value={newExpCurrent ? 'Present' : newExpEnd}
                onChange={(e) => setNewExpEnd(e.target.value)}
                className="rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs outline-none focus:border-[#08C58A]"
              />
            </div>

            <label className="flex items-center gap-1.5 text-xs text-[#525A55] cursor-pointer">
              <input
                type="checkbox"
                checked={newExpCurrent}
                onChange={(e) => setNewExpCurrent(e.target.checked)}
                className="rounded border-[#E7E8E1] text-[#08C58A]"
              />
              <span>Currently working in this role</span>
            </label>

            <textarea
              rows={2}
              placeholder="Responsibilities, stack used, and key impact..."
              value={newExpDesc}
              onChange={(e) => setNewExpDesc(e.target.value)}
              className="w-full rounded-xl border border-[#E7E8E1] bg-white p-2.5 text-xs outline-none focus:border-[#08C58A]"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddExp(false)}
                className="rounded-xl border border-[#E7E8E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#525A55]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExperience}
                className="rounded-xl bg-[#08C58A] px-3.5 py-1.5 text-xs font-bold text-[#123D30]"
              >
                Save Experience
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="rounded-3xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#08C58A]" />
            <h3 className="text-sm font-bold text-[#171916]">Skills ({selectedSkills.length})</h3>
          </div>
          <span className="text-[11px] text-[#777A72]">Select tags or type custom skill</span>
        </div>

        {/* Selected skill badges */}
        <div className="flex flex-wrap gap-2 min-h-10 rounded-2xl border border-[#E7E8E1] bg-[#FAF8F5] p-2.5">
          {selectedSkills.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-xl border border-[#08C58A]/30 bg-white px-2.5 py-1 text-xs font-bold text-[#123D30] shadow-xs"
            >
              {s}
              <button
                type="button"
                onClick={() => toggleSkill(s)}
                className="text-[#777A72] hover:text-red-600 transition"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Common skill pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {COMMON_SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill)
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`rounded-xl border px-2.5 py-1 text-xs font-medium transition ${
                  isSelected
                    ? 'border-[#08C58A] bg-[#E3F4EB] text-[#123D30] font-bold'
                    : 'border-[#E7E8E1] bg-white text-[#525A55] hover:bg-[#FAF8F5]'
                }`}
              >
                {isSelected && <Check className="inline h-3 w-3 mr-1 text-[#08A876]" />}
                {skill}
              </button>
            )
          })}
        </div>

        {/* Custom skill input */}
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="Add custom skill (e.g. Solidity, Blender, Docker)"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddCustomSkill()
              }
            }}
            className="flex-1 rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs outline-none focus:border-[#08C58A]"
          />
          <button
            type="button"
            onClick={handleAddCustomSkill}
            className="rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2 text-xs font-bold text-[#123D30] hover:bg-[#F7F6F0]"
          >
            Add
          </button>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="rounded-3xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#08C58A]" />
            <h3 className="text-sm font-bold text-[#171916]">
              Certifications & Achievements ({certifications.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddCert(!showAddCert)}
            className="inline-flex items-center gap-1 rounded-xl bg-[#E3F4EB] px-3 py-1.5 text-xs font-bold text-[#123D30] hover:bg-[#08C58A]/20 transition"
          >
            <Plus className="h-3.5 w-3.5 text-[#08A876]" />
            Add Credential
          </button>
        </div>

        {/* Existing certs list */}
        {certifications.length > 0 && (
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between rounded-2xl border border-[#E7E8E1] bg-[#FAF8F5] p-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#171916]">{cert.name}</h4>
                  <p className="text-[11px] text-[#777A72]">
                    {cert.issuer} • {cert.issuedOn}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCert(cert.id)}
                  className="rounded-lg p-1 text-[#777A72] hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add cert form */}
        {showAddCert && (
          <div className="rounded-2xl border border-[#08C58A]/30 bg-[#FAF8F5] p-4 space-y-3">
            <input
              type="text"
              placeholder="Certification / Award Name (e.g. AWS Cloud Practitioner)"
              value={newCertName}
              onChange={(e) => setNewCertName(e.target.value)}
              className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs outline-none focus:border-[#08C58A]"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Issuing Organization (e.g. Amazon Web Services, IIT Bombay)"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                className="rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs outline-none focus:border-[#08C58A]"
              />
              <input
                type="text"
                placeholder="Issue Year (e.g. 2024)"
                value={newCertYear}
                onChange={(e) => setNewCertYear(e.target.value)}
                className="rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs outline-none focus:border-[#08C58A]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddCert(false)}
                className="rounded-xl border border-[#E7E8E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#525A55]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCert}
                className="rounded-xl bg-[#08C58A] px-3.5 py-1.5 text-xs font-bold text-[#123D30]"
              >
                Save Credential
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="rounded-3xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-[#08C58A]" />
            <h3 className="text-sm font-bold text-[#171916]">
              Showcase Projects ({projects.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddProj(!showAddProj)}
            className="inline-flex items-center gap-1 rounded-xl bg-[#E3F4EB] px-3 py-1.5 text-xs font-bold text-[#123D30] hover:bg-[#08C58A]/20 transition"
          >
            <Plus className="h-3.5 w-3.5 text-[#08A876]" />
            Add Project
          </button>
        </div>

        {/* Existing projects list */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E7E8E1] bg-[#FAF8F5] p-3.5"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-[#171916]">{proj.name}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(proj.id)}
                      className="rounded-lg p-1 text-[#777A72] hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-[#525A55] line-clamp-2">{proj.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {proj.skills.map((s) => (
                      <Badge key={s} variant="neutral" size="sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#123D30] hover:text-[#08C58A]"
                  >
                    <ExternalLink className="h-3 w-3" /> View project
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add project form */}
        {showAddProj && (
          <div className="rounded-2xl border border-[#08C58A]/30 bg-[#FAF8F5] p-4 space-y-3">
            <input
              type="text"
              placeholder="Project Title (e.g. PeerConnect Campus Bus Tracker)"
              value={newProjName}
              onChange={(e) => setNewProjName(e.target.value)}
              className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs outline-none focus:border-[#08C58A]"
            />
            <textarea
              rows={2}
              placeholder="Project summary and specific problem solved..."
              value={newProjDesc}
              onChange={(e) => setNewProjDesc(e.target.value)}
              className="w-full rounded-xl border border-[#E7E8E1] bg-white p-2.5 text-xs outline-none focus:border-[#08C58A]"
            />
            <input
              type="text"
              placeholder="Skills used (comma-separated, e.g. React, TypeScript, FastAPI)"
              value={newProjSkills}
              onChange={(e) => setNewProjSkills(e.target.value)}
              className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs outline-none focus:border-[#08C58A]"
            />
            <input
              type="url"
              placeholder="Live URL or GitHub Repo (e.g. https://github.com/...)"
              value={newProjUrl}
              onChange={(e) => setNewProjUrl(e.target.value)}
              className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3 py-2 text-xs outline-none focus:border-[#08C58A]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddProj(false)}
                className="rounded-xl border border-[#E7E8E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#525A55]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddProject}
                className="rounded-xl bg-[#08C58A] px-3.5 py-1.5 text-xs font-bold text-[#123D30]"
              >
                Save Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
