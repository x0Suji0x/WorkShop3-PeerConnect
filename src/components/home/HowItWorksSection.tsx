import { useState, useEffect, useRef } from 'react'
import {
  Users,
  Compass,
  Rocket,
  CheckCircle2,
  FolderGit2,
  Clock,
  Sparkles,
} from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<'student' | 'client'>('student')
  const sectionRef = useRef<HTMLElement>(null)
  const stepsContainerRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)

  const stepsData = [
    {
      step: '01',
      title: 'Discover the right people',
      badge: 'Step 01',
      icon: Users,
      studentDesc:
        'Showcase your skills, projects and experience. Project creators discover your talent based on real code, designs, and demonstrated abilities.',
      clientDesc:
        'Discover ambitious student builders based on actual code repositories, portfolio work, and relevant technical capabilities.',
      uiVisual: {
        type: 'profile',
        title: 'Student Profile & Craft',
        subtitle: 'Portfolio & Code Repositories',
        tags: ['React 19', 'TypeScript', 'Figma'],
        highlight: 'Demonstrated Skills',
      },
    },
    {
      step: '02',
      title: 'Align on project scope',
      badge: 'Step 02',
      icon: Compass,
      studentDesc:
        'Explore projects that match your interests, tech stack, and weekly availability. Review transparent deliverables before committing.',
      clientDesc:
        'Define clear project deliverables, realistic timelines, and transparent project compensation so everyone is on the same page.',
      uiVisual: {
        type: 'project',
        title: 'Project Scope & Timeline',
        subtitle: 'Agreed Deliverables & Budget',
        tags: ['$3,200 Budget', '15 hrs/wk', '3 Weeks'],
        highlight: 'Clear Milestones',
      },
    },
    {
      step: '03',
      title: 'Build something meaningful',
      badge: 'Step 03',
      icon: Rocket,
      studentDesc:
        'Collaborate directly with project owners, share progress, review pull requests or Figma files, and add real shipped work to your resume.',
      clientDesc:
        'Collaborate directly with emerging builders, provide feedback at structured checkpoints, and ship working software or designs.',
      uiVisual: {
        type: 'delivery',
        title: 'Project Delivery & Review',
        subtitle: 'Final Code & Asset Handoff',
        tags: ['Code Review', 'Deliverables Accepted', 'Portfolio Ready'],
        highlight: 'Completed Project',
      },
    },
  ]

  useEffect(() => {
    if (!stepsContainerRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ScrollTrigger.refresh()
      return
    }

    const cards = stepsContainerRef.current.querySelectorAll('.step-card')
    if (cards.length === 0) return

    const ctx = gsap.context(() => {
      // Progression line animation
      if (progressLineRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stepsContainerRef.current,
              start: 'top 92%',
              once: true,
            },
          },
        )
      }

      // Staggered step cards entrance
      gsap.fromTo(
        cards,
        { opacity: 0.3, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: stepsContainerRef.current,
            start: 'top 95%',
            once: true,
          },
        },
      )
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [activeTab])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-16 sm:py-24 lg:py-28 bg-[#123D30] text-white border-b border-[#08C58A]/20 transition-colors relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-[#08C58A]/10 rounded-full blur-[140px] -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern-dark opacity-20 -z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Introduction */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#08C58A]/40 text-[#08C58A] text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
              <span>FROM IDEA TO IMPACT</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white leading-tight tracking-tight">
              A better way to build{' '}
              <span className="text-[#08C58A] relative inline-block">
                together.
                <span
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1 w-full h-2 bg-[#08C58A]/20 -rotate-1 -z-10 rounded-sm"
                />
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#A3B8B0] leading-relaxed">
              From discovering the right people to delivering meaningful projects, PeerConnect makes
              collaboration easier.
            </p>
          </div>

          {/* Workflow Perspective Toggle */}
          <div className="p-1 bg-black/30 rounded-full border border-white/15 inline-flex self-start lg:self-auto shadow-2xs backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-[#08C58A] text-[#0A261D] shadow-xs'
                  : 'text-[#A3B8B0] hover:text-white'
              }`}
            >
              For Students
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('client')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'client'
                  ? 'bg-[#08C58A] text-[#0A261D] shadow-xs'
                  : 'text-[#A3B8B0] hover:text-white'
              }`}
            >
              For Project Owners
            </button>
          </div>
        </div>

        {/* Progression Track Line (Desktop) */}
        <div className="hidden md:block relative mb-8">
          <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-white/10 -translate-y-1/2 -z-0" />
          <div
            ref={progressLineRef}
            className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-[#08C58A] -translate-y-1/2 -z-0 origin-left"
          />
          <div className="relative z-10 grid grid-cols-3 max-w-5xl mx-auto text-center">
            <div className="flex justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#08C58A] ring-4 ring-[#123D30]" />
            </div>
            <div className="flex justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#08C58A] ring-4 ring-[#123D30]" />
            </div>
            <div className="flex justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#08C58A] ring-4 ring-[#123D30]" />
            </div>
          </div>
        </div>

        {/* 3 Step Workflow Cards */}
        <div
          ref={stepsContainerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        >
          {stepsData.map((stepItem, sIdx) => {
            const Icon = stepItem.icon
            const isFirst = sIdx === 0
            const explanation =
              activeTab === 'student' ? stepItem.studentDesc : stepItem.clientDesc

            return (
              <div
                key={stepItem.step}
                className={`step-card group bg-white/6 rounded-2xl p-6 sm:p-7 border transition-all duration-200 flex flex-col justify-between space-y-6 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(8,197,138,0.18)] hover:-translate-y-1 ${
                  isFirst
                    ? 'border-[#08C58A]/50 ring-1 ring-[#08C58A]/20'
                    : 'border-white/10 hover:border-[#08C58A]/50'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Row: Numbered Indicator & Step Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 rounded-xl bg-white/10 text-[#08C58A] border border-white/15 font-black text-xl font-mono flex items-center justify-center shrink-0">
                        {stepItem.step}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#A3B8B0]">
                        {stepItem.badge}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#08C58A] group-hover:scale-105 transition-transform duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Heading & Explanation */}
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#08C58A] transition-colors leading-snug">
                      {stepItem.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A3B8B0] leading-relaxed">
                      {explanation}
                    </p>
                  </div>

                  {/* Supporting UI Card */}
                  <div className="p-3.5 rounded-xl bg-black/25 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#A3B8B0]">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                        {stepItem.uiVisual.type === 'profile' && (
                          <FolderGit2 className="w-3.5 h-3.5 text-[#08C58A]" />
                        )}
                        {stepItem.uiVisual.type === 'project' && (
                          <Clock className="w-3.5 h-3.5 text-[#08C58A]" />
                        )}
                        {stepItem.uiVisual.type === 'delivery' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#08C58A]" />
                        )}
                        <span>{stepItem.uiVisual.highlight}</span>
                      </span>
                      <span className="text-[#08C58A] font-bold text-[10px]">Checkpoint</span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white">
                        {stepItem.uiVisual.title}
                      </p>
                      <p className="text-[11px] text-[#A3B8B0] leading-tight">
                        {stepItem.uiVisual.subtitle}
                      </p>
                    </div>

                    {/* Mini Chips */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {stepItem.uiVisual.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-stone-200 border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Step Tracker */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#A3B8B0] font-medium">
                  <span>Phase {stepItem.step} of 03</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#08C58A] font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>Structured Flow</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Refined Structured Collaboration Callout (Replaced escrow claims) */}
        <div className="mt-10 bg-white/5 rounded-2xl p-6 sm:p-7 border border-white/10 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-[#08C58A]/30 text-[#08C58A] text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#08C58A]" />
                <span>Structured Milestone Collaboration</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Clear expectations. Agreed deliverables.
              </h4>
              <p className="text-xs sm:text-sm text-[#A3B8B0] leading-relaxed">
                Projects run smoothly when deliverables, timelines, and feedback loops are agreed on upfront.
                PeerConnect helps students and creators stay aligned at every stage.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-black/25 border border-white/10 space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#A3B8B0]">Checkpoint 1</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#08C58A]" />
                </div>
                <p className="text-xs font-bold text-white">Scope &amp; Setup</p>
                <span className="text-[11px] text-[#08C58A] font-semibold block">Kickoff Brief</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-[#08C58A]/30 space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white">Checkpoint 2</span>
                  <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
                </div>
                <p className="text-xs font-bold text-white">Core Build</p>
                <span className="text-[11px] text-emerald-300 font-semibold block">Feedback Review</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/25 border border-white/10 space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#A3B8B0]">Checkpoint 3</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#08C58A]" />
                </div>
                <p className="text-xs font-bold text-white">Final Delivery</p>
                <span className="text-[11px] text-[#A3B8B0] font-medium block">Handoff &amp; Portfolio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
