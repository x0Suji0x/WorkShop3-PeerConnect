import { useRef } from 'react'
import { ArrowRight, Sparkles, FolderGit2, Briefcase, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { routes } from '../../app/routes'
import { gsap, useGSAP } from '../../lib/gsap'

export function DarkCtaSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current || !contentRef.current) return

      const select = gsap.utils.selector(sectionRef)
      const headerItems = select('.cta-header-reveal')
      const surface = select('.cta-surface')
      const pathways = select('.cta-pathway')
      const trustItems = select('.cta-trust-item')
      const allAnimatedItems = [...headerItems, ...surface, ...pathways, ...trustItems]
      const media = gsap.matchMedia()

      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(allAnimatedItems, {
          autoAlpha: 1,
          clearProps: 'transform',
        })
      })

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const isDesktop = window.matchMedia('(min-width: 768px)').matches
        const ctaTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 84%',
            once: true,
            fastScrollEnd: true,
          },
        })

        ctaTimeline
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
            surface,
            { autoAlpha: 0, y: 30, scale: 0.985 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.62,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.16',
          )
          .fromTo(
            pathways,
            {
              autoAlpha: 0,
              x: (index: number) => (isDesktop ? (index === 0 ? -28 : 28) : 0),
              y: isDesktop ? 0 : 20,
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.28',
          )
          .fromTo(
            trustItems,
            { autoAlpha: 0, y: 12 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              ease: 'power3.out',
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.04',
          )
      })

      return () => media.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative scroll-mt-24 py-24 sm:py-32 lg:py-36 text-[#171916] overflow-hidden border-t border-[#E5DED5]"
    >
      {/* Deep Forest-Green Ambient Glow & Grid Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[400px] bg-[#D39DAD]/14 rounded-full blur-[140px] -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-25 -z-0"
      />

      <div
        ref={contentRef}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14"
      >
        {/* Editorial Top Masthead */}
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <div className="cta-header-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/75 border border-[#176B4C]/15 text-[#315448] text-[11px] font-mono uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#176B4C]" />
            <span>PROJECT COLLABORATION</span>
          </div>

          <h2 className="cta-header-reveal text-3xl sm:text-5xl lg:text-[54px] font-medium tracking-tight text-[#171916] leading-[1.08]">
            A strong brief turns good ideas into{' '}
            <span className="text-[#16845F] font-serif italic relative inline-block">
              shipped work.
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 w-full h-2.5 bg-[#DDEEE4] -rotate-1 -z-10 rounded-sm"
              />
            </span>
          </h2>

          <p className="cta-header-reveal text-sm sm:text-base lg:text-lg text-[#626A64] leading-relaxed max-w-2xl mx-auto">
            Browse scoped opportunities or post your own and find student builders ready to work
            together.
          </p>
        </div>

        {/* Distinct Split Pathways: Pathway A (Students) & Pathway B (Project Owners) */}
        <div className="cta-surface grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white/75 border border-[#E5DED5] rounded-3xl p-6 sm:p-10 lg:p-12 backdrop-blur-md shadow-[0_16px_48px_rgba(79,58,42,0.06)]">
          {/* Pathway 1: For Student Talent */}
          <div className="cta-pathway flex flex-col justify-between space-y-6 md:pr-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-widest text-[#176B4C] uppercase flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4" />
                  Pathway 01 · Student Builders
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-[#F2F0E9] text-[#626A64] px-2 py-0.5 rounded">
                  Portfolio-Driven
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#171916] tracking-tight leading-snug">
                Showcase what you can build. Connect with active projects.
              </h3>

              <p className="text-xs sm:text-sm text-[#626A64] leading-relaxed">
                Add repositories, live demos, and design files to your profile. Explore client briefs and build experience with teams.
              </p>

              {/* Decorative mini student capability strip */}
              <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#E8E1D8] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#27352D] font-semibold">Featured Student Builder Profile</span>
                  <span className="text-[#176B4C] text-[11px] font-mono">Available for projects</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['React', 'TypeScript', 'Node.js', 'Figma', 'FastAPI'].map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E5DED5] text-[#626A64]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={routes.projects}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#176B4C] hover:bg-[#12583E] text-white shadow-[0_4px_20px_rgba(23,107,76,0.18)] hover:shadow-[0_6px_28px_rgba(23,107,76,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Pathway 2: For Project Owners / Startups */}
          <div className="cta-pathway flex flex-col justify-between space-y-6 md:border-l md:border-[#E5DED5] md:pl-8 lg:pl-12 pt-8 md:pt-0 border-t border-[#E5DED5] md:border-t-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-widest text-[#176B4C] uppercase flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Pathway 02 · Creators &amp; Founders
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-[#F2F0E9] text-[#626A64] px-2 py-0.5 rounded">
                  Milestone Scoped
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#171916] tracking-tight leading-snug">
                Post an opportunity. Find motivated university talent.
              </h3>

              <p className="text-xs sm:text-sm text-[#626A64] leading-relaxed">
                Outline your scope, budget, and timeline. Review student applications with linked GitHub code and Figma prototypes.
              </p>

              {/* Decorative mini project brief strip */}
              <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#E8E1D8] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#27352D] font-semibold">Active Project Brief Template</span>
                  <span className="text-[#176B4C] text-[11px] font-mono">$1,500 – $4,500 Scope</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#626A64] pt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#08A875]" />
                  <span>3 structured milestones: Discovery, MVP Build, QA Delivery</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={routes.newProject}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white hover:bg-[#F7F4EE] text-[#176B4C] border border-[#176B4C]/25 hover:border-[#176B4C]/45 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Post a Project</span>
                <ArrowRight className="w-4 h-4 ml-0.5 text-[#176B4C]/70" />
              </Link>
            </div>
          </div>
        </div>

        {/* Editorial trust baseline without unsupported payment or payout claims. */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-[#747B75] font-mono pt-2">
          <span className="cta-trust-item flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#176B4C]" />
            Free to browse &amp; connect
          </span>
          <span className="cta-trust-item flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#176B4C]" />
            Direct student collaboration
          </span>
          <span className="cta-trust-item flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#176B4C]" />
            Transparent milestone scopes
          </span>
        </div>
      </div>
    </section>
  )
}
