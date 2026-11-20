import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
  Building2,
  DollarSign,
  Sparkles,
  Star,
  ExternalLink,
  X,
} from 'lucide-react'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { PageHeading } from '../common/PageHeading'
import { DemoNotice } from '../common/DemoNotice'
import { DEMO_COPY } from '../../config/demoCopy'
import { projectRoute } from '../../app/routes'
import type { AccountProject, ProjectCreateInput } from '../../repositories/projectRepository'
import { supabaseProjectRepository } from '../../repositories/supabaseProjectRepository'
import { useAuth } from '../../lib/auth/AuthProvider'
import {
  getStoredApplications,
  updateApplicationStatus,
  type ExtendedApplication,
} from '../../lib/applicationStorage'

interface ApplicantItem {
  id: string
  name: string
  college: string
  role: string
  avatar: string
  projectApplied: string
  pitch: string
  skills: string[]
  isShortlisted?: boolean
  isSample: boolean
}

const INITIAL_APPLICANTS: ApplicantItem[] = [
  {
    id: 'app-1',
    name: 'Sofia Rodriguez',
    college: 'National Institute of Design (NID)',
    role: 'UI/UX & Product Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isSample: true,
    projectApplied: 'Interactive 3D Web Landing Experience',
    pitch: 'Proficient in Three.js, GSAP, and interactive micro-animations. Built portfolio projects for 2 client demos with high engagement.',
    skills: ['Three.js', 'GSAP', 'React', 'Figma'],
    isShortlisted: true,
  },
  {
    id: 'app-2',
    name: 'Aarav Patel',
    college: 'IIT Bombay',
    role: 'Full-Stack Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    isSample: true,
    projectApplied: 'Full-Stack Analytics Dashboard for Supply Chain Data',
    pitch: 'Built scalable dashboards with TanStack Table, React 19, and PostgreSQL. Solved real-time dispatch filters with sub-50ms query times.',
    skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    isShortlisted: false,
  },
  {
    id: 'app-3',
    name: 'Ananya Sharma',
    college: 'IIIT Hyderabad',
    role: 'AI / ML Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    isSample: true,
    projectApplied: 'Document Intelligence Pipeline & Query API',
    pitch: 'Specializing in LangChain and pgvector pipelines. Extracted tables from 500+ complex technical documents with 96% OCR accuracy.',
    skills: ['Python', 'FastAPI', 'LangChain', 'pgvector'],
    isShortlisted: true,
  },
  {
    id: 'app-4',
    name: 'Rohan Verma',
    college: 'BITS Pilani',
    role: 'Mobile / React Native Developer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    isSample: true,
    projectApplied: 'Cross-Platform Wellness Tracking Application',
    pitch: 'Shipped 2 React Native apps to Google Play Store with Supabase auth and offline SQLite caching.',
    skills: ['React Native', 'Expo', 'TypeScript', 'Supabase'],
    isShortlisted: false,
  },
]

function buildApplicantsList(stored: ExtendedApplication[]): ApplicantItem[] {
  const dynamicItems: ApplicantItem[] = stored.map((app) => ({
    id: app.id,
    name: app.studentName || 'Student Applicant',
    college: app.studentCollege || 'National Institute of Design (NID)',
    role: app.studentRole || 'Design Engineer & Frontend Architect',
    avatar:
      app.studentAvatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isSample: false,
    projectApplied: app.projectTitle || 'Web & Mobile Project',
    pitch: app.coverLetter || 'Enthusiastic to deliver this project with milestone deliverables.',
    skills: app.skills && app.skills.length > 0 ? app.skills : ['React', 'TypeScript', 'Tailwind CSS'],
    isShortlisted: app.status === 'shortlisted',
  }))

  const storedIds = new Set(dynamicItems.map((a) => a.id))
  const remainingInitial = INITIAL_APPLICANTS.filter((a) => !storedIds.has(a.id))
  return [...dynamicItems, ...remainingInitial]
}

export function ClientDashboardView() {
  const { profile, user } = useAuth()
  const clientName = profile?.full_name || 'Client'
  const companyName = profile?.company_name || 'Your company'

  const [projects, setProjects] = useState<AccountProject[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState<string | null>(null)
  const [projectsRetryKey, setProjectsRetryKey] = useState(0)
  const [applicants, setApplicants] = useState<ApplicantItem[]>(() =>
    buildApplicantsList(getStoredApplications())
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleUpdate = () => {
      setApplicants(buildApplicantsList(getStoredApplications()))
    }
    window.addEventListener('peerconnect_applications_updated', handleUpdate)
    return () => window.removeEventListener('peerconnect_applications_updated', handleUpdate)
  }, [])

  useEffect(() => {
    if (!user?.id) {
      setProjects([])
      setProjectsLoading(false)
      return
    }

    let active = true
    setProjects([])
    setProjectsLoading(true)
    supabaseProjectRepository.listMine(user.id)
      .then((rows) => {
        if (!active) return
        setProjects(rows)
        setProjectsError(null)
      })
      .catch((error: unknown) => {
        if (active) setProjectsError(error instanceof Error ? error.message : 'Could not load your projects.')
      })
      .finally(() => {
        if (active) setProjectsLoading(false)
      })

    return () => { active = false }
  }, [user?.id, projectsRetryKey])

  // New Project Form State
  const [newTitle, setNewTitle] = useState('')
  const [newBudget, setNewBudget] = useState('4500')
  const [newType, setNewType] = useState<ProjectCreateInput['budgetType']>('Milestone-based')
  const [newDuration, setNewDuration] = useState('3 Weeks')
  const [newSkills, setNewSkills] = useState('React, TypeScript, Tailwind CSS')
  const [newDescription, setNewDescription] = useState('')

  const handlePostBrief = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newBudget || !user?.id) return

    setIsPosting(true)
    try {
      const organization = profile?.company_name?.trim()
      const createdProject = await supabaseProjectRepository.create(user.id, {
        title: newTitle.trim(),
        clientName: organization || profile?.full_name?.trim() || 'Client',
        clientType: organization ? 'Organization' : 'Independent client',
        clientLocation: '',
        budget: Number(newBudget),
        budgetType: newType,
        duration: newDuration.trim(),
        hoursPerWeek: '15–20 hrs/week',
        description: newDescription.trim() || 'Project brief details to be confirmed.',
        skillsRequired: newSkills.split(',').map((skill) => skill.trim()).filter(Boolean),
        category: '',
        workMode: 'Remote',
        deliverables: [],
      }, 'published')

      setProjects((current) => [createdProject, ...current])
      setIsModalOpen(false)
      setNewTitle('')
      setNewDescription('')
      setToastMessage('Project published. Students can find it in the marketplace.')
      window.setTimeout(() => setToastMessage(null), 5000)
    } catch (error) {
      setProjectsError(error instanceof Error ? error.message : 'Could not publish this project.')
    } finally {
      setIsPosting(false)
    }
  }

  const publishDraft = async (projectId: string) => {
    try {
      const published = await supabaseProjectRepository.publish(projectId)
      setProjects((current) => current.map((project) => project.id === projectId ? published : project))
      setToastMessage('Project published. Students can find it in the marketplace.')
      window.setTimeout(() => setToastMessage(null), 5000)
    } catch (error) {
      setProjectsError(error instanceof Error ? error.message : 'Could not publish this project.')
    }
  }

  const toggleShortlist = (appId: string) => {
    const target = applicants.find((app) => app.id === appId)
    const nextState = !target?.isShortlisted

    // Update persistent application status if stored
    updateApplicationStatus(appId, nextState ? 'shortlisted' : 'submitted')

    setApplicants((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, isShortlisted: nextState } : app
      )
    )

    setToastMessage(
      nextState
        ? `Shortlisted candidate ${target?.name || ''} on this device.`
        : `Removed candidate ${target?.name || ''} from the local shortlist.`
    )
    window.setTimeout(() => setToastMessage(null), 4000)
  }

  const shortlistedCount = applicants.filter((a) => a.isShortlisted).length
  const publishedProjectCount = projects.filter((project) => project.status === 'published').length

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Ambient lighting glows identical to home page */}
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 space-y-8">
        {/* Role Switcher Pill Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 peer-divider-fade pb-4">
          <div className="flex items-center gap-2">
            <Badge variant="green" size="md" className="font-bold flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Client Workspace
            </Badge>
            <span className="text-xs text-[#777A72]">
              Signed in as <strong className="text-[#171916]">{clientName}</strong> ({companyName})
            </span>
          </div>

        </div>

        {/* Success Toast */}
        {toastMessage && (
          <div className="flex items-center justify-between rounded-2xl bg-[#E3F4EB] border border-[#08C58A]/40 p-4 text-xs font-semibold text-[#123D30]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#08A876]" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-[#123D30] hover:text-[#171916]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Page Heading */}
        <PageHeading
          eyebrow="Client & Hiring Dashboard"
          title={`Welcome back, ${clientName.split(' ')[0]}.`}
          description={`Manage project briefs for ${companyName}, review sample proposal examples, and browse student talent.`}
          actions={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1.5" /> Post Project Brief
              </Button>
              <Link to="/profiles">
                <Button size="sm" variant="secondary">
                  Explore Talent <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          }
        />
        <DemoNotice><strong>Applicant review and shortlists.</strong> {DEMO_COPY.device}</DemoNotice>

        {/* Overview Cards with signature tones */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          <div className="peer-card-glass peer-card-glow-mint p-5 hover:-translate-y-1 transition-all duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F3EA] text-[#176B4C] border border-black/5">
              <Briefcase className="h-4.5 w-4.5" />
            </div>
            <p className="mt-4 font-mono text-2xl font-black text-[#171916]">{publishedProjectCount}</p>
            <p className="mt-1 text-sm font-bold text-[#171916]">Published Projects</p>
            <p className="mt-0.5 text-xs text-[#777A72]">Visible in the marketplace</p>
          </div>

          <div className="peer-card-glass peer-card-glow-gold p-5 hover:-translate-y-1 transition-all duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FBF0DC] text-[#9A6A24] border border-black/5">
              <Users className="h-4.5 w-4.5" />
            </div>
            <p className="mt-4 font-mono text-2xl font-black text-[#171916]">{applicants.length}</p>
            <p className="mt-1 text-sm font-bold text-[#171916]">Proposal Examples</p>
            <p className="mt-0.5 text-xs text-[#777A72]">Includes sample and local entries</p>
          </div>

          <div className="peer-card-glass peer-card-glow-rose p-5 hover:-translate-y-1 transition-all duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7E9EB] text-[#9D5C6C] border border-black/5">
              <Star className="h-4.5 w-4.5" />
            </div>
            <p className="mt-4 font-mono text-2xl font-black text-[#171916]">{shortlistedCount}</p>
            <p className="mt-1 text-sm font-bold text-[#171916]">Shortlisted Examples</p>
            <p className="mt-0.5 text-xs text-[#777A72]">Sample and local-device state</p>
          </div>

          <div className="peer-card-glass peer-card-glow-mint p-5 hover:-translate-y-1 transition-all duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F3EA] text-[#08A876] border border-black/5">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
            <p className="mt-4 font-mono text-2xl font-black text-[#171916]">₹1,85,000</p>
            <p className="mt-1 text-sm font-bold text-[#171916]">Sample budgets</p>
            <p className="mt-0.5 text-xs text-[#777A72]">Example amounts only</p>
          </div>
        </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Active Project Briefs */}
        <section className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#171916]">Your Projects</h2>
              <p className="text-xs text-[#777A72]">Your project records and private drafts</p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-[#08A876] hover:underline flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> New Brief
            </button>
          </div>

          {projectsError && (
            <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <span>{projectsError}</span>
              <button type="button" className="font-bold underline" onClick={() => setProjectsRetryKey((value) => value + 1)}>Retry</button>
            </div>
          )}
          <div className="space-y-3">
            {projectsLoading ? <p className="text-sm text-[#777A72]">Loading your projects…</p> : projects.length ? projects.map((project) => (
              <div
                key={project.id}
                className="peer-card-glass p-5 sm:p-6 group hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#08A876]">{project.clientName}</span>
                      <Badge variant={project.status === 'published' ? 'green' : 'neutral'} size="sm">
                        {project.status === 'published' ? 'Published' : project.status === 'draft' ? 'Draft' : 'Closed'}
                      </Badge>
                    </div>
                    <h3 className="mt-1 text-base font-bold text-[#171916] group-hover:text-[#08A876] transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#525A55] line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.skillsRequired.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-[#F7F6F0] px-2 py-0.5 text-[11px] font-medium text-[#525A55] border border-[#E7E8E1]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start shrink-0">
                    <div className="text-right">
                      <p className="font-mono text-base font-black text-[#171916]">
                        ₹{project.budget.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#777A72]">{project.budgetType}</p>
                    </div>
                    {project.status === 'draft' ? (
                      <Button size="sm" onClick={() => publishDraft(project.id)}>Publish</Button>
                    ) : project.status === 'published' ? (
                      <Link to={projectRoute(project.id)} className="text-xs font-bold text-[#123D30] hover:text-[#08A876]">View listing</Link>
                    ) : null}
                  </div>
                </div>
              </div>
            )) : <p className="rounded-2xl border border-dashed border-[#CBD5C1] p-6 text-sm text-[#777A72]">You have no project drafts or listings yet. Create a brief to get started.</p>}
          </div>
        </section>

        {/* Right Column: Recent Applicants */}
        <section className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#171916]">Proposal Examples</h2>
              <p className="text-xs text-[#777A72]">Illustrative applicants plus this-device submissions</p>
            </div>
            <span className="text-xs font-semibold text-[#08A876] bg-[#E3F4EB] px-2.5 py-1 rounded-full">
              {shortlistedCount} shortlisted
            </span>
          </div>

          <div className="space-y-3">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="peer-card-glass p-5 space-y-3 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.avatar}
                      alt={app.name}
                      className="h-10 w-10 rounded-full object-cover border border-[#CBD5E1]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-[#171916]">{app.name}</h4>
                        <Badge variant="neutral" size="sm">{app.isSample ? 'Sample' : 'This device'}</Badge>
                      </div>
                      <p className="text-xs text-[#525A55]">{app.role}</p>
                      <p className="text-[11px] text-[#777A72]">{app.college}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleShortlist(app.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        app.isShortlisted
                          ? 'text-amber-500 bg-amber-50'
                          : 'text-[#CBD5E1] hover:text-amber-500'
                      }`}
                      title={app.isShortlisted ? 'Shortlisted' : 'Shortlist student'}
                    >
                      <Star className={`h-4 w-4 ${app.isShortlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-[#FAF8F5]/80 p-2.5 text-xs text-[#525A55] border border-[#E7E8E1] relative z-10">
                  <p className="font-semibold text-[#171916] text-[11px] mb-0.5">
                    Proposal for: {app.projectApplied}
                  </p>
                  <p className="italic">"{app.pitch}"</p>
                </div>

                <div className="flex items-center justify-between pt-1 relative z-10">
                  <div className="flex flex-wrap gap-1">
                    {app.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-[#525A55] border border-[#E7E8E1]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/profiles/${app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#123D30] hover:text-[#08A876]"
                    >
                      Portfolio <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Post Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-[#E7E8E1] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E7E8E1] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#08C58A]" />
                <h3 className="text-lg font-black text-[#171916]">Publish a Project Brief</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-[#777A72] hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePostBrief} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#171916]">Project Title</label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={160}
                  placeholder="e.g. AI-Powered Customer Support Assistant"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] py-2.5 px-3 text-xs outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#171916]">Budget (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] py-2.5 px-3 text-xs outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#171916]">Budget structure</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ProjectCreateInput['budgetType'])}
                    className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] py-2.5 px-3 text-xs outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                  >
                    <option value="Milestone-based">Milestone-based</option>
                    <option value="Fixed-price">Fixed-price</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#171916]">Expected Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] py-2.5 px-3 text-xs outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#171916]">Skills Required (comma-separated)</label>
                  <input
                    type="text"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] py-2.5 px-3 text-xs outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#171916]">Scope & Deliverables</label>
                <textarea
                  rows={3}
                  placeholder="Outline the technical requirements, expected deliverables, and timeline..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] py-2 px-3 text-xs outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                />
              </div>

              {projectsError && <p role="alert" className="text-sm font-semibold text-red-700">{projectsError}</p>}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7E8E1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-bold text-[#525A55] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" size="sm" disabled={isPosting}>
                  {isPosting ? 'Publishing…' : 'Publish Project Brief'} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
