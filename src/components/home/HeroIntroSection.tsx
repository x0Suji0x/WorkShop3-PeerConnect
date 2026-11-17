import { ArrowRight, Terminal, CheckCircle } from 'lucide-react'
import { Button } from '../common/Button'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function HeroIntroSection() {
  const { scrollTo } = useSmoothScroll()

  return (
    <section
      id="intro"
      className="snap-section min-h-screen w-full relative flex flex-col justify-center py-20 lg:py-24 bg-[#090A0F] text-white overflow-hidden border-b border-white/10"
    >
      {/* Background Architectural Grid & Subtle Electric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-line-grid opacity-60 -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#D4FF00]/10 rounded-full blur-[140px] -z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        {/* Editorial Top Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-widest uppercase text-[#D4FF00]">
            <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-ping" />
            <span>01 // THE UNIVERSITY BUILDER NETWORK</span>
          </div>
          <div className="text-[11px] font-mono text-[#8E95A5] uppercase tracking-wider hidden sm:block">
            CAMPUS DISCOVERY &amp; PROJECT DISPATCH
          </div>
        </div>

        {/* Massive Editorial Headline & Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-black tracking-tight leading-[0.95] text-white">
              Talent is everywhere.{' '}
              <span className="text-[#D4FF00] block mt-1">Opportunity should be too.</span>
            </h1>
            <p className="text-base sm:text-xl text-[#8E95A5] max-w-2xl font-normal leading-relaxed">
              PeerConnect bridges the gap between university students with demonstrated technical craft
              and the startups, founders, and teams who need ambitious collaborators.
            </p>
          </div>

          {/* Dual Action Buttons */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <Button
              variant="primary"
              size="lg"
              onClick={() => scrollTo('#marketplace')}
              className="w-full justify-between group"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollTo('#students')}
              className="w-full justify-between"
            >
              <span>Find Student Talent</span>
              <Terminal className="w-4 h-4 text-[#D4FF00]" />
            </Button>
          </div>
        </div>

        {/* Integrated Product Interface Preview (Terminal & Live Dispatch Console) */}
        <div className="rounded-2xl border border-white/15 bg-[#10131B] overflow-hidden shadow-2xl">
          {/* Window Chrome */}
          <div className="px-4 py-3 bg-[#151924] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]/80 inline-block" />
              <span className="text-xs font-mono text-[#8E95A5] ml-2">peerconnect-console://live-feed</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#D4FF00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-pulse" />
              <span>LIVE MATCHING PROTOCOL</span>
            </div>
          </div>

          {/* Console Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 p-4 sm:p-6 gap-6 md:gap-0">
            {/* Student Builder Dossier Preview */}
            <div className="md:pr-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E95A5]">
                  STUDENT BUILDER
                </span>
                <span className="text-[10px] font-mono text-[#D4FF00] bg-[#D4FF00]/10 px-2 py-0.5 rounded">
                  AVAILABLE NOW
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Marcus Chen</h2>
                <p className="text-xs text-[#8E95A5]">Full-Stack &amp; Systems Developer</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['React 19', 'TypeScript', 'Go', 'PostgreSQL'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#8E95A5] line-clamp-2">
                &ldquo;Building real-time telemetry dashboards and scalable backend pipelines.&rdquo;
              </p>
            </div>

            {/* Platform Bridge */}
            <div className="md:px-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E95A5]">
                  COLLABORATION DISPATCH
                </span>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white">Direct Project Connect</span>
                    <span className="text-[#D4FF00]">Active Scope</span>
                  </div>
                  <div className="text-[11px] text-[#8E95A5] space-y-1 font-mono">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-[#D4FF00]" />
                      <span>Verified GitHub Commits</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-[#D4FF00]" />
                      <span>Milestone Checkpoints</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => scrollTo('#problem')}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#D4FF00] hover:underline cursor-pointer"
              >
                <span>Read the Campus Disconnect Brief</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Active Project Brief Preview */}
            <div className="md:pl-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E95A5]">
                  ACTIVE PROJECT BRIEF
                </span>
                <span className="text-xs font-mono font-bold text-white">$4,500</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-white">Supply Chain Analytics Dashboard</h2>
                <p className="text-xs text-[#8E95A5]">B2B Logistics Concept · 4 Weeks</p>
              </div>
              <p className="text-xs text-[#8E95A5] line-clamp-2">
                &ldquo;Build an interactive dispatch dashboard with live metrics, filters, and CSV export.&rdquo;
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8E95A5] pt-1">
                <span>3 Structured Milestones</span>
                <span className="text-white">4 Student Applicants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Baseline Metrics Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 font-mono text-xs text-[#8E95A5] border-t border-white/10">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]" />
            6 Core Builder Disciplines
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]" />
            Demonstrated GitHub &amp; Figma Portfolios
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]" />
            Direct Peer &amp; Startup Collaboration
          </span>
        </div>
      </div>
    </section>
  )
}
