import { useState, useRef } from 'react'
import {
  Users,
  Compass,
  Rocket,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { gsap, useGSAP } from '../../lib/gsap'

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<'student' | 'client'>('student')
  const sectionRef = useRef<HTMLElement>(null)
  const stepsContainerRef = useRef<HTMLDivElement>(null)

  const stepsData = [
    {
      step: '01',
      title: 'Discover the right people',
      badge: 'STAGE 01 · DISCOVERY',
      icon: Users,
      studentDesc:
        'Showcase your skills, projects and experience. Project creators discover your talent based on real code repositories, design portfolios, and demonstrated abilities.',
      clientDesc:
        'Discover ambitious student builders based on actual code repositories, portfolio work, and relevant technical capabilities.',
      uiVisual: {
        title: 'Portfolio & Code Showcase',
        subtitle: 'Student Repositories & UI Files',
        tags: ['React 19', 'TypeScript', 'Figma'],
        highlight: 'Demonstrated Skills',
      },
    },
    {
      step: '02',
      title: 'Align on project scope',
      badge: 'STAGE 02 · ALIGNMENT',
      icon: Compass,
      studentDesc:
        'Explore projects that match your interests, tech stack, and weekly availability. Review transparent deliverables and agreed timelines before committing.',
      clientDesc:
        'Define clear project deliverables, realistic timelines, and transparent project compensation so expectations are aligned from day one.',
      uiVisual: {
        title: 'Agreed Scope & Deliverables',
        subtitle: 'Milestones & Effort Breakdown',
        tags: ['$3,200 Budget', '15 hrs/wk', '3 Weeks'],
        highlight: 'Clear Milestones',
      },
    },
    {
      step: '03',
      title: 'Build something meaningful',
      badge: 'STAGE 03 · EXECUTION',
      icon: Rocket,
      studentDesc:
        'Collaborate directly with project creators, share progress, review pull requests or Figma components, and add real shipped work to your portfolio.',
      clientDesc:
        'Collaborate directly with emerging builders, provide feedback at structured checkpoints, and ship working software or creative assets together.',
      uiVisual: {
        title: 'Deliverables & Completion',
        subtitle: 'Final Code & Asset Handoff',
        tags: ['Code Review', 'Handoff Complete', 'Portfolio Shipped'],
        highlight: 'Completed Project',
      },
    },
  ]

  useGSAP(
    () => {
      if (!sectionRef.current || !stepsContainerRef.current) return

      const select = gsap.utils.selector(sectionRef)
      const headerItems = select('.workflow-reveal')
      const stations = select('.process-station')
      const milestone = select('.workflow-milestone')
      const checkpoints = select('.workflow-checkpoint')
      const allAnimatedItems = [...headerItems, ...stations, ...milestone, ...checkpoints]
      const media = gsap.matchMedia()

      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(allAnimatedItems, {
          autoAlpha: 1,
          clearProps: 'transform',
        })
      })

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const workflowIntro = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
            fastScrollEnd: true,
          },
        })

        workflowIntro
          .fromTo(
            headerItems,
            { autoAlpha: 0, y: 22 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.58,
              stagger: 0.09,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform',
            },
          )
          .fromTo(
            stations,
            { autoAlpha: 0, y: 44, scale: 0.98 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.64,
              stagger: 0.12,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.2',
          )

        gsap
          .timeline({
            scrollTrigger: {
              trigger: milestone[0],
              start: 'top 86%',
              once: true,
              fastScrollEnd: true,
            },
          })
          .fromTo(
            milestone,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.56,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform',
            },
          )
          .fromTo(
            checkpoints,
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.46,
              stagger: 0.09,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.25',
          )
      })

      return () => media.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="scroll-mt-24 py-20 sm:py-28 lg:py-32 text-[#171916] transition-colors relative overflow-hidden"
    >
      {/* Keep the workflow in the same warm color world as the intro. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D39DAD]/12 rounded-full blur-[150px] -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================== */}
        {/* SECTION HEADER: EDITORIAL TITLE & DUAL PERSPECTIVE TOGGLE      */}
        {/* ============================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-[#DED9D1]">
          <div className="max-w-2xl space-y-3">
            {/* Small Eyebrow */}
            <div className="workflow-reveal inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/75 border border-[#176B4C]/15 text-[#315448] text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#08A875]" />
              <span>COLLABORATIVE WORKFLOW STORY</span>
            </div>

            {/* Headline */}
            <h2 className="workflow-reveal text-3xl sm:text-4xl lg:text-[46px] font-medium text-[#171916] leading-[1.08] tracking-tight">
              A better way{' '}
              <span className="text-[#16845F] relative inline-block font-serif italic">
                to build together.
                <span
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1 w-full h-2.5 bg-[#DDEEE4] -rotate-1 -z-10 rounded-sm"
                />
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="workflow-reveal text-base sm:text-lg text-[#626A64] leading-relaxed pt-1">
              From discovering demonstrated skills to delivering completed briefs, PeerConnect makes
              peer and business collaboration straightforward.
            </p>
          </div>

          {/* Workflow Perspective Toggle */}
          <div className="workflow-reveal p-1.5 bg-white/75 rounded-full border border-[#DED9D1] inline-flex self-start lg:self-auto shadow-2xs backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-[#176B4C] text-white shadow-sm'
                  : 'text-[#626A64] hover:text-[#171916]'
              }`}
            >
              For Students
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('client')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'client'
                  ? 'bg-[#176B4C] text-white shadow-sm'
                  : 'text-[#626A64] hover:text-[#171916]'
              }`}
            >
              For Project Owners
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CONNECTED PROCESS STATIONS (Continuous Process Journey)        */}
        {/* ============================================================== */}
        <div ref={stepsContainerRef} className="pt-12 relative space-y-12 lg:space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-stretch">
            {stepsData.map((stepItem) => {
              const Icon = stepItem.icon
              const explanation =
                activeTab === 'student' ? stepItem.studentDesc : stepItem.clientDesc

              return (
                <div
                  key={stepItem.step}
                  className="process-station relative flex flex-col justify-between bg-white/80 rounded-3xl p-7 sm:p-8 border border-[#E5DED5] hover:border-[#176B4C]/35 transition-all duration-200 backdrop-blur-sm shadow-[0_12px_36px_rgba(79,58,42,0.07)] space-y-6"
                >
                  {/* Watermark Numeral & Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-3xl sm:text-4xl font-black text-[#176B4C] bg-[#E8F3EA] px-3 py-1 rounded-xl border border-[#176B4C]/10">
                          {stepItem.step}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#747B75]">
                          {stepItem.badge}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-[#F2F0E9] border border-[#E5DED5] flex items-center justify-center text-[#176B4C]">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-[#171916] leading-snug">
                      {stepItem.title}
                    </h3>

                    {/* Step Explanation */}
                    <p className="text-xs sm:text-sm text-[#626A64] leading-relaxed">
                      {explanation}
                    </p>
                  </div>

                  {/* Supporting UI Artifact Card */}
                  <div className="p-4 rounded-2xl bg-[#F7F4EE] border border-[#E8E1D8] space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#747B75]">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-[#27352D]">
                        {stepItem.uiVisual.title}
                      </span>
                      <span className="text-[#176B4C] font-bold text-[10px] bg-[#E1EFE5] px-2 py-0.5 rounded-full">
                        {stepItem.uiVisual.highlight}
                      </span>
                    </div>

                    <p className="text-xs text-[#747B75] leading-tight">
                      {stepItem.uiVisual.subtitle}
                    </p>

                    {/* Mini Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stepItem.uiVisual.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-[#424A44] border border-[#E5DED5]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Station Footer Note */}
                  <div className="pt-3 border-t border-[#E8E1D8] flex items-center justify-between text-xs text-[#747B75] font-medium">
                    <span>Milestone Phase {stepItem.step} of 03</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#176B4C] font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ready to Ship</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ============================================================ */}
          {/* STRUCTURED MILESTONE & COMMUNICATION STRIP                   */}
          {/* ============================================================ */}
          <div className="workflow-milestone mt-12 bg-white/55 rounded-3xl p-6 sm:p-8 border border-[#E5DED5] backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-2 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3EA] border border-[#176B4C]/15 text-[#176B4C] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#176B4C]" />
                  <span>Structured Project Checkpoints</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#171916] tracking-tight">
                  Clear expectations. Direct collaboration.
                </h4>
                <p className="text-xs sm:text-sm text-[#626A64] leading-relaxed">
                  Projects stay on track when deliverables and feedback checkpoints are defined upfront.
                  Students and creators collaborate with complete transparency from kickoff to handoff.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
                <div className="workflow-checkpoint p-4 rounded-2xl bg-white/80 border border-[#E5DED5] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#747B75] uppercase tracking-wider">
                      Phase 1
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[#176B4C]" />
                  </div>
                  <p className="text-sm font-bold text-[#171916]">Scope &amp; Setup</p>
                  <p className="text-xs text-[#747B75]">Kickoff brief, expectations, repo setup</p>
                </div>

                <div className="workflow-checkpoint p-4 rounded-2xl bg-[#EAF3E9] border border-[#176B4C]/15 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#176B4C] uppercase tracking-wider">
                      Phase 2
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#08A875]" />
                  </div>
                  <p className="text-sm font-bold text-[#171916]">Core Build</p>
                  <p className="text-xs text-[#426B58]">Milestone reviews, feedback loops, PRs</p>
                </div>

                <div className="workflow-checkpoint p-4 rounded-2xl bg-white/80 border border-[#E5DED5] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#747B75] uppercase tracking-wider">
                      Phase 3
                    </span>
                    <Sparkles className="w-4 h-4 text-[#176B4C]" />
                  </div>
                  <p className="text-sm font-bold text-[#171916]">Final Delivery</p>
                  <p className="text-xs text-[#747B75]">Handoff, assets merged, portfolio added</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
