import { ArrowRight, AlertCircle, Split } from 'lucide-react'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function TheProblemSection() {
  const { scrollTo } = useSmoothScroll()

  return (
    <section
      id="problem"
      className="snap-section min-h-screen w-full relative flex flex-col justify-center py-20 lg:py-24 bg-[#090A0F] text-white overflow-hidden border-b border-white/10"
    >
      {/* Background Subtle Line Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-line-grid opacity-50 -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-[#6366F1]/10 rounded-full blur-[130px] -z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        {/* Editorial Eyebrow & Headline */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#D4FF00]">
            <Split className="w-3.5 h-3.5 text-[#D4FF00]" />
            <span>02 // THE GAP IN THE SYSTEM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.02] text-white">
            Two sides of the same{' '}
            <span className="text-[#D4FF00]">missed opportunity.</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-[#8E95A5] leading-relaxed">
            University builders need real-world portfolio impact. Businesses need agile, capable hands.
            Yet traditional recruiting channels leave both sides isolated.
          </p>
        </div>

        {/* Split-Screen Editorial Comparison Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Side A: The Student Reality */}
          <div className="rounded-2xl border border-white/10 bg-[#10131B] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-white/20 transition-all">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-mono text-[#D4FF00] uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  The Student Reality
                </span>
                <span className="text-[10px] font-mono text-[#8E95A5] uppercase">
                  DIAGNOSTIC 01
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                High technical potential, but limited industry traction.
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#8E95A5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] mt-1.5 shrink-0" />
                  <p>
                    <strong className="text-white">Theoretical coursework:</strong> Academic projects rarely give students verifiable production experience or commercial team dynamics.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#8E95A5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] mt-1.5 shrink-0" />
                  <p>
                    <strong className="text-white">Impersonal job boards:</strong> Applying to 200+ graduate listings often ends in automated rejection with zero portfolio feedback.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#8E95A5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] mt-1.5 shrink-0" />
                  <p>
                    <strong className="text-white">Fragmented peer networks:</strong> Difficult to meet capable student designers or engineers outside of immediate classroom cohorts.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-[#D4FF00]">
              &ldquo;Graduating with great grades but no shipped product experience is the new trap.&rdquo;
            </div>
          </div>

          {/* Side B: The Creator & Startup Reality */}
          <div className="rounded-2xl border border-white/10 bg-[#10131B] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-white/20 transition-all">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-mono text-[#6366F1] uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  The Creator Reality
                </span>
                <span className="text-[10px] font-mono text-[#8E95A5] uppercase">
                  DIAGNOSTIC 02
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Clear project vision, but priced out of traditional talent.
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#8E95A5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-1.5 shrink-0" />
                  <p>
                    <strong className="text-white">Prohibitive agency rates:</strong> Traditional creative agencies and consulting firms demand $150+/hour retainers out of reach for early MVPs.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#8E95A5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-1.5 shrink-0" />
                  <p>
                    <strong className="text-white">No campus pipeline:</strong> Founders don't have direct access to university talent pools or a reliable way to assess code quality.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#8E95A5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-1.5 shrink-0" />
                  <p>
                    <strong className="text-white">Short-term scoping friction:</strong> Smaller projects (2-6 weeks) don't fit full-time recruitment pipelines.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-[#A5B4FC]">
              &ldquo;Valuable product features stall because hiring senior contractors is too expensive.&rdquo;
            </div>
          </div>
        </div>

        {/* The Convergence Resolution Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#151924] border border-[#D4FF00]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] shrink-0" />
            <p className="text-xs sm:text-sm font-mono text-white">
              <strong className="text-[#D4FF00]">The Solution:</strong> PeerConnect connects students ready to build with founders ready to ship.
            </p>
          </div>
          <button
            type="button"
            onClick={() => scrollTo('#students')}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#D4FF00] hover:underline cursor-pointer shrink-0"
          >
            <span>See how students build their track record</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
