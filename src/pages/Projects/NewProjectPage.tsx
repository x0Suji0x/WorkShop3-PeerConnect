import { CheckCircle2, Plus, ArrowRight, Briefcase, Loader2, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '../../app/routes'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Badge } from '../../components/common/Badge'
import { MarketplaceTabs } from '../../components/marketplace/MarketplaceTabs'
import { useAuth } from '../../hooks/useAuth'

interface CreatedProjectResponse {
  id: string
  title: string
  clientName: string
  budget: number
  duration: string
  skillsRequired: string[]
  badge?: string
}

export function NewProjectPage() {
  const { user, token } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createdProject, setCreatedProject] = useState<CreatedProjectResponse | null>(null)

  // Form Fields
  const [title, setTitle] = useState('')
  const [budget, setBudget] = useState('45000')
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote')
  const [category, setCategory] = useState('Design & development')
  const [duration, setDuration] = useState('3-4 Weeks')
  const [skills, setSkills] = useState('React, TypeScript, Figma')
  const [summary, setSummary] = useState('')

  const submitProject = async (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !budget.trim() || !summary.trim()) {
      setErrorMessage('Please fill out the project title, budget, and scope summary.')
      return
    }

    if (user?.role !== 'client' || !token) {
      setErrorMessage('Sign in with an employer account to publish a project.')
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)

    const clientName =
      user?.companyName || user?.contactName || user?.fullName || 'Apex Studio & Labs'
    const skillsList = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: title.trim(),
          clientName,
          clientType: user?.role === 'client' ? 'Verified Employer' : 'Industry Partner',
          clientLocation: workMode === 'Remote' ? 'Remote' : 'Campus / Hybrid',
          budget: Number(budget) || 45000,
          budgetType: 'Milestone Escrow',
          duration,
          hoursPerWeek: '15-20 hrs/wk',
          description: summary.trim(),
          skillsRequired: skillsList,
          badge: 'New',
          category,
          workMode,
        }),
      })

      const data = (await response.json()) as {
        message?: string
        error?: string
        project?: CreatedProjectResponse
      }

      if (!response.ok || !data.project) {
        setErrorMessage(data.error || 'Failed to publish project. Please try again.')
        return
      }

      setCreatedProject(data.project)
      setSubmitted(true)
    } catch (err) {
      console.error('[NewProjectPage Error]:', err)
      setErrorMessage('Could not connect to project server. Please verify your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setBudget('45000')
    setSummary('')
    setSkills('React, TypeScript, Figma')
    setSubmitted(false)
    setCreatedProject(null)
  }

  if (submitted && createdProject) {
    return (
      <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden pb-16">
        <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96 pointer-events-none" />
        <div className="peer-ambient-glow peer-glow-mint top-1/3 -right-24 h-96 w-96 pointer-events-none" />
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <MarketplaceTabs />
          <div className="peer-card-glass mt-7 p-8 text-center sm:p-12 shadow-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E3F4EB] text-[#08A876] shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Badge variant="green" size="md">
                <Sparkles className="h-3.5 w-3.5" /> Live on Marketplace
              </Badge>
            </div>
            <h1 className="mt-3 text-2xl font-black text-[#171916] sm:text-3xl">
              Project Published Successfully!
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#777A72]">
              Your brief is now active and receiving applications from verified student talent across top campuses.
            </p>

            <div className="mx-auto mt-6 max-w-md rounded-2xl border border-[rgba(91,112,96,0.18)] bg-white/80 p-5 text-left shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-bold text-[#171916]">{createdProject.title}</h2>
                <span className="shrink-0 text-sm font-black text-[#08A876]">
                  ₹{createdProject.budget.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#777A72]">Posted by {createdProject.clientName}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {createdProject.skillsRequired.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#525A55] border border-[#E7E8E1]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={routes.projects}>
                <Button size="lg" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  View in Marketplace
                </Button>
              </Link>
              <Link to={routes.dashboard}>
                <Button variant="secondary" size="lg" className="gap-2">
                  Employer Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full px-4 py-2.5 text-xs font-bold text-[#525A55] hover:text-[#171916] hover:bg-black/5 transition"
              >
                Post another project
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden pb-16">
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="sr-only">Post a project</h1>
        <MarketplaceTabs />
        <div className="mt-7 grid gap-6 lg:grid-cols-12">
          <main className="lg:col-span-8">
            <div className="peer-card-glass p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">
                  For project owners & employers
                </p>
                {user?.companyName && (
                  <Badge variant="neutral" size="sm">
                    {user.companyName}
                  </Badge>
                )}
              </div>
              <h2 className="mt-2 text-2xl font-black text-[#171916]">
                Describe a project students can say yes to.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#777A72]">
                Clear outcomes, realistic milestones, and competitive stipends attract verified creators and engineers.
              </p>

              {errorMessage && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs font-semibold text-red-700">
                  {errorMessage}
                </div>
              )}

              <form className="mt-7 space-y-5" onSubmit={submitProject}>
                <Input
                  label="Project title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Build an Interactive 3D Web Landing Experience"
                  required
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Stipend / Budget (₹)"
                    type="number"
                    min="1000"
                    step="500"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    placeholder="45000"
                    required
                  />
                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold text-[#171916]">Work mode</span>
                    <select
                      value={workMode}
                      onChange={(e) => setWorkMode(e.target.value as 'Remote' | 'Hybrid' | 'On-site')}
                      className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-sm text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid (Campus / City)</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold text-[#171916]">Category</span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-sm text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                    >
                      <option value="Design & development">Design & development</option>
                      <option value="Development">Full-Stack Development</option>
                      <option value="Creative">Creative & Motion Design</option>
                      <option value="Content & media">Content & Media Strategy</option>
                      <option value="AI & Data">AI, ML & Data Pipelines</option>
                    </select>
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold text-[#171916]">Estimated duration</span>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-sm text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                    >
                      <option value="2-3 Weeks">2–3 Weeks (Sprint)</option>
                      <option value="3-4 Weeks">3–4 Weeks (Standard)</option>
                      <option value="6-8 Weeks">6–8 Weeks (Extensive)</option>
                      <option value="Ongoing">Ongoing / Retainer</option>
                    </select>
                  </label>
                </div>

                <Input
                  label="Required skills (comma-separated)"
                  value={skills}
                  onChange={(event) => setSkills(event.target.value)}
                  placeholder="e.g. React, Three.js, GSAP, Figma"
                />

                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-[#171916]">What needs to be done?</span>
                  <textarea
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    required
                    className="min-h-36 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                    placeholder="Describe the milestone deliverables, goals, and any reference material or tech stack requirements."
                  />
                </label>

                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing project...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Publish to Marketplace
                    </>
                  )}
                </Button>
              </form>
            </div>
          </main>
          <aside className="lg:col-span-4">
            <div className="peer-card-glass p-6">
              <h2 className="text-base font-black text-[#171916]">A strong brief includes</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#525A55]">
                {[
                  'The exact problem or milestone outcome you want',
                  'Realistic time commitment (e.g. 15-20 hrs/week)',
                  'A guaranteed escrow or milestone budget',
                  'The key tools and languages you expect',
                  'Fast feedback loop for student applicants',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#08C58A]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
