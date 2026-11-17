import { useEffect, useRef } from 'react'
import { ArrowRight, Sparkles, FolderGit2, Check, Briefcase } from 'lucide-react'
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
      className="relative py-20 sm:py-28 lg:py-32 bg-[#0A120E] text-white overflow-hidden"
    >
      {/* Deep Forest-Green Ambient Glow & Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[380px] bg-[#08C58A]/18 rounded-full blur-[140px] -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern-dark opacity-25 -z-0"
      />

      <div
        ref={contentRef}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8"
      >
        {/* Eyebrow Label */}
        <div className="cta-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#123D30] border border-[#08C58A]/40 text-[#08C58A] text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#08C58A]" />
          <span>JOIN THE COMMUNITY</span>
        </div>

        {/* Main Headline */}
        <h2 className="cta-reveal text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl mx-auto">
          Your next big thing starts with the{' '}
          <span className="text-[#08C58A] relative inline-block">
            right people.
            <span
              aria-hidden="true"
              className="absolute left-0 -bottom-1 w-full h-2.5 bg-[#08C58A]/25 -rotate-1 -z-10 rounded-sm"
            />
          </span>
        </h2>

        {/* Supporting Text */}
        <p className="cta-reveal text-base sm:text-lg text-[#A3B8B0] max-w-2xl mx-auto leading-relaxed">
          Whether you&apos;re looking to showcase your skills or find talented students for your next
          project, there&apos;s a place for you here.
        </p>

        {/* Two Prominent Actions */}
        <div className="cta-reveal flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => scrollTo('#talent')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm bg-[#08C58A] hover:bg-[#07b27c] text-[#0A261D] shadow-[0_2px_16px_rgba(8,197,138,0.3)] hover:shadow-[0_4px_24px_rgba(8,197,138,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Join as Talent</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            type="button"
            onClick={() => scrollTo('#projects')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Post a Project</span>
          </button>
        </div>

        {/* Two Perspective Information Cards */}
        <div className="cta-reveal pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
          {/* Card 1: For Students */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2 hover:border-[#08C58A]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#08C58A] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <FolderGit2 className="w-3.5 h-3.5" />
                For Student Builders
              </span>
              <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                Portfolio-First
              </span>
            </div>
            <p className="text-sm font-bold text-white">
              Showcase real code repositories and design work
            </p>
            <p className="text-xs text-[#A3B8B0] leading-relaxed">
              Connect with project owners, build a verified track record, and collaborate on real products.
            </p>
          </div>

          {/* Card 2: For Project Owners */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2 hover:border-[#08C58A]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#08C58A] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Briefcase className="w-3.5 h-3.5" />
                For Project Owners
              </span>
              <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                Milestone Scopes
              </span>
            </div>
            <p className="text-sm font-bold text-white">
              Find motivated student builders for your next build
            </p>
            <p className="text-xs text-[#A3B8B0] leading-relaxed">
              Define clear deliverables, collaborate with emerging developers, and ship projects faster.
            </p>
          </div>
        </div>

        {/* Trust Points */}
        <div className="cta-reveal flex flex-wrap items-center justify-center gap-6 text-xs text-[#A3B8B0] pt-2">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#08C58A]" />
            Free to join and explore
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#08C58A]" />
            Clear milestone scopes
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#08C58A]" />
            Direct peer collaboration
          </span>
        </div>
      </div>
    </section>
  )
}
