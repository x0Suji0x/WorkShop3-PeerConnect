import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  GraduationCap,
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
import { mockProjects } from '../../data/mockData'
import type { ProjectOpportunity } from '../../types'
import {
  getStoredApplications,
  updateApplicationStatus,
  type ExtendedApplication,
} from '../../lib/applicationStorage'

interface ClientAuthData {
  name?: string
  company?: string
  email?: string
  role?: string
}

interface ClientDashboardViewProps {
  onSwitchToStudent: () => void
}

interface ApplicantItem {
  id: string
  name: string
  college: string
  role: string
  avatar: string
  matchScore: number
  projectApplied: string
  pitch: string
  skills: string[]
  isShortlisted?: boolean
}

const INITIAL_APPLICANTS: ApplicantItem[] = [
  {
    id: 'app-1',
    name: 'Sofia Rodriguez',
    college: 'National Institute of Design (NID)',
    role: 'UI/UX & Product Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    matchScore: 98,
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
    matchScore: 95,
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
    matchScore: 94,
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
    matchScore: 89,
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
    matchScore: 98,
    projectApplied: app.projectTitle || 'Web & Mobile Project',
    pitch: app.coverLetter || 'Enthusiastic to deliver this project with milestone deliverables.',
    skills: app.skills && app.skills.length > 0 ? app.skills : ['React', 'TypeScript', 'Tailwind CSS'],
    isShortlisted: app.status === 'shortlisted',
  }))

  const storedIds = new Set(dynamicItems.map((a) => a.id))
  const remainingInitial = INITIAL_APPLICANTS.filter((a) => !storedIds.has(a.id))
  return [...dynamicItems, ...remainingInitial]
}

export function ClientDashboardView({ onSwitchToStudent }: ClientDashboardViewProps) {
  // Load saved client auth
  const [clientData] = useState<ClientAuthData>(() => {
    try {
      const stored = localStorage.getItem('peerconnect_client_auth')
      return stored ? (JSON.parse(stored) as ClientAuthData) : {}
    } catch {
      return {}
    }
  })

  const clientName = clientData.name || 'Vikram Sen'
  const companyName = clientData.company || 'Apex Studio & Labs'

  const [projects, setProjects] = useState<ProjectOpportunity[]>(mockProjects)
  const [applicants, setApplicants] = useState<ApplicantItem[]>(() =>
    buildApplicantsList(getStoredApplications())
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleUpdate = () => {
      setApplicants(buildApplicantsList(getStoredApplications()))
    }
    window.addEventListener('peerconnect_applications_updated', handleUpdate)
    return () => window.removeEventListener('peerconnect_applications_updated', handleUpdate)
  }, [])

  // New Project Form State
  const [newTitle, setNewTitle] = useState('')
  const [newBudget, setNewBudgetType] = useState('4500')
  const [newType, setNewType] = useState<'Fixed-price' | 'Milestone-based'>('Milestone-based')
  const [newDuration, setNewDuration] = useState('3 Weeks')
  const [newSkills, setNewSkills] = useState('React, TypeScript, Tailwind CSS')
  const [newDescription, setNewDescription] = useState('')

  const handlePostBrief = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newBudget) return

    const createdProject: ProjectOpportunity = {
      id: `client-proj-${Date.now()}`,
      title: newTitle.trim(),
      clientName: companyName,
      clientType: 'Project owner',
      clientLocation: 'Remote Scope',
      budget: Number(newBudget) || 4000,
      budgetType: newType,
      duration: newDuration,
      hoursPerWeek: '15-20 hrs/wk',
      description: newDescription.trim() || 'Custom project brief.',
      skillsRequired: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      badge: 'New',
      applicantsCount: 0,
      postedTimeAgo: 'Just now',
    }

    setProjects([createdProject, ...projects])
    setIsModalOpen(false)
    setNewTitle('')
    setNewDescription('')
    setToastMessage('Demo brief added to this dashboard. It resets on reload; no students are notified.')
    setTimeout(() => setToastMessage(null), 5000)
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
    setTimeout(() => setToastMessage(null), 4000)
  }

  const shortlistedCount = applicants.filter((a) => a.isShortlisted).length

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

          <button
            type="button"
            onClick={onSwitchToStudent}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] bg-white px-3.5 py-1.5 text-xs font-bold text-[#123D30] shadow-2xs hover:bg-[#FAF8F5] transition-all"
          >
            <GraduationCap className="h-3.5 w-3.5 text-[#08C58A]" />
            Switch to Student View
          </button>
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
          description={`Manage your demo project briefs for ${companyName}, review sample proposals, and browse student talent.`}
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
            <p className="mt-4 font-mono text-2xl font-black text-[#171916]">{projects.length}</p>
            <p className="mt-1 text-sm font-bold text-[#171916]">Active Project Briefs</p>
            <p className="mt-0.5 text-xs text-[#777A72]">Open for student proposals</p>
          </div>

          <div className="peer-card-glass peer-card-glow-gold p-5 hover:-translate-y-1 transition-all duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FBF0DC] text-[#9A6A24] border border-black/5">
              <Users className="h-4.5 w-4.5" />
            </div>
            <p className="mt-4 font-mono text-2xl font-black text-[#171916]">{applicants.length + 14}</p>
            <p className="mt-1 text-sm font-bold text-[#171916]">Proposals Received</p>
            <p className="mt-0.5 text-xs text-[#777A72]">Across all live scopes</p>
          </div>

          <div className="peer-card-glass peer-card-glow-rose p-5 hover:-translate-y-1 transition-all duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7E9EB] text-[#9D5C6C] border border-black/5">
              <Star className="h-4.5 w-4.5" />
            </div>
            <p className="mt-4 font-mono text-2xl font-black text-[#171916]">{shortlistedCount}</p>
            <p className="mt-1 text-sm font-bold text-[#171916]">Shortlisted Candidates</p>
            <p className="mt-0.5 text-xs text-[#777A72]">Applicants to review</p>
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
              <h2 className="text-lg font-black text-[#171916]">Your Active Project Briefs</h2>
              <p className="text-xs text-[#777A72]">Student squads can apply directly to these scopes</p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-[#08A876] hover:underline flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> New Brief
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="peer-card-glass p-5 sm:p-6 group hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#08A876]">{project.clientName}</span>
                      {project.badge && (
                        <Badge variant="green" size="sm">
                          {project.badge}
                        </Badge>
                      )}
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
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#123D30] bg-[#E3F4EB] px-2.5 py-1 rounded-full">
                      <Users className="h-3 w-3" /> {project.applicantsCount || 4} proposals
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Recent Applicants */}
        <section className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#171916]">Student Proposals</h2>
              <p className="text-xs text-[#777A72]">Sample student profiles from the demo directory</p>
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
                        <ShieldCheck className="h-3.5 w-3.5 text-[#08A876]" />
                      </div>
                      <p className="text-xs text-[#525A55]">{app.role}</p>
                      <p className="text-[11px] text-[#777A72]">{app.college}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-[#E3F4EB] px-2 py-0.5 text-[10px] font-bold text-[#08A876]">
                      {app.matchScore}% Match
                    </span>
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
                <h3 className="text-lg font-black text-[#171916]">Post a New Project Brief</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-[#777A72] hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <DemoNotice>{DEMO_COPY.session} This brief is only a local preview and will not be published or notify students.</DemoNotice>
            <form onSubmit={handlePostBrief} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#171916]">Project Title</label>
                <input
                  type="text"
                  required
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
                    value={newBudget}
                    onChange={(e) => setNewBudgetType(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] py-2.5 px-3 text-xs outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#171916]">Budget structure</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'Fixed-price' | 'Milestone-based')}
                    className="mt-1.5 w-full rounded-xl border border-[#E7E8E1] py-2.5 px-3 text-xs outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                  >
                    <option value="Milestone-based">Milestone-based</option>
                    <option value="Fixed-price">Fixed-price</option>
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

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7E8E1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-bold text-[#525A55] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" size="sm">
                  Publish Project Brief <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
