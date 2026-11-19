import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowLeft,
  Briefcase,
  Compass,
  ArrowRight,
  Lightbulb,
  Info,
} from 'lucide-react'
import { communityRoutes, communityDetailRoute } from '../../app/routes'
import { suggestTeamRoles } from '../../lib/recommendationEngine'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import type { TeamBuilderSuggestion } from '../../types/community'

export function TeamBuilderPage() {
  const [description, setDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestion, setSuggestion] = useState<TeamBuilderSuggestion | null>(null)

  const examplePrompts = [
    'I want to build an AI-powered personal finance application that analyzes bank statements and provides automated budgeting advice.',
    'A cross-platform mobile health tracking app connecting patients with campus medical centers using React Native and Supabase.',
    'A decentralized blockchain voting and student governance portal for college elections using smart contracts.',
    'A competitive robotics telemetry dashboard and control interface for campus rovers using ROS and WebSockets.',
  ]

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || description.trim().length < 15) return

    setIsAnalyzing(true)
    setSuggestion(null)

    // Simulate analysis step with pleasant responsiveness
    setTimeout(() => {
      const result = suggestTeamRoles(description)
      setSuggestion(result)
      setIsAnalyzing(false)
    }, 600)
  }

  const handleSelectExample = (prompt: string) => {
    setDescription(prompt)
    setIsAnalyzing(true)
    setTimeout(() => {
      const result = suggestTeamRoles(prompt)
      setSuggestion(result)
      setIsAnalyzing(false)
    }, 500)
  }

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden pb-16">
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to={communityRoutes.teamFinder}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#08A876] transition-colors hover:text-[#06805a]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Team Finder
        </Link>

        {/* Header */}
        <div className="mt-4 peer-divider-fade pb-6">
          <div className="peer-eyebrow-pill">
            AI Project Team Builder
          </div>
          <h1 className="mt-2 text-2xl font-black text-[#171916] sm:text-3xl">
            Architect your squad from an idea.
          </h1>
          <p className="mt-1 text-xs text-[#525A55] sm:text-sm max-w-2xl">
            Describe what you want to build. Our matching engine breaks down the required roles, recommended tech stacks, and points you to the exact student communities where those specialists hang out.
          </p>

          {/* Transparent Rule-based engine banner */}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50/70 p-3 text-xs text-blue-900 border border-blue-200">
            <Info className="h-4 w-4 shrink-0 text-blue-600" />
            <span>
              <strong>Transparent Architecture:</strong> Powered by modular rule-based classification analyzing project domains, technical depth, and complementary skill requirements.
            </span>
          </div>
        </div>

        {/* Input Section */}
        <div className="mt-8">
          <form onSubmit={handleAnalyze} className="peer-card-glass p-6 sm:p-7 shadow-sm">
          <label htmlFor="idea-desc" className="block text-sm font-bold text-[#171916]">
            Describe your project idea
          </label>
          <textarea
            id="idea-desc"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. I want to build an AI-powered personal finance application that reads student bank SMS / statements, predicts monthly spending patterns, and has an interactive budgeting dashboard..."
            className="mt-2 w-full rounded-xl border border-[#E7E8E1] bg-white p-3.5 text-xs text-[#171916] outline-none transition focus:border-[#08C58A] focus:ring-2 focus:ring-[#08C58A]/20 sm:text-sm"
          />

          {/* Example Prompt Chips */}
          <div className="mt-3">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#777A72]">
              <Lightbulb className="h-3 w-3 text-amber-500" />
              Try an example idea:
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {examplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectExample(prompt)}
                  className="rounded-lg border border-[#E7E8E1] bg-[#F7F6F0] px-2.5 py-1 text-[11px] text-[#525A55] transition-colors hover:border-[#171916] hover:text-[#171916] text-left line-clamp-1 max-w-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between peer-divider-fade-t pt-4">
            <span className="text-xs text-[#777A72]">
              {description.length} characters (min 15)
            </span>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isAnalyzing || description.trim().length < 15}
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              {isAnalyzing ? 'Analyzing Scope...' : 'Generate Squad Blueprint'}
            </Button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="mt-8 rounded-2xl border border-[#E7E8E1] bg-white p-12 text-center shadow-2xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E3F4EB] text-[#08C58A] animate-pulse">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-[#171916]">
            Analyzing project domain & role requirements...
          </h3>
          <p className="mt-1 text-xs text-[#525A55]">
            Matching technologies, identifying core and complementary roles, and indexing relevant student communities.
          </p>
        </div>
      )}

      {/* Results Section */}
      {suggestion && !isAnalyzing && (
        <div className="mt-8 space-y-8 animate-fadeIn">
          {/* Suggested Roles */}
          <div className="peer-card-glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#171916]">
                  Recommended Team Roles ({suggestion.roles.length})
                </h2>
                <p className="text-xs text-[#525A55]">
                  Formulated to balance implementation velocity, design craft, and system architecture.
                </p>
              </div>
              <Badge variant="green" size="sm">
                Squad Plan Ready
              </Badge>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {suggestion.roles.map((role, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-4.5 space-y-2.5 transition-all ${
                    role.priority === 'required'
                      ? 'border-[#08C58A]/40 bg-[#E3F4EB]/30'
                      : 'border-[#E7E8E1] bg-white/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-[#123D30]" />
                      <h4 className="text-sm font-bold text-[#171916]">{role.title}</h4>
                    </div>
                    <Badge variant={role.priority === 'required' ? 'green' : 'neutral'} size="sm">
                      {role.priority}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#525A55] leading-relaxed">{role.description}</p>

                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-[#171916] uppercase tracking-wider">
                      Target Skills:
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {role.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-[#E7E8E1] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#171916]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Communities */}
          <div className="peer-card-glass p-6">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#08C58A]" />
              <h2 className="text-lg font-bold text-[#171916]">
                Where to Find These Collaborators
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#525A55]">
              These student communities contain the highest concentration of members with the required skillsets:
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {suggestion.communities.map((comm) => (
                <div
                  key={comm.id}
                  className="flex flex-col justify-between rounded-xl border border-[#E7E8E1] bg-white/80 p-4 transition-all hover:border-[#08C58A] hover:shadow-xs"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#171916]">{comm.name}</h4>
                    <p className="mt-1 text-xs text-[#525A55]">
                      Active circle for finding {comm.name.toLowerCase()} peers.
                    </p>
                  </div>
                  <Link
                    to={communityDetailRoute(comm.slug)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#08A876] hover:underline"
                  >
                    Open Community
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="rounded-2xl border border-[rgba(8,197,138,0.3)] bg-gradient-to-r from-[#123D30] via-[#0D2D24] to-[#171916] p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Ready to assemble your squad?</h3>
              <p className="text-xs text-white/80 mt-1 max-w-xl">
                Convert this AI blueprint into a live collaboration post on Team Finder.
              </p>
            </div>
            <Link
              to={communityRoutes.newTeam}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#08C58A] px-5 py-2.5 text-xs font-bold text-[#0A261D] shadow-sm hover:bg-[#07B27C] transition-all"
            >
              Post Project Now
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
