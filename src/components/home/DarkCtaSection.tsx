import { useEffect, useRef } from 'react'
import { ArrowRight, Sparkles, FolderGit2, Briefcase, CheckCircle2 } from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function DarkCtaSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    if (!contentRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ScrollTrigger.refresh()
      return
    }

    const items = contentRef.current.querySelectorAll('.cta-reveal')
    if (items.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0.3, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 95%',
            once: true,
          },
        },
      )
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative py-24 sm:py-32 lg:py-36 bg-[#0A120E] text-white overflow-hidden border-t border-white/10"
    >
      {/* Deep Forest-Green Ambient Glow & Grid Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[400px] bg-[#08C58A]/15 rounded-full blur-[140px] -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern-dark opacity-25 -z-0"
      />

      <div
        ref={contentRef}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14"
      >
        {/* Editorial Top Masthead */}
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <div className="cta-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D30] border border-[#08C58A]/35 text-[#08C58A] text-[11px] font-mono uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#08C58A]" />
            <span>COMMUNITY INVITATION</span>
          </div>

          <h2 className="cta-reveal text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-white leading-[1.08]">
            Your next big thing starts with the{' '}
            <span className="text-[#08C58A] relative inline-block">
              right people.
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 w-full h-2.5 bg-[#08C58A]/25 -rotate-1 -z-10 rounded-sm"
              />
            </span>
          </h2>

          <p className="cta-reveal text-sm sm:text-base lg:text-lg text-[#A3B8B0] leading-relaxed max-w-2xl mx-auto">
            Whether you&apos;re looking to showcase your skills or find talented students for your next
            project, there&apos;s a place for you here.
          </p>
        </div>

        {/* Distinct Split Pathways: Pathway A (Students) & Pathway B (Project Owners) */}
        <div className="cta-reveal grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10 lg:p-12 backdrop-blur-md">
          {/* Pathway 1: For Student Talent */}
          <div className="flex flex-col justify-between space-y-6 md:pr-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-widest text-[#08C58A] uppercase flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4" />
                  Pathway 01 · Student Builders
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-white/10 text-white/80 px-2 py-0.5 rounded">
                  Portfolio-Driven
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                Showcase what you can build. Connect with active projects.
              </h3>

              <p className="text-xs sm:text-sm text-[#A3B8B0] leading-relaxed">
                Put your real repositories, live demos, and design files front and center. Apply directly to client briefs and build verified experience with teams.
              </p>

              {/* Decorative mini student capability strip */}
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">Featured Student Builder Profile</span>
                  <span className="text-[#08C58A] text-[11px] font-mono">Available for projects</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['React', 'TypeScript', 'Node.js', 'Figma', 'FastAPI'].map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#C4D4CC]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => scrollTo('#talent')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#08C58A] hover:bg-[#07b27c] text-[#0A261D] shadow-[0_4px_20px_rgba(8,197,138,0.35)] hover:shadow-[0_6px_28px_rgba(8,197,138,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Join as Talent</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Pathway 2: For Project Owners / Startups */}
          <div className="flex flex-col justify-between space-y-6 md:border-l md:border-white/10 md:pl-8 lg:pl-12 pt-8 md:pt-0 border-t border-white/10 md:border-t-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-widest text-[#08C58A] uppercase flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Pathway 02 · Creators &amp; Founders
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-white/10 text-white/80 px-2 py-0.5 rounded">
                  Milestone Scoped
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                Post an opportunity. Find motivated university talent.
              </h3>

              <p className="text-xs sm:text-sm text-[#A3B8B0] leading-relaxed">
                Outline your scope, budget, and timeline. Receive curated student applications with verified GitHub code and Figma prototypes.
              </p>

              {/* Decorative mini project brief strip */}
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-semibold">Active Project Brief Template</span>
                  <span className="text-[#08C58A] text-[11px] font-mono">$1,500 – $4,500 Scope</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#A3B8B0] pt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#08C58A]" />
                  <span>3 structured milestones: Discovery, MVP Build, QA Delivery</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => scrollTo('#projects')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/35 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Post a Project</span>
                <ArrowRight className="w-4 h-4 ml-0.5 text-white/70" />
              </button>
            </div>
          </div>
        </div>

        {/* Editorial Trust Baseline (no fake escrow/payout claims) */}
        <div className="cta-reveal flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-[#A3B8B0] font-mono pt-2">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#08C58A]" />
            Free to browse &amp; connect
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#08C58A]" />
            Direct student collaboration
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#08C58A]" />
            Transparent milestone scopes
          </span>
        </div>
      </div>
    </section>
  )
}
