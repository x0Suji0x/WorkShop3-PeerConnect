import { CheckCircle2, Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '../../app/routes'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { MarketplaceTabs } from '../../components/marketplace/MarketplaceTabs'
import { DemoNotice } from '../../components/common/DemoNotice'
import { DEMO_COPY } from '../../config/demoCopy'

export function NewProjectPage() {
  const [submitted, setSubmitted] = useState(false)
  const [title, setTitle] = useState('')
  const [budget, setBudget] = useState('')
  const [summary, setSummary] = useState('')

  const submitProject = (event: FormEvent) => {
    event.preventDefault()
    if (title.trim() && budget.trim() && summary.trim()) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden pb-16">
        <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96 pointer-events-none" />
        <div className="peer-ambient-glow peer-glow-mint top-1/3 -right-24 h-96 w-96 pointer-events-none" />
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <MarketplaceTabs />
          <div className="peer-card-glass mt-7 p-8 text-center sm:p-12 shadow-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E3F4EB] text-[#123D30]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-2xl font-black text-[#171916]">Project draft created</h1>
            <div className="mx-auto mt-4 max-w-lg"><DemoNotice>{DEMO_COPY.session}</DemoNotice></div>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#777A72]">
              This is a frontend demo, so the draft only exists in this screen and has not been published.
            </p>
            <Link to={routes.projects} className="mt-6 inline-flex">
              <Button>Back to marketplace</Button>
            </Link>
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
                Clear outcomes, time expectations, and budget details help the right people find you.
              </p>
              <div className="mt-4"><DemoNotice>{DEMO_COPY.session}</DemoNotice></div>
              <form className="mt-7 space-y-5" onSubmit={submitProject}>
                <Input
                  label="Project title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Build a campus ambassador portal"
                  required
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Budget (₹)"
                    type="number"
                    min="0"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    placeholder="50000"
                    required
                  />
                  <label className="block space-y-1.5">
                    <span className="text-sm font-semibold text-[#171916]">Work mode</span>
                    <select className="w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-2.5 text-sm text-[#171916] outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20">
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>On-site</option>
                    </select>
                  </label>
                </div>
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-[#171916]">What needs to be done?</span>
                  <textarea
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    required
                    className="min-h-36 w-full rounded-xl border border-[#E7E8E1] bg-white px-3.5 py-3 text-sm outline-none focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20"
                    placeholder="Describe the outcome, scope, and any useful context."
                  />
                </label>
                <Button type="submit">
                  <Plus className="h-4 w-4" />
                  Create demo draft
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
