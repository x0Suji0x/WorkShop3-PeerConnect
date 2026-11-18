import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ArrowLeft,
  Briefcase,
  Compass,
  ArrowRight,
  Lightbulb,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { suggestTeamRoles } from '../engine/recommendationEngine'
import { Badge } from '../../../components/common/Badge'
import { Button } from '../../../components/common/Button'
import type { TeamBuilderSuggestion } from '../types'

export function TeamBuilderPage() {
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestion, setSuggestion] = useState<TeamBuilderSuggestion | null>(null)

  const examplePrompts = [
    'I want to build an AI-powered personal finance application that analyzes bank statements and provides automated budgeting advice.',
    'A cross-platform mobile health tracking app connecting students with campus wellness counselors using React Native and Firebase.',
    'A decentralized blockchain student governance and voting portal for university elections using smart contracts.',
    'An autonomous campus rover telemetry dashboard and perception interface for student competitions using ROS 2 and WebSockets.',
  ]

  const runAnalysis = (text: string) => {
    setIsAnalyzing(true)
    setSuggestion(null)
    setTimeout(() => {
      const result = suggestTeamRoles(text)
      setSuggestion(result)
      setIsAnalyzing(false)
    }, 400)
  }

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || description.trim().length < 15) return
    runAnalysis(description)
  }

  const handleSelectExample = (prompt: string) => {
    setDescription(prompt)
    runAnalysis(prompt)
  }

  const handleProceedToCreate = () => {
    if (!suggestion) return

    // Collect all skills from suggested roles
    const allSkills = Array.from(
      new Set(suggestion.roles.flatMap((r) => r.skills)),
    )

    // Navigate to /team-finder/new with pre-filled state
    navigate('/team-finder/new', {
      state: {
        prefilledTitle: description.slice(0, 50) + (description.length > 50 ? '...' : ''),
        prefilledDescription: description,
        prefilledSkills: allSkills,
        prefilledRoles: suggestion.roles.map((r) => ({
          title: r.title,
          description: r.description,
          skills: r.skills,
        })),
      },
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        to="/team-finder"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#08A876] transition-colors hover:text-[#06805a]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Team Finder
      </Link>

      {/* Header */}
      <div className="mt-4 border-b border-[#E7E8E1] pb-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-[#08A876]">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">
            AI Project Team Builder
          </p>
        </div>
        <h1 className="mt-2 text-2xl font-black text-[#171916] sm:text-3xl">
          Architect your squad from an idea.
        </h1>
        <p className="mt-1 text-xs text-[#525A55] sm:text-sm max-w-2xl">
          Describe what you want to build. Our matching engine decomposes your concept into required roles,
          recommends the tech stack, and points you to the exact student circles where those specialists hang out.
        </p>

        {/* Transparent Rule-based engine notice */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50/70 p-3 text-xs text-blue-900 border border-blue-200">
          <Info className="h-4 w-4 shrink-0 text-blue-600" />
          <span>
            <strong>Transparent Engine:</strong> Uses domain classification and tech stack heuristics to decompose your project scope. Modular design ready for LLM API integration.
          </span>
        </div>
      </div>

      {/* Input Section */}
      <div className="mt-8">
        <form onSubmit={handleAnalyze} className="rounded-2xl border border-[#E7E8E1] bg-white p-6 shadow-2xs">
          <label htmlFor="idea-desc" className="block text-sm font-bold text-[#171916]">
            Describe your project concept
          </label>
          <textarea
            id="idea-desc"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. I want to build an AI-powered personal finance application that analyzes bank statements and gives automated budgeting suggestions..."
            className="mt-2 w-full rounded-xl border border-[#E7E8E1] bg-white p-3.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[11px] text-[#777A72]">
              Min 15 characters • More details lead to more accurate role requirements
            </span>
            <Button
              type="submit"
              disabled={isAnalyzing || description.trim().length < 15}
              size="md"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Decomposing Architecture...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze & Suggest Roles
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Example prompts */}
        <div className="mt-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#525A55]">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <span>Or try one of these student project concepts:</span>
          </div>
          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSelectExample(prompt)}
                className="rounded-xl border border-[#E7E8E1] bg-white p-3 text-left text-xs text-[#525A55] transition-all hover:border-[#08C58A] hover:bg-[#E3F4EB]/20 hover:text-[#171916]"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {suggestion && (
        <section className="mt-10 space-y-8 animate-in fade-in duration-300">
          {/* Header & 1-click bridge */}
          <div className="rounded-2xl border border-[#08C58A]/40 bg-[#E3F4EB]/30 p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge variant="green" size="sm" className="font-bold">
                  <CheckCircle2 className="h-3 w-3" />
                  Squad Architecture Ready
                </Badge>
                <h2 className="mt-2 text-xl font-black text-[#123D30]">
                  Recommended Squad Structure ({suggestion.roles.length} Roles Identified)
                </h2>
                <p className="mt-0.5 text-xs text-[#525A55]">
                  Review the recommended roles and publish this squad to Team Finder in one click.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleProceedToCreate}
                className="shrink-0 font-bold"
              >
                Post This Project Now
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Suggested Roles Cards */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-4 w-4 text-[#08A876]" />
              <h3 className="text-base font-bold text-[#171916]">Recommended Squad Roles</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {suggestion.roles.map((role) => (
                <div
                  key={role.title}
                  className="rounded-2xl border border-[#E7E8E1] bg-white p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-[#171916]">{role.title}</h4>
                    <Badge
                      variant={role.priority === 'required' ? 'peach' : 'neutral'}
                      size="sm"
                      className="capitalize font-bold text-[10px]"
                    >
                      {role.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#525A55] leading-relaxed">{role.description}</p>
                  <div>
                    <span className="text-[11px] font-bold text-[#123D30]">Target Skills:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {role.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-[#F7F6F0] border border-[#E7E8E1] px-2 py-0.5 text-[11px] font-medium text-[#171916]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Communities */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Compass className="h-4 w-4 text-[#08A876]" />
              <h3 className="text-base font-bold text-[#171916]">
                Circles Where These Specialists Hang Out
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {suggestion.communities.map((comm) => (
                <Link
                  key={comm.id}
                  to={`/communities/${comm.slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-[#E7E8E1] bg-white p-4 shadow-2xs hover:border-[#08C58A] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{comm.logoEmoji}</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#171916] group-hover:text-[#08A876] transition-colors">
                        {comm.name}
                      </h4>
                      <p className="text-xs text-[#525A55] line-clamp-1">{comm.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#777A72] group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

