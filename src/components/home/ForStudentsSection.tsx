import { useState } from 'react'
import { ArrowRight, FolderGit2, Terminal, CheckCircle2 } from 'lucide-react'
import { Button } from '../common/Button'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function ForStudentsSection() {
  const { scrollTo } = useSmoothScroll()
  const [invited, setInvited] = useState(false)

  return (
    <section
      id="students"
      className="snap-section min-h-screen w-full relative flex flex-col justify-center py-20 lg:py-24 bg-[#090A0F] text-white overflow-hidden border-b border-white/10"
    >
      {/* Background Architectural Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-line-grid opacity-50 -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-[#D4FF00]/10 rounded-full blur-[140px] -z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        {/* Editorial Top Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#D4FF00]">
            <Terminal className="w-3.5 h-3.5 text-[#D4FF00]" />
            <span>03 // FOR STUDENT BUILDERS</span>
          </div>
          <span className="text-[11px] font-mono text-[#8E95A5] uppercase tracking-wider hidden sm:block">
            PORTFOLIO-FIRST TALENT DIRECTORY
          </span>
        </div>

        {/* Section Grid: Left Copy & Value Pillars, Right Product Interface Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline & Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.02] text-white">
              Turn what you can do into{' '}
              <span className="text-[#D4FF00]">what you can achieve.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#8E95A5] leading-relaxed">
              Stop sending static PDF resumes into opaque algorithms. PeerConnect lets university builders
              showcase real code repositories, apply to active project briefs, and graduate with a verified client track record.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#10131B] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#D4FF00]" />
                  <span>Showcase Working Code</span>
                </div>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Directly link GitHub repos, live Vercel deployments, and Figma prototypes to your profile.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#10131B] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#D4FF00]" />
                  <span>Discover Scoped Briefs</span>
                </div>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Browse clear project deliverables with fixed milestone budgets designed for student schedules.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#10131B] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#D4FF00]" />
                  <span>Cross-Campus Teaming</span>
                </div>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Team up with fellow student engineers, product designers, and AI specialists on ambitious builds.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#10131B] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#D4FF00]" />
                  <span>Verified Track Record</span>
                </div>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Each completed project adds authenticated deliverables and client reviews to your portfolio.
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
                <span>Browse Student Directory</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Right Column: Realistic Student Profile & Dossier UI Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-white/15 bg-[#10131B] overflow-hidden shadow-2xl">
              {/* Terminal Chrome Header */}
              <div className="px-5 py-3.5 bg-[#151924] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-[#8E95A5]">
                  <span className="w-2 h-2 rounded-full bg-[#D4FF00]" />
                  <span>BUILDER_PROFILE // DEMO_STUDENT_01</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-[#D4FF00]/15 text-[#D4FF00] px-2.5 py-0.5 rounded-full border border-[#D4FF00]/30 font-semibold">
                  Open For Collaboration
                </span>
              </div>

              {/* Profile Body */}
              <div className="p-6 sm:p-7 space-y-6">
                {/* Header with portrait and metadata */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80"
                      alt="Marcus Chen"
                      className="w-14 h-14 rounded-2xl object-cover border border-white/20 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">Marcus Chen</h3>
                        <span className="text-[11px] font-mono text-[#D4FF00] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          CS Undergrad
                        </span>
                      </div>
                      <p className="text-xs text-[#8E95A5] mt-0.5">
                        Full-Stack &amp; Systems Engineering
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right font-mono">
                    <span className="text-sm font-bold text-white">$55/hr</span>
                    <span className="text-[10px] text-[#8E95A5] block">Est. rate</span>
                  </div>
                </div>

                {/* Demonstrated Stack */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E95A5] block">
                    DEMONSTRATED STACK &amp; CAPABILITIES
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['React 19', 'TypeScript', 'Go', 'PostgreSQL', 'Tailwind CSS'].map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured Project Demonstration */}
                <div className="p-4 rounded-xl bg-[#151924] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#D4FF00] font-bold flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5" />
                      Featured Code Repository
                    </span>
                    <span className="text-[10px] text-[#8E95A5]">Verified Repo</span>
                  </div>
                  <p className="text-xs font-bold text-white">
                    Open-source WebSocket telemetry dashboard with live metrics
                  </p>
                  <p className="text-[11px] text-[#8E95A5] leading-relaxed">
                    High-throughput pipeline processing 12k concurrent simulated metrics via Go microservices with interactive visual charts.
                  </p>
                </div>

                {/* Interactive Action Row */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="text-[11px] font-mono text-[#8E95A5] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4FF00]" />
                    <span>6 Projects Shipped · 5.0 Rating</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInvited(!invited)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      invited
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-[#D4FF00] hover:bg-[#c6ed00] text-[#090A0F]'
                    }`}
                  >
                    {invited ? '✓ Invite Sent' : 'Connect with Marcus'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
