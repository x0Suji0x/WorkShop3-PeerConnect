import { ArrowRight, CheckCircle2, FileCode, Search, MessageSquare, Rocket } from 'lucide-react'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

const PROCESS_STEPS = [
  {
    num: '01',
    icon: FileCode,
    title: 'Profile or Brief',
    tag: 'STEP 01 // PUBLISH',
    desc: 'Students publish verified tech stacks and GitHub repositories. Creators outline scope, deliverables, and milestone compensation.',
  },
  {
    num: '02',
    icon: Search,
    title: 'Direct Discovery',
    tag: 'STEP 02 // MATCH',
    desc: 'Filter by specific engineering languages, design systems, or AI tools. Inspect live code and applicant availability.',
  },
  {
    num: '03',
    icon: MessageSquare,
    title: 'Scope Alignment',
    tag: 'STEP 03 // ALIGN',
    desc: 'Connect directly to confirm sprint cadence, milestones, and shared communication channels like Discord or GitHub.',
  },
  {
    num: '04',
    icon: Rocket,
    title: 'Ship & Validate',
    tag: 'STEP 04 // SHIP',
    desc: 'Deliver project milestones in weekly sprints, deploy the build, and establish authenticated portfolio credentials.',
  },
]

export function ProcessSequenceSection() {
  const { scrollTo } = useSmoothScroll()

  return (
    <section
      id="process"
      className="snap-section min-h-screen w-full relative flex flex-col justify-center py-20 lg:py-24 bg-[#090A0F] text-white overflow-hidden border-b border-white/10"
    >
      {/* Background Subtle Line Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-line-grid opacity-50 -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[350px] bg-[#D4FF00]/10 rounded-full blur-[150px] -z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        {/* Editorial Eyebrow & Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#D4FF00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]" />
              <span>05 // THE WORKFLOW PROTOCOL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.02] text-white">
              From brief to delivery in{' '}
              <span className="text-[#D4FF00]">four clear steps.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8E95A5] leading-relaxed">
              A structured, honest framework designed for students and project creators to collaborate with complete clarity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => scrollTo('#marketplace')}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#D4FF00] hover:underline cursor-pointer shrink-0 pb-1"
          >
            <span>See live marketplace listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* The 4-Step Connected Sequence with Oversized Step Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PROCESS_STEPS.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="group relative rounded-2xl border border-white/10 bg-[#10131B] p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-[#D4FF00]/40 transition-all duration-300"
              >
                {/* Step Top Bar: Numeral & Icon */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-white/30 group-hover:text-[#D4FF00] transition-colors">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4FF00] group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4FF00] block">
                    {step.tag}
                  </span>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#8E95A5] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-[#8E95A5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#D4FF00] transition-colors" />
                  <span>Phase {step.num} Complete</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Structured Milestone Verification Strip (no fake claims) */}
        <div className="p-5 rounded-2xl bg-[#151924] border border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#8E95A5]">
          <span className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-[#D4FF00]" />
            Direct Peer Collaboration
          </span>
          <span className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-[#D4FF00]" />
            Pre-Agreed Milestone Checkpoints
          </span>
          <span className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-[#D4FF00]" />
            Demonstrated GitHub Code
          </span>
          <span className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-4 h-4 text-[#D4FF00]" />
            Verified Portfolio Provenance
          </span>
        </div>
      </div>
    </section>
  )
}
