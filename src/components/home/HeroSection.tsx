import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Sparkles,
  Clock,
  FolderGit2,
  CheckCircle2,
  Zap,
  Code2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const sceneContainerRef = useRef<HTMLDivElement>(null)

  // Headline refs for smooth cross-fading and sliding transitions
  const headline1Ref = useRef<HTMLDivElement>(null)
  const headline2Ref = useRef<HTMLDivElement>(null)
  const headline3Ref = useRef<HTMLDivElement>(null)
  const headline4Ref = useRef<HTMLDivElement>(null)

  // Card refs for large noticeable translations and scale changes
  const studentCard1Ref = useRef<HTMLDivElement>(null) // Sofia Rodriguez
  const studentCard2Ref = useRef<HTMLDivElement>(null) // Marcus Chen
  const studentCard3Ref = useRef<HTMLDivElement>(null) // Aria Vance
  const projectCard1Ref = useRef<HTMLDivElement>(null) // Campus Event Website
  const projectCard2Ref = useRef<HTMLDivElement>(null) // Analytics Pipeline

  // Floating skill tags
  const skillTag1Ref = useRef<HTMLDivElement>(null) // REACT 19
  const skillTag2Ref = useRef<HTMLDivElement>(null) // UI DESIGN
  const skillTag3Ref = useRef<HTMLDivElement>(null) // AI / LLM
  const skillTag4Ref = useRef<HTMLDivElement>(null) // THREE.JS

  // Match and Connection indicators
  const matchBadge1Ref = useRef<HTMLDivElement>(null)
  const matchBadge2Ref = useRef<HTMLDivElement>(null)
  const ctaExploreRef = useRef<HTMLButtonElement>(null)

  // Stage indicator state & refs
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState(1)

  const { scrollTo } = useSmoothScroll()

  // 3D tilt interaction for cards on pointer devices
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`
  }

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = ''
  }

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop:
          '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        isTablet:
          '(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)',
        isMobile:
          '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, isTablet, isMobile, reduceMotion } =
          context.conditions!

        // Accessible fallback for reduced motion: clean static presentation
        if (reduceMotion) {
          gsap.set('.connection-path-story', { strokeDashoffset: 0, opacity: 1 })
          gsap.set(
            [
              studentCard1Ref.current,
              studentCard2Ref.current,
              studentCard3Ref.current,
              projectCard1Ref.current,
              projectCard2Ref.current,
              matchBadge1Ref.current,
              matchBadge2Ref.current,
              skillTag1Ref.current,
              skillTag2Ref.current,
              skillTag3Ref.current,
              skillTag4Ref.current,
            ],
            { opacity: 1, scale: 1, x: 0, y: 0 },
          )
          gsap.set([headline1Ref.current, headline2Ref.current, headline3Ref.current], {
            opacity: 0,
            display: 'none',
          })
          gsap.set(headline4Ref.current, { opacity: 1, y: 0, display: 'flex' })
          return
        }

        // =========================================================================
        // DESKTOP: FULL IMMERSIVE SCROLL-DRIVEN STORYTELLING TIMELINE (2.8 Viewports)
        // =========================================================================
        if (isDesktop && heroRef.current) {
          // Initialize Initial Offsets & States
          // Headline 1 visible, others waiting offscreen below
          gsap.set(headline1Ref.current, { opacity: 1, y: 0 })
          gsap.set([headline2Ref.current, headline3Ref.current, headline4Ref.current], {
            opacity: 0,
            y: 45,
          })

          // Student Cards initial positions (entering from distinct outer coordinates)
          gsap.set(studentCard1Ref.current, {
            x: -240,
            y: 120,
            scale: 0.85,
            opacity: 0,
          })
          gsap.set(studentCard2Ref.current, {
            x: -120,
            y: 260,
            scale: 0.85,
            opacity: 0,
          })
          gsap.set(studentCard3Ref.current, {
            x: 240,
            y: -100,
            scale: 0.85,
            opacity: 0,
          })

          // Project Cards waiting offscreen to the right
          gsap.set(projectCard1Ref.current, {
            x: 380,
            y: -20,
            scale: 0.8,
            opacity: 0,
          })
          gsap.set(projectCard2Ref.current, {
            x: 320,
            y: 180,
            scale: 0.8,
            opacity: 0,
          })

          // Floating skill tags
          gsap.set([skillTag1Ref.current, skillTag2Ref.current, skillTag3Ref.current, skillTag4Ref.current], {
            scale: 0.6,
            opacity: 0,
          })

          // Match badges & connection lines
          gsap.set([matchBadge1Ref.current, matchBadge2Ref.current], {
            scale: 0.5,
            opacity: 0,
          })
          gsap.set('.connection-path-story', {
            strokeDashoffset: 100,
            opacity: 0,
          })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 80px',
              end: '+=2500', // ~2.8 viewport heights for expressive storytelling
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress
                if (progressBarRef.current) {
                  progressBarRef.current.style.width = `${Math.round(p * 100)}%`
                }
                if (p < 0.25) {
                  setActiveStage(1)
                } else if (p < 0.5) {
                  setActiveStage(2)
                } else if (p < 0.75) {
                  setActiveStage(3)
                } else {
                  setActiveStage(4)
                }
              },
            },
          })

          // Timeline Duration = 12 units (3 units per stage)

          // -----------------------------------------------------------------------
          // STAGE 1: "TALENT IS EVERYWHERE. OPPORTUNITY SHOULD BE TOO." (t: 0 -> 3.0)
          // -----------------------------------------------------------------------
          // 3 Large student profile cards enter visibly from distinct directions
          tl.to(
            studentCard1Ref.current,
            { x: -30, y: 0, scale: 1.0, opacity: 1, duration: 2.2, ease: 'power2.out' },
            0.4,
          )
          tl.to(
            studentCard2Ref.current,
            { x: -50, y: 15, scale: 0.98, opacity: 1, duration: 2.4, ease: 'power2.out' },
            0.6,
          )
          tl.to(
            studentCard3Ref.current,
            { x: 30, y: 0, scale: 0.96, opacity: 1, duration: 2.2, ease: 'power2.out' },
            0.8,
          )

          // Skill tags enter to show diverse skills
          tl.to(
            skillTag1Ref.current,
            { scale: 1, opacity: 1, y: -10, duration: 1.6, ease: 'back.out(1.5)' },
            1.0,
          )
          tl.to(
            skillTag2Ref.current,
            { scale: 1, opacity: 1, y: 8, duration: 1.6, ease: 'back.out(1.5)' },
            1.2,
          )
          tl.to(
            skillTag3Ref.current,
            { scale: 1, opacity: 1, y: -6, duration: 1.6, ease: 'back.out(1.5)' },
            1.4,
          )

          // -----------------------------------------------------------------------
          // STAGE 2: "MEET THE PEOPLE BEHIND THE IDEAS." (t: 3.0 -> 6.0)
          // -----------------------------------------------------------------------
          // Transition headline 1 out, headline 2 in
          tl.to(
            headline1Ref.current,
            { y: -40, opacity: 0, duration: 1.0, ease: 'power2.in' },
            2.8,
          )
          tl.to(
            headline2Ref.current,
            { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
            3.2,
          )

          // Card 1 (Sofia Rodriguez) expands significantly into the visual focal spotlight
          tl.to(
            studentCard1Ref.current,
            {
              x: 15,
              y: -15,
              scale: 1.14,
              boxShadow: '0 28px 60px rgba(8,197,138,0.24)',
              zIndex: 30,
              duration: 2.4,
              ease: 'power2.inOut',
            },
            3.0,
          )

          // Card 2 (Marcus Chen) steps forward with portfolio focus
          tl.to(
            studentCard2Ref.current,
            {
              x: -40,
              y: 40,
              scale: 1.02,
              zIndex: 25,
              duration: 2.4,
              ease: 'power2.inOut',
            },
            3.2,
          )

          // Card 3 (Aria Vance) repositions behind into layered depth
          tl.to(
            studentCard3Ref.current,
            {
              x: 60,
              y: -40,
              scale: 0.88,
              opacity: 0.65,
              zIndex: 10,
              duration: 2.4,
              ease: 'power2.inOut',
            },
            3.0,
          )

          // Skill tag 4 (THREE.JS) enters
          tl.to(
            skillTag4Ref.current,
            { scale: 1, opacity: 1, y: 0, duration: 1.4, ease: 'back.out(1.5)' },
            3.8,
          )

          // -----------------------------------------------------------------------
          // STAGE 3: "IDEAS NEED PEOPLE. PEOPLE NEED PROJECTS." (t: 6.0 -> 9.0)
          // -----------------------------------------------------------------------
          // Transition headline 2 out, headline 3 in
          tl.to(
            headline2Ref.current,
            { y: -40, opacity: 0, duration: 1.0, ease: 'power2.in' },
            5.8,
          )
          tl.to(
            headline3Ref.current,
            { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
            6.2,
          )

          // Large Project Opportunity Cards enter visibly from the right
          tl.to(
            projectCard1Ref.current,
            {
              x: 20,
              y: -25,
              scale: 1.06,
              opacity: 1,
              duration: 2.5,
              ease: 'power2.out',
            },
            6.0,
          )
          tl.to(
            projectCard2Ref.current,
            {
              x: 10,
              y: 35,
              scale: 1.0,
              opacity: 1,
              duration: 2.5,
              ease: 'power2.out',
            },
            6.4,
          )

          // Student cards shift into side-by-side alignment with their matching projects
          // Sofia aligns alongside Project 1 (Campus Event Platform)
          tl.to(
            studentCard1Ref.current,
            {
              x: -125,
              y: -25,
              scale: 1.0,
              duration: 2.4,
              ease: 'power2.inOut',
            },
            6.2,
          )

          // Marcus aligns alongside Project 2 (Telemetry Dashboard)
          tl.to(
            studentCard2Ref.current,
            {
              x: -115,
              y: 35,
              scale: 0.96,
              duration: 2.4,
              ease: 'power2.inOut',
            },
            6.4,
          )

          // Aria tucks gracefully into top-center orbit
          tl.to(
            studentCard3Ref.current,
            {
              x: -10,
              y: -110,
              scale: 0.82,
              opacity: 0.75,
              duration: 2.4,
              ease: 'power2.inOut',
            },
            6.2,
          )

          // -----------------------------------------------------------------------
          // STAGE 4: "FIND YOUR PEOPLE. BUILD YOUR NEXT THING." (t: 9.0 -> 12.0)
          // -----------------------------------------------------------------------
          // Transition headline 3 out, headline 4 in
          tl.to(
            headline3Ref.current,
            { y: -40, opacity: 0, duration: 1.0, ease: 'power2.in' },
            8.8,
          )
          tl.to(
            headline4Ref.current,
            { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
            9.2,
          )

          // Draw SVG connection circuits linking students to funded projects
          tl.to(
            '.connection-path-story',
            {
              strokeDashoffset: 0,
              opacity: 1,
              duration: 2.2,
              stagger: 0.25,
              ease: 'power2.inOut',
            },
            9.0,
          )

          // Match nodes illuminate and pop into view
          tl.to(
            matchBadge1Ref.current,
            { scale: 1, opacity: 1, duration: 1.4, ease: 'back.out(1.8)' },
            9.4,
          )
          tl.to(
            matchBadge2Ref.current,
            { scale: 1, opacity: 1, duration: 1.4, ease: 'back.out(1.8)' },
            9.8,
          )

          // Cards settle into interlocking connected equilibrium
          tl.to(
            [studentCard1Ref.current, projectCard1Ref.current],
            { y: -20, duration: 1.8, ease: 'power2.out' },
            9.5,
          )
          tl.to(
            [studentCard2Ref.current, projectCard2Ref.current],
            { y: 40, duration: 1.8, ease: 'power2.out' },
            9.7,
          )

          // Final CTA emphasis glow before release
          if (ctaExploreRef.current) {
            tl.to(
              ctaExploreRef.current,
              {
                scale: 1.03,
                boxShadow: '0 8px 30px rgba(8,197,138,0.45)',
                duration: 1.6,
                ease: 'power2.out',
              },
              10.0,
            )
          }
        }

        // =========================================================================
        // TABLET: BALANCED STORYTELLING TIMELINE (Pin +=1300px, Scrub: 0.8)
        // =========================================================================
        if (isTablet && heroRef.current) {
          gsap.set(headline1Ref.current, { opacity: 1, y: 0 })
          gsap.set([headline2Ref.current, headline3Ref.current, headline4Ref.current], {
            opacity: 0,
            y: 30,
          })
          gsap.set(studentCard1Ref.current, { x: -60, opacity: 0.9, scale: 0.9 })
          gsap.set(studentCard2Ref.current, { x: -40, y: 30, opacity: 0.9, scale: 0.88 })
          gsap.set(studentCard3Ref.current, { x: 50, opacity: 0.7, scale: 0.82 })
          gsap.set([projectCard1Ref.current, projectCard2Ref.current], {
            x: 180,
            opacity: 0,
            scale: 0.85,
          })
          gsap.set('.connection-path-story', { strokeDashoffset: 100, opacity: 0 })
          gsap.set([matchBadge1Ref.current, matchBadge2Ref.current], { opacity: 0, scale: 0.6 })

          const tlTablet = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 80px',
              end: '+=1300',
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress
                if (progressBarRef.current) {
                  progressBarRef.current.style.width = `${Math.round(p * 100)}%`
                }
                if (p < 0.25) setActiveStage(1)
                else if (p < 0.5) setActiveStage(2)
                else if (p < 0.75) setActiveStage(3)
                else setActiveStage(4)
              },
            },
          })

          // Stage 1 -> 2
          tlTablet.to(headline1Ref.current, { y: -30, opacity: 0, duration: 1 }, 2.5)
          tlTablet.to(headline2Ref.current, { y: 0, opacity: 1, duration: 1 }, 3.0)
          tlTablet.to(studentCard1Ref.current, { scale: 1.05, x: 0, opacity: 1, duration: 2 }, 3.0)

          // Stage 2 -> 3
          tlTablet.to(headline2Ref.current, { y: -30, opacity: 0, duration: 1 }, 5.5)
          tlTablet.to(headline3Ref.current, { y: 0, opacity: 1, duration: 1 }, 6.0)
          tlTablet.to(studentCard1Ref.current, { x: -70, scale: 0.95, duration: 2 }, 6.0)
          tlTablet.to(projectCard1Ref.current, { x: 30, opacity: 1, scale: 0.95, duration: 2 }, 6.2)

          // Stage 3 -> 4
          tlTablet.to(headline3Ref.current, { y: -30, opacity: 0, duration: 1 }, 8.5)
          tlTablet.to(headline4Ref.current, { y: 0, opacity: 1, duration: 1 }, 9.0)
          tlTablet.to('.connection-path-story', { strokeDashoffset: 0, opacity: 1, duration: 2 }, 9.2)
          tlTablet.to(matchBadge1Ref.current, { scale: 1, opacity: 1, duration: 1.5 }, 9.6)
        }

        // =========================================================================
        // MOBILE: PROGRESSIVE VERTICAL STORY (No Pinning, Never Traps User)
        // =========================================================================
        if (isMobile && heroRef.current) {
          gsap.set(headline1Ref.current, { opacity: 1, y: 0 })
          gsap.set([headline2Ref.current, headline3Ref.current, headline4Ref.current], {
            display: 'none',
          })
          gsap.set(
            [
              studentCard1Ref.current,
              studentCard2Ref.current,
              projectCard1Ref.current,
            ],
            { opacity: 1, scale: 1 },
          )
          gsap.set([studentCard3Ref.current, projectCard2Ref.current], { display: 'none' })
          gsap.set('.connection-path-story', { strokeDashoffset: 0, opacity: 1 })
          gsap.set(matchBadge1Ref.current, { opacity: 1, scale: 1 })
        }
      },
      heroRef,
    )

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    return () => {
      clearTimeout(timer)
      mm.revert()
    }
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative bg-[#F7F6F0] text-[#171916] overflow-hidden border-b border-[#E7E8E1] w-full"
    >
      {/* Subtle ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 right-1/4 w-[560px] h-[560px] bg-[#08C58A]/10 rounded-full blur-[140px] -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/3 w-[680px] h-[340px] bg-[#E3F4EB]/70 rounded-full blur-3xl -z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0"
      />

      {/* Main Hero Container — occupies 75–90vh on desktop */}
      <div
        ref={sceneContainerRef}
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col justify-between py-5 sm:py-7 lg:py-6"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
          {/* ============================================================== */}
          {/* TOP STORYBOARD HEADER & 4-STAGE INTERACTIVE PROGRESS TRACKER   */}
          {/* ============================================================== */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E7E8E1]/80">
            {/* Left: Eyebrow + Active Stage Label */}
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#123D30]">
                PEERCONNECT · WHERE TALENT MEETS OPPORTUNITY
              </span>
              <span className="hidden sm:inline-block text-[#D1D2C9]">/</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E3F4EB] text-[#123D30] font-mono text-[11px] font-bold">
                STAGE 0{activeStage} OF 04
              </span>
            </div>

            {/* Right: 4-Stage Progress Track */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#777A72]">
              <div className="hidden md:flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-wider">
                <span className={activeStage === 1 ? 'text-[#08C58A]' : 'text-[#777A72]'}>
                  01 Talent
                </span>
                <span className="text-[#D1D2C9]">→</span>
                <span className={activeStage === 2 ? 'text-[#08C58A]' : 'text-[#777A72]'}>
                  02 Discover
                </span>
                <span className="text-[#D1D2C9]">→</span>
                <span className={activeStage === 3 ? 'text-[#08C58A]' : 'text-[#777A72]'}>
                  03 Projects
                </span>
                <span className="text-[#D1D2C9]">→</span>
                <span className={activeStage === 4 ? 'text-[#08C58A]' : 'text-[#777A72]'}>
                  04 Connect
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-24 sm:w-32 h-1.5 rounded-full bg-[#E7E8E1] overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full bg-[#08C58A] rounded-full w-0 transition-all duration-75"
                />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* MAIN ARENA: DYNAMIC NARRATIVE + LARGE VISUAL CANVAS (75-90vh)   */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1 py-4 lg:py-2">
            {/* ------------------------------------------------------------ */}
            {/* LEFT COLUMN: DYNAMIC 4-STAGE STORY HEADLINES & CTAS          */}
            {/* ------------------------------------------------------------ */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-4 sm:space-y-5 text-left">
              {/* Dynamic Headline Switcher (Fixed container height to prevent layout shift) */}
              <div className="relative min-h-[145px] sm:min-h-[160px] lg:min-h-[185px]">
                {/* STAGE 1 HEADLINE */}
                <div
                  ref={headline1Ref}
                  className="absolute inset-0 flex flex-col justify-start will-change-transform"
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-extrabold text-[#171916] leading-[1.12] tracking-tight">
                    Talent is everywhere.{' '}
                    <span className="text-[#08C58A] block">Opportunity should be too.</span>
                  </h1>
                  <p className="text-sm sm:text-base text-[#777A72] leading-relaxed max-w-lg pt-2 sm:pt-2.5">
                    Thousands of ambitious university developers, designers, and creators are building real products.
                  </p>
                </div>

                {/* STAGE 2 HEADLINE */}
                <div
                  ref={headline2Ref}
                  className="absolute inset-0 flex flex-col justify-start will-change-transform"
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-extrabold text-[#171916] leading-[1.12] tracking-tight">
                    Meet the people{' '}
                    <span className="text-[#08C58A] block">behind the ideas.</span>
                  </h1>
                  <p className="text-sm sm:text-base text-[#777A72] leading-relaxed max-w-lg pt-2 sm:pt-2.5">
                    Real student builders with verified skills, portfolio work, transparent rates, and immediate availability.
                  </p>
                </div>

                {/* STAGE 3 HEADLINE */}
                <div
                  ref={headline3Ref}
                  className="absolute inset-0 flex flex-col justify-start will-change-transform"
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-extrabold text-[#171916] leading-[1.12] tracking-tight">
                    Ideas need people.{' '}
                    <span className="text-[#08C58A] block">People need projects.</span>
                  </h1>
                  <p className="text-sm sm:text-base text-[#777A72] leading-relaxed max-w-lg pt-2 sm:pt-2.5">
                    Startups, businesses, and student founders post real briefs with funded milestone budgets.
                  </p>
                </div>

                {/* STAGE 4 HEADLINE */}
                <div
                  ref={headline4Ref}
                  className="absolute inset-0 flex flex-col justify-start will-change-transform"
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-extrabold text-[#171916] leading-[1.12] tracking-tight">
                    Find your people.{' '}
                    <span className="text-[#08C58A] block">Build your next thing.</span>
                  </h1>
                  <p className="text-sm sm:text-base text-[#777A72] leading-relaxed max-w-lg pt-2 sm:pt-2.5">
                    Connect directly, agree on milestone deliverables, and ship ambitious projects together.
                  </p>
                </div>
              </div>

              {/* Action CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  ref={ctaExploreRef}
                  type="button"
                  onClick={() => scrollTo('#talent')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm bg-[#08C58A] hover:bg-[#07b27c] text-[#0A261D] shadow-[0_2px_14px_rgba(8,197,138,0.25)] hover:shadow-[0_4px_20px_rgba(8,197,138,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <span>Explore Talent</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('#projects')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm bg-white hover:bg-[#F2F1EA] text-[#171916] border border-[#E7E8E1] hover:border-[#D1D2C9] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-2xs cursor-pointer"
                >
                  <span>Post a Project</span>
                </button>
              </div>

              {/* Supporting Trust Line */}
              <div className="flex items-center gap-3 pt-2.5 border-t border-[#E7E8E1]">
                <div className="flex -space-x-2 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Sofia"
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
                    alt="Marcus"
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                    alt="Aria"
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                  <div className="w-7 h-7 rounded-full bg-[#123D30] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#08C58A]">
                    +
                  </div>
                </div>
                <p className="text-xs text-[#777A72] leading-snug">
                  Where university builders &amp; founders connect to ship real ideas.
                </p>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* RIGHT VISUAL CANVAS: IMMERSIVE EXPANSIVE STORYSTAGE (75-90vh)*/}
            {/* ------------------------------------------------------------ */}
            <div className="lg:col-span-7 xl:col-span-7 relative w-full h-[520px] sm:h-[560px] lg:h-[580px] xl:h-[610px] flex items-center justify-center">
              {/* SVG CONNECTION CIRCUITS OVERLAY */}
              <svg
                aria-hidden="true"
                viewBox="0 0 700 600"
                className="absolute inset-0 w-full h-full pointer-events-none z-15"
              >
                <defs>
                  <linearGradient id="storyCircuitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#08C58A" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#08C58A" stopOpacity="1" />
                    <stop offset="100%" stopColor="#08C58A" stopOpacity="0.5" />
                  </linearGradient>
                </defs>

                {/* Path 1: Sofia (Top-Left) -> Project 1 (Top-Right) */}
                <path
                  d="M 230,170 C 330,170 370,170 470,170"
                  fill="none"
                  stroke="url(#storyCircuitGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={100}
                  className="connection-path-story"
                />

                {/* Path 2: Marcus (Bottom-Left) -> Project 2 (Bottom-Right) */}
                <path
                  d="M 240,430 C 330,430 380,430 460,430"
                  fill="none"
                  stroke="url(#storyCircuitGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={100}
                  className="connection-path-story"
                />
              </svg>

              {/* 1. STUDENT PROFILE CARD 1: SOFIA RODRIGUEZ (Primary Focus) */}
              <div
                ref={studentCard1Ref}
                className="hero-story-card absolute top-8 lg:top-10 left-0 sm:left-4 z-20 w-[275px] sm:w-[315px] lg:w-[335px] will-change-transform"
              >
                <div
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className="w-full bg-white rounded-2xl p-4 border border-[#E7E8E1] shadow-[0_8px_30px_rgba(23,25,22,0.08)] hover:border-[#08C58A]/60 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80"
                        alt="Sofia Rodriguez"
                        className="w-11 h-11 rounded-xl object-cover border border-[#E7E8E1]"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#08C58A] border-2 border-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-[#171916] text-sm truncate">
                          Sofia Rodriguez
                        </h4>
                        <span className="font-mono text-xs font-bold text-[#08C58A]">
                          $65/hr
                        </span>
                      </div>
                      <p className="text-[11px] text-[#777A72] truncate">
                        Frontend &amp; Design Engineer
                      </p>
                    </div>
                  </div>

                  {/* Portfolio Feature Preview */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-[#777A72]">
                      <span className="font-semibold text-[#171916] flex items-center gap-1">
                        <FolderGit2 className="w-3 h-3 text-[#08C58A]" /> Featured Work
                      </span>
                      <span className="text-[#08C58A] font-medium flex items-center gap-0.5">
                        Verified <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#171916] leading-snug">
                      Interactive 3D Canvas with generative shaders &amp; motion
                    </p>
                  </div>

                  {/* Skills & Availability */}
                  <div className="flex items-center justify-between pt-2.5 text-[10px]">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 rounded font-medium bg-[#E3F4EB] text-[#123D30]">
                        React 19
                      </span>
                      <span className="px-1.5 py-0.5 rounded font-medium bg-[#F7F6F0] text-[#171916] border border-[#E7E8E1]">
                        Three.js
                      </span>
                    </div>
                    <span className="text-[#08C58A] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#08C58A] animate-ping" />
                      Available
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. STUDENT PROFILE CARD 2: MARCUS CHEN (Full-Stack / Systems) */}
              <div
                ref={studentCard2Ref}
                className="hero-story-card absolute bottom-4 sm:bottom-6 left-2 sm:left-6 z-15 w-[265px] sm:w-[300px] lg:w-[320px] will-change-transform"
              >
                <div
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className="w-full bg-white rounded-2xl p-4 border border-[#E7E8E1] shadow-[0_8px_30px_rgba(23,25,22,0.08)] hover:border-[#08C58A]/60 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=180&q=80"
                        alt="Marcus Chen"
                        className="w-10 h-10 rounded-xl object-cover border border-[#E7E8E1]"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#08C58A] border-2 border-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-[#171916] text-sm truncate">
                          Marcus Chen
                        </h4>
                        <span className="font-mono text-xs font-bold text-[#08C58A]">
                          $55/hr
                        </span>
                      </div>
                      <p className="text-[11px] text-[#777A72] truncate">
                        Systems &amp; Backend Engineering
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 p-2 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] text-[10px] text-[#777A72]">
                    <span className="font-semibold text-[#171916] block">
                      Real-Time WebSockets Engine
                    </span>
                    <span className="text-[10px]">High-throughput data telemetry pipeline</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[10px]">
                    <div className="flex gap-1">
                      <span className="px-1.5 py-0.5 rounded font-medium bg-[#E3F4EB] text-[#123D30]">
                        Go
                      </span>
                      <span className="px-1.5 py-0.5 rounded font-medium bg-[#F7F6F0] text-[#171916] border border-[#E7E8E1]">
                        PostgreSQL
                      </span>
                    </div>
                    <span className="text-[#777A72]">6 Projects completed</span>
                  </div>
                </div>
              </div>

              {/* 3. STUDENT PROFILE CARD 3: ARIA VANCE (Product Design) */}
              <div
                ref={studentCard3Ref}
                className="hero-story-card absolute top-2 right-2 sm:right-6 z-10 w-[240px] sm:w-[275px] lg:w-[295px] will-change-transform"
              >
                <div
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className="w-full bg-white/95 rounded-2xl p-3.5 border border-[#E7E8E1] shadow-[0_6px_24px_rgba(23,25,22,0.06)] hover:border-[#08C58A]/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
                      alt="Aria Vance"
                      className="w-9 h-9 rounded-xl object-cover border border-[#E7E8E1]"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#171916] text-xs truncate">Aria Vance</h4>
                      <p className="text-[10px] text-[#777A72] truncate">Product &amp; UI Systems</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-[10px] text-[#777A72]">
                    <span>Figma · Motion</span>
                    <span className="text-[#08C58A] font-medium">$60/hr</span>
                  </div>
                </div>
              </div>

              {/* 4. LARGE PROJECT CARD 1: CAMPUS EVENT WEB PLATFORM (Stage 3 & 4) */}
              <div
                ref={projectCard1Ref}
                className="hero-story-card absolute top-10 right-0 sm:right-4 z-20 w-[285px] sm:w-[325px] lg:w-[345px] will-change-transform"
              >
                <div
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className="w-full bg-[#123D30] text-white rounded-2xl p-4 border border-[#08C58A]/30 shadow-[0_16px_40px_rgba(18,61,48,0.28)] hover:border-[#08C58A] transition-all duration-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#08C58A] text-[#0A261D] tracking-wide uppercase">
                      Campus Event Platform
                    </span>
                    <span className="text-[10px] text-emerald-200/80 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> 3 wks
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-white text-sm sm:text-base leading-snug">
                      Build Interactive Festival Web App
                    </h4>
                    <p className="text-[11px] text-stone-300/80 pt-0.5 line-clamp-2">
                      Live university brief for annual campus showcase ticketing and live schedule.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/25 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-emerald-300 uppercase tracking-wider block font-bold">
                        Funded Escrow
                      </span>
                      <span className="text-base font-extrabold text-white">$3,600</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-1 rounded-md border border-[#08C58A]/40 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Scope
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[9px] pt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-stone-200">
                      React 19
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-stone-200">
                      Tailwind
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-stone-200">
                      Next.js
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. LARGE PROJECT CARD 2: SUPPLY CHAIN TELEMETRY (Stage 3 & 4) */}
              <div
                ref={projectCard2Ref}
                className="hero-story-card absolute bottom-4 sm:bottom-6 right-2 sm:right-6 z-15 w-[275px] sm:w-[310px] lg:w-[330px] will-change-transform"
              >
                <div
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className="w-full bg-[#181D1A] text-white rounded-2xl p-4 border border-[#2B3830] shadow-[0_12px_36px_rgba(0,0,0,0.22)] hover:border-[#08C58A]/50 transition-all duration-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E3F4EB] text-[#123D30]">
                      Startup Pipeline Brief
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">4 wks</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm leading-snug">
                      Supply Chain Telemetry Dashboard
                    </h4>
                    <p className="text-[10px] text-stone-400 pt-0.5 truncate">
                      Real-time metrics, WebSockets and Go service
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-extrabold text-white font-mono">$4,500</span>
                    <span className="text-[10px] text-[#08C58A] font-semibold">
                      Milestone Escrow
                    </span>
                  </div>
                </div>
              </div>

              {/* 6. FLOATING SKILL CHIPS */}
              <div
                ref={skillTag1Ref}
                className="hero-skill-chip absolute top-3 left-[32%] sm:left-[35%] z-25 pointer-events-none will-change-transform"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#171916] text-[10px] sm:text-[11px] font-extrabold border border-[#E7E8E1] shadow-md backdrop-blur-sm">
                  <Code2 className="w-3 h-3 text-[#08C58A]" />
                  <span>REACT 19</span>
                </div>
              </div>

              <div
                ref={skillTag2Ref}
                className="hero-skill-chip absolute top-[42%] left-[4%] sm:left-[8%] z-25 pointer-events-none will-change-transform"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F4EB] text-[#123D30] text-[10px] font-extrabold border border-[#08C58A]/30 shadow-sm backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-[#08C58A]" />
                  <span>UI / DESIGN SYSTEMS</span>
                </div>
              </div>

              <div
                ref={skillTag3Ref}
                className="hero-skill-chip absolute bottom-32 left-[32%] sm:left-[36%] z-25 pointer-events-none will-change-transform"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#171916] text-[10px] font-extrabold border border-[#E7E8E1] shadow-xs">
                  <Zap className="w-3 h-3 text-[#08C58A]" />
                  <span>AI &amp; LLMS</span>
                </div>
              </div>

              <div
                ref={skillTag4Ref}
                className="hero-skill-chip absolute top-[50%] right-[32%] sm:right-[36%] z-25 pointer-events-none will-change-transform"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#123D30] text-white text-[10px] font-bold border border-[#08C58A]/40 shadow-sm">
                  <span>✦ THREE.JS MOTION</span>
                </div>
              </div>

              {/* 7. STAGE 4 CONNECTION MATCH BADGES (Illuminating when matched) */}
              <div
                ref={matchBadge1Ref}
                className="hero-match-badge absolute top-[28%] left-[45%] -translate-x-1/2 z-30 pointer-events-none will-change-transform"
              >
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#08C58A] text-[#0A261D] text-[11px] font-extrabold shadow-[0_4px_20px_rgba(8,197,138,0.4)] border border-white/50 backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>MATCH CONFIRMED · 98% SKILL FIT</span>
                </div>
              </div>

              <div
                ref={matchBadge2Ref}
                className="hero-match-badge absolute bottom-[30%] left-[47%] -translate-x-1/2 z-30 pointer-events-none will-change-transform"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#123D30] text-[#08C58A] text-[10px] font-extrabold shadow-lg border border-[#08C58A]/50 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ESCROW PROTECTED · TEAM READY</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BOTTOM SCROLL DIRECTIVE FOOTER                                 */}
          {/* ============================================================== */}
          <div className="pt-2 flex items-center justify-between text-xs text-[#777A72] border-t border-[#E7E8E1]/80">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#08C58A]" />
              Scroll down to explore the student-project connection journey
            </span>
            <span className="hidden sm:inline-block font-mono text-[11px] text-[#171916]">
              Interactive Storyboard Experience
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
