import { CheckCircle2, Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { projectRoute, routes } from '../../app/routes'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { MarketplaceTabs } from '../../components/marketplace/MarketplaceTabs'
import { useAuth } from '../../lib/auth/AuthProvider'
import type { AccountProject, ProjectCreateInput } from '../../repositories/projectRepository'
import { supabaseProjectRepository } from '../../repositories/supabaseProjectRepository'

const splitLines = (value: string) => value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean)

export function NewProjectPage() {
  const { profile, user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [budget, setBudget] = useState('')
  const [budgetType, setBudgetType] = useState<ProjectCreateInput['budgetType']>('Fixed-price')
  const [workMode, setWorkMode] = useState<NonNullable<ProjectCreateInput['workMode']>>('Remote')
  const [duration, setDuration] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState('')
  const [category, setCategory] = useState('')
  const [skills, setSkills] = useState('')
  const [deliverables, setDeliverables] = useState('')
  const [deadline, setDeadline] = useState('')
  const [summary, setSummary] = useState('')
  const [savedProject, setSavedProject] = useState<AccountProject | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buildProjectInput = (): ProjectCreateInput => {
    const companyName = profile?.company_name?.trim()
    return {
      title,
      description: summary,
      clientName: companyName || profile?.full_name?.trim() || 'Client',
      clientType: companyName ? 'Organization' : 'Independent client',
      clientLocation: '',
      budget: Number(budget),
      budgetType,
      duration,
      hoursPerWeek,
      skillsRequired: splitLines(skills),
      category,
      workMode,
      deadline: deadline || undefined,
      deliverables: splitLines(deliverables),
    }
  }

  const saveDraft = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      if (!user?.id) throw new Error('Sign in to save a project draft.')
      const project = await supabaseProjectRepository.create(user.id, buildProjectInput(), 'draft')
      setSavedProject(project)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this project.')
    } finally {
      setIsSaving(false)
    }
  }

  const publishProject = async () => {
    if (!savedProject) return
    setError(null)
    setIsPublishing(true)
    try {
      const published = await supabaseProjectRepository.publish(savedProject.id)
      setSavedProject(published)
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : 'Could not publish this project.')
    } finally {
      setIsPublishing(false)
    }
  }

  if (savedProject) {
    const isPublished = savedProject.status === 'published'
    return (
      <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden pb-16">
        <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96 pointer-events-none" />
        <div className="peer-ambient-glow peer-glow-mint top-1/3 -right-24 h-96 w-96 pointer-events-none" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <MarketplaceTabs />
          <div className="peer-card-glass mt-7 p-8 text-center shadow-md sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E3F4EB] text-[#123D30]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-2xl font-black text-[#171916]">
              {isPublished ? 'Project published' : 'Draft saved to your account'}
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#777A72]">
              {isPublished
                ? 'Students can now find this project in the marketplace.'
                : 'Only you can see this draft. Publish it when you are ready for students to find it.'}
            </p>
            {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {!isPublished && (
                <Button onClick={publishProject} disabled={isPublishing}>
                  {isPublishing ? 'Publishing…' : 'Publish project'}
                </Button>
              )}
              {isPublished && (
                <Button onClick={() => navigate(projectRoute(savedProject.id))}>View project</Button>
              )}
              <Link to={routes.dashboard}>
                <Button variant="secondary">Go to dashboard</Button>
              </Link>
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
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">For project owners</p>
              <h2 className="mt-2 text-2xl font-black text-[#171916]">Describe a project students can say yes to.</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#777A72]">
                Save a private draft first, then publish it when the scope is ready.
              </p>
              <form className="mt-7 space-y-5" onSubmit={saveDraft}>
                <Input
                  label="Project title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Build a campus ambassador portal"
                  maxLength={160}
                  required
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Budget (₹)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    placeholder="50000"
                    required
                  />
                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold text-[#171916]">Budget structure</span>
                    <select value={budgetType} onChange={(event) => setBudgetType(event.target.value as ProjectCreateInput['budgetType'])} className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-sm text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20">
                      <option>Fixed-price</option>
                      <option>Milestone-based</option>
                      <option>Hourly</option>
                    </select>
                  </label>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold text-[#171916]">Work mode</span>
                    <select value={workMode} onChange={(event) => setWorkMode(event.target.value as NonNullable<ProjectCreateInput['workMode']>)} className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-sm text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20">
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>On-site</option>
                    </select>
                  </label>
                  <Input label="Duration" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="e.g. 4 weeks" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Hours per week" value={hoursPerWeek} onChange={(event) => setHoursPerWeek(event.target.value)} placeholder="e.g. 10–15 hours" />
                  <Input label="Category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Design & development" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Skills (comma-separated)" value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="React, Figma, research" />
                  <Input label="Application deadline" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
                </div>
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-[#171916]">What needs to be done?</span>
                  <textarea value={summary} onChange={(event) => setSummary(event.target.value)} required maxLength={10000} className="min-h-36 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20" placeholder="Describe the outcome, scope, and any useful context." />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-[#171916]">Deliverables (one per line)</span>
                  <textarea value={deliverables} onChange={(event) => setDeliverables(event.target.value)} className="min-h-24 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20" placeholder={'e.g. Research summary\nWorking prototype'} />
                </label>
                {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
                <Button type="submit" disabled={isSaving}>
                  <Plus className="h-4 w-4" />
                  {isSaving ? 'Saving draft…' : 'Save project draft'}
                </Button>
              </form>
            </div>
          </main>
          <aside className="lg:col-span-4">
            <div className="peer-card-glass p-6">
              <h2 className="text-base font-black text-[#171916]">A strong brief includes</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#525A55]">
                {[
                  'The problem or outcome you want',
                  'Realistic time commitment',
                  'A clear budget and payment structure',
                  'The skills that matter most',
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
