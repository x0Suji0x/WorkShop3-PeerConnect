import { useState, useEffect, useRef } from 'react'
import {
  Users,
  Compass,
  Rocket,
  CheckCircle2,
  Lock,
  ShieldCheck,
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
        'Students showcase their skills, projects and experience. Project owners discover talent based on relevant abilities.',
      clientDesc:
        'Project owners discover talent based on demonstrated abilities, actual code repositories and relevant portfolio craft.',
      uiVisual: {
        type: 'profile',
        title: 'Maya Lin',
        subtitle: 'Full-Stack & UI Engineering',
        tags: ['React 19', 'TypeScript', 'Figma'],
        highlight: 'Verified Proof-of-Work',
      },
    },
    {
      step: '02',
      title: 'Find the right opportunity',
      badge: 'Step 02',
      icon: Compass,
      studentDesc:
        'Students explore projects that match their interests, skills and availability. Project owners share clear project requirements.',
      clientDesc:
        'Project owners define structured requirements, timelines, and pre-allocated milestone budgets with transparent expectations.',
      uiVisual: {
        type: 'project',
        title: 'B2B Logistics Dashboard',
        subtitle: 'Local Studio (Sample Scope)',
        tags: ['$3,400 Budget', '15 hrs/wk', '3 weeks'],
        highlight: 'Milestone Escrow',
      },
    },
    {
      step: '03',
      title: 'Build something meaningful',
      badge: 'Step 03',
      icon: Rocket,
      studentDesc:
        'Students and project owners collaborate, share progress and turn ideas into completed work.',
      clientDesc:
        'Collaborate closely with student builders, review milestone pull requests or Figma files, and release payments on delivery.',
      uiVisual: {
        type: 'delivery',
        title: 'Deliverables Approved',
        subtitle: 'Milestone 2 Completed',
        tags: ['Code Merged', 'Staging Verified', '1-Click Payout'],
        highlight: '100% Milestone Released',
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
      className="py-14 sm:py-20 lg:py-24 bg-[#F7F6F0] text-[#171916] border-b border-[#E7E8E1] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Introduction */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3F4EB] border border-[#08C58A]/30 text-[#123D30] text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
              <span>FROM IDEA TO IMPACT</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#171916] leading-tight tracking-tight">
              A better way to build{' '}
              <span className="text-[#08C58A] relative inline-block">
                together.
                <span
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1 w-full h-2 bg-[#E3F4EB] -rotate-1 -z-10 rounded-sm"
                />
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#777A72] leading-relaxed">
              From discovering the right people to delivering meaningful projects, PeerConnect makes
              collaboration easier.
            </p>
          </div>

          {/* Workflow Perspective Toggle */}
          <div className="p-1 bg-white rounded-full border border-[#E7E8E1] inline-flex self-start lg:self-auto shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-[#171916] text-white shadow-xs'
                  : 'text-[#777A72] hover:text-[#171916]'
              }`}
            >
              For Students
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('client')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'client'
                  ? 'bg-[#171916] text-white shadow-xs'
                  : 'text-[#777A72] hover:text-[#171916]'
              }`}
            >
              For Project Owners
            </button>
          </div>
        </div>

        {/* Desktop Progression Track Line */}
        <div className="hidden md:block relative mb-8">
          <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-[#E7E8E1] -translate-y-1/2 -z-0" />
          <div
            ref={progressLineRef}
            className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-[#08C58A] -translate-y-1/2 -z-0 origin-left"
          />
          <div className="relative z-10 grid grid-cols-3 max-w-5xl mx-auto text-center">
            <div className="flex justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#08C58A] ring-4 ring-[#E3F4EB]" />
            </div>
            <div className="flex justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#08C58A] ring-4 ring-[#E3F4EB]" />
            </div>
            <div className="flex justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#08C58A] ring-4 ring-[#E3F4EB]" />
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
            const isLast = sIdx === 2
            const explanation =
              activeTab === 'student' ? stepItem.studentDesc : stepItem.clientDesc

            return (
              <div
                key={stepItem.step}
                className={`step-card group bg-white rounded-2xl p-6 sm:p-7 border transition-all duration-200 flex flex-col justify-between space-y-6 shadow-[0_4px_20px_rgba(23,25,22,0.04)] hover:shadow-[0_12px_32px_rgba(23,25,22,0.08)] hover:-translate-y-1 ${
                  isFirst
                    ? 'border-[#08C58A]/40 ring-1 ring-[#08C58A]/15'
                    : isLast
                    ? 'border-[#E7E8E1] hover:border-[#08C58A]/50'
                    : 'border-[#E7E8E1] hover:border-[#08C58A]/50'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Row: Numbered Indicator & Step Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 rounded-xl bg-[#E3F4EB] text-[#123D30] border border-[#08C58A]/30 font-black text-xl font-mono flex items-center justify-center shrink-0">
                        {stepItem.step}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#777A72]">
                        {stepItem.badge}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] flex items-center justify-center text-[#08C58A] group-hover:scale-105 transition-transform duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Heading & Short Explanation */}
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-[#171916] group-hover:text-[#08C58A] transition-colors leading-snug">
                      {stepItem.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#777A72] leading-relaxed">
                      {explanation}
                    </p>
                  </div>

                  {/* Small Supporting Visual / UI Element */}
                  <div className="p-3.5 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#777A72]">
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
                      <span className="text-[#08C58A] font-bold text-[10px]">Active Stage</span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#171916]">
                        {stepItem.uiVisual.title}
                      </p>
                      <p className="text-[11px] text-[#777A72] leading-tight">
                        {stepItem.uiVisual.subtitle}
                      </p>
                    </div>

                    {/* Mini Chips */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {stepItem.uiVisual.tags.map((tag, tIdx) => (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            tIdx === 0
                              ? 'bg-[#E3F4EB] text-[#123D30] border border-[#08C58A]/30'
                              : 'bg-white text-[#171916] border border-[#E7E8E1]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Step Tracker */}
                <div className="pt-3 border-t border-[#E7E8E1] flex items-center justify-between text-xs text-[#777A72] font-medium">
                  <span>Phase {stepItem.step} of 03</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#08C58A] font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>Workflow Ready</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Supporting Milestone Escrow Breakdown Card */}
        <div className="mt-10 bg-white rounded-2xl p-6 sm:p-8 border border-[#E7E8E1] shadow-[0_4px_24px_rgba(23,25,22,0.04)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E3F4EB] border border-[#08C58A]/30 text-[#123D30] text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#08C58A]" />
                <span>Milestone-Based Collaboration</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#171916] tracking-tight">
                Clear expectations, guaranteed milestones.
              </h4>
              <p className="text-xs sm:text-sm text-[#777A72] leading-relaxed">
                Projects are structured into clear deliverables. Funds are allocated into milestone
                escrow upfront and released directly as work is reviewed and accepted.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#777A72]">Milestone 1</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#08C58A]" />
                </div>
                <p className="text-xs font-bold text-[#171916]">Scope &amp; Setup</p>
                <span className="text-xs text-[#08C58A] font-semibold block">$1,200 Released</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#E3F4EB]/70 border border-[#08C58A]/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#123D30]">Milestone 2</span>
                  <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
                </div>
                <p className="text-xs font-bold text-[#171916]">Core Feature Build</p>
                <span className="text-xs text-[#123D30] font-semibold block">$2,400 In Review</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-1 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#777A72]">Milestone 3</span>
                  <Lock className="w-3.5 h-3.5 text-[#777A72]" />
                </div>
                <p className="text-xs font-bold text-[#171916]">Deployment &amp; QA</p>
                <span className="text-xs text-[#777A72] font-medium block">$900 In Escrow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
