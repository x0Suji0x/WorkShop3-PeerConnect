import { useState } from 'react'
import { ArrowRight, Briefcase } from 'lucide-react'
import { Button } from '../common/Button'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function ForCreatorsSection() {
  const { scrollTo } = useSmoothScroll()
  const [accepted, setAccepted] = useState(false)

  return (
    <section
      id="creators"
      className="snap-section min-h-screen w-full relative flex flex-col justify-center py-20 lg:py-24 bg-[#090A0F] text-white overflow-hidden border-b border-white/10"
    >
      {/* Background Architectural Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-line-grid opacity-50 -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/3 w-[500px] h-[300px] bg-[#6366F1]/12 rounded-full blur-[140px] -z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        {/* Editorial Top Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#A5B4FC]">
            <Briefcase className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>04 // FOR FOUNDERS, STARTUPS &amp; TEAMS</span>
          </div>
          <span className="text-[11px] font-mono text-[#8E95A5] uppercase tracking-wider hidden sm:block">
            MILESTONE PROJECT DISPATCH BOARD
          </span>
        </div>

        {/* Section Grid: Left Product Interface Preview, Right Copy & Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Realistic Project Dispatch Console Interface */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-2xl border border-white/15 bg-[#10131B] overflow-hidden shadow-2xl">
              {/* Terminal Chrome Header */}
              <div className="px-5 py-3.5 bg-[#151924] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-[#8E95A5]">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  <span>DISPATCH_BOARD // ACTIVE_BRIEF_P1</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-[#6366F1]/20 text-[#A5B4FC] px-2.5 py-0.5 rounded-full border border-[#6366F1]/30 font-semibold">
                  Fixed Milestone Scope
                </span>
              </div>

              {/* Brief Content Body */}
              <div className="p-6 sm:p-7 space-y-6">
                {/* Brief Title & Budget */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-[#8E95A5] uppercase tracking-wider">
                      SAMPLE CLIENT BRIEF
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      Full-Stack Analytics Dashboard
                    </h3>
                    <p className="text-xs text-[#8E95A5]">
                      B2B Logistics SaaS · 4 Weeks · 15-20 hrs/week
                    </p>
                  </div>
                  <div className="sm:text-right font-mono">
                    <span className="text-xl font-black text-[#D4FF00]">$4,500</span>
                    <span className="text-[10px] text-[#8E95A5] block">Total Budget</span>
                  </div>
                </div>

                {/* Milestone Checkpoints Strip */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E95A5] block">
                    STRUCTURED DELIVERABLE CHECKPOINTS
                  </span>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]" />
                        M1: DB Schema &amp; Telemetry Pipeline
                      </span>
                      <span className="text-[#8E95A5]">$1,500</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]" />
                        M2: Interactive UI Filters &amp; Charts
                      </span>
                      <span className="text-[#8E95A5]">$1,500</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]" />
                        M3: QA, CSV Export &amp; Production Handover
                      </span>
                      <span className="text-[#8E95A5]">$1,500</span>
                    </div>
                  </div>
                </div>

                {/* Student Applicant Snapshot */}
                <div className="p-3.5 rounded-xl bg-[#151924] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
                      alt="Applicant Marcus Chen"
                      className="w-10 h-10 rounded-xl object-cover border border-white/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Marcus Chen</span>
                        <span className="text-[10px] font-mono text-[#D4FF00] bg-white/5 px-1.5 py-0.5 rounded">
                          React 19 + Go
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8E95A5]">Applied 2h ago · 6 completed briefs</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAccepted(!accepted)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      accepted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {accepted ? '✓ Accepted' : 'Review Pitch'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Headline & Value Pillars */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.02] text-white">
              Good work deserves{' '}
              <span className="text-[#D4FF00]">the right people.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#8E95A5] leading-relaxed">
              Skip traditional $150+/hour agency markups and bureaucratic recruiter delays. PeerConnect connects
              startups, campus teams, and businesses directly with ambitious university developers and designers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#10131B] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  <span>Scoped Milestone Briefs</span>
                </div>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Post 2 to 6 week deliverables with transparent milestone goals and agreed deadlines.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#10131B] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  <span>Inspect Real Repositories</span>
                </div>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Evaluate real GitHub commits and interactive prototypes rather than buzzword resumes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#10131B] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  <span>Direct Peer Sync</span>
                </div>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Collaborate directly with student builders via Discord, Slack, or GitHub issues without middlemen.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#10131B] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  <span>Campus Innovation</span>
                </div>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Access motivated builders fluent in modern tech: React 19, PyTorch, Go, Swift, and Figma.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => scrollTo('#marketplace')}
                className="font-mono text-xs uppercase tracking-wider"
              >
                <span>Browse Project Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
