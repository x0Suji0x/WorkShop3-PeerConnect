import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { HeroHeadline } from './hero/HeroHeadline'
import { HeroConnectionScene } from './hero/HeroConnectionScene'

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const sceneContainerRef = useRef<HTMLDivElement>(null)

  // Card & Scene Element Refs
  const studentCard1Ref = useRef<HTMLDivElement>(null) // Primary: Sofia Rodriguez
  const studentCard2Ref = useRef<HTMLDivElement>(null) // Secondary: Marcus Chen
  const projectCardRef = useRef<HTMLDivElement>(null) // Campus Event Platform
  const skillTag1Ref = useRef<HTMLDivElement>(null) // REACT 19
  const skillTag2Ref = useRef<HTMLDivElement>(null) // UI / DESIGN SYSTEMS
  const skillTag3Ref = useRef<HTMLDivElement>(null) // TYPESCRIPT
  const matchBadgeRef = useRef<HTMLDivElement>(null) // Match Badge
  const ctaExploreRef = useRef<HTMLButtonElement>(null)

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

        // Accessible fallback for reduced motion: clean static presentation of Stage 4
        if (reduceMotion) {
          gsap.set('.connection-path-scene', { strokeDashoffset: 0, opacity: 1 })
          gsap.set(
            [
              studentCard1Ref.current,
              studentCard2Ref.current,
              projectCardRef.current,
              matchBadgeRef.current,
              skillTag1Ref.current,
              skillTag2Ref.current,
              skillTag3Ref.current,
            ],
            { opacity: 1, scale: 1, x: 0, y: 0 },
          )
          return
        }

        // =========================================================================
        // DESKTOP: FULL IMMERSIVE SCROLL-DRIVEN 4-STAGE STORYTELLING (2.2 Viewports)
        // =========================================================================
        if (isDesktop && heroRef.current) {
          // Initial Offsets (Stage 1 Entry)
          gsap.set(studentCard1Ref.current, {
            x: -200,
            y: 80,
            scale: 0.85,
            opacity: 0,
          })
          gsap.set(studentCard2Ref.current, {
            x: -120,
            y: 160,
            scale: 0.85,
            opacity: 0,
          })
          gsap.set(projectCardRef.current, {
            x: 360,
            y: 0,
            scale: 0.8,
            opacity: 0,
          })
          gsap.set([skillTag1Ref.current, skillTag2Ref.current, skillTag3Ref.current], {
            scale: 0.6,
            opacity: 0,
          })
          gsap.set(matchBadgeRef.current, {
            scale: 0.5,
            opacity: 0,
          })
          gsap.set('.connection-path-scene', {
            strokeDashoffset: 100,
            opacity: 0,
          })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 80px',
              end: '+=850', // Calibrated ~1 viewport height to prevent scroll trapping
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress
                if (p < 0.25) setActiveStage(1)
                else if (p < 0.5) setActiveStage(2)
                else if (p < 0.75) setActiveStage(3)
                else setActiveStage(4)
              },
            },
          })

          // -----------------------------------------------------------------------
          // STAGE 1: TALENT (t: 0 -> 2.5)
          // Large student profile cards enter the scene. Skills and portfolios reveal.
          // -----------------------------------------------------------------------
          tl.to(
            studentCard1Ref.current,
            { x: -25, y: 0, scale: 1.0, opacity: 1, duration: 2.2, ease: 'power2.out' },
            0.3,
          )
          tl.to(
            studentCard2Ref.current,
            { x: -40, y: 20, scale: 0.95, opacity: 1, duration: 2.4, ease: 'power2.out' },
            0.5,
          )
          tl.to(
            [skillTag1Ref.current, skillTag2Ref.current, skillTag3Ref.current],
            { scale: 1, opacity: 1, duration: 1.6, stagger: 0.2, ease: 'back.out(1.5)' },
            0.8,
          )

          // -----------------------------------------------------------------------
          // STAGE 2: DISCOVERY (t: 2.5 -> 5.0)
          // Sofia's card expands significantly into primary focal point.
          // Marcus's card steps back into layered depth.
          // -----------------------------------------------------------------------
          tl.to(
            studentCard1Ref.current,
            {
              x: 40,
              y: -15,
              scale: 1.15,
              boxShadow: '0 26px 60px rgba(8,197,138,0.22)',
              zIndex: 30,
              duration: 2.5,
              ease: 'power2.inOut',
            },
            2.5,
          )
          tl.to(
            studentCard2Ref.current,
            {
              x: -45,
              y: 45,
              scale: 0.88,
              opacity: 0.55,
              zIndex: 10,
              duration: 2.5,
              ease: 'power2.inOut',
            },
            2.5,
          )

          // -----------------------------------------------------------------------
          // STAGE 3: OPPORTUNITY (t: 5.0 -> 7.5)
          // Project opportunity card sweeps in prominently from the right.
          // Sofia's card shifts to align directly opposite the project card.
          // -----------------------------------------------------------------------
          tl.to(
            projectCardRef.current,
            {
              x: 20,
              y: 0,
              scale: 1.05,
              opacity: 1,
              duration: 2.5,
              ease: 'power2.out',
            },
            5.0,
          )
          tl.to(
            studentCard1Ref.current,
            {
              x: -120,
              y: 0,
              scale: 1.0,
              zIndex: 20,
              duration: 2.5,
              ease: 'power2.inOut',
            },
            5.2,
          )
          tl.to(
            studentCard2Ref.current,
            {
              x: -60,
              y: 110,
              scale: 0.82,
              opacity: 0.5,
              duration: 2.5,
              ease: 'power2.inOut',
            },
            5.2,
          )

          // -----------------------------------------------------------------------
          // STAGE 4: CONNECTION (t: 7.5 -> 10.0)
          // Animated connection path draws between student card and project card.
          // Match badge illuminates and CTA gains focus glow.
          // -----------------------------------------------------------------------
          tl.to(
            [studentCard1Ref.current, projectCardRef.current],
            {
              x: (index) => (index === 0 ? -90 : 50),
              y: 0,
              duration: 2.0,
              ease: 'power2.out',
            },
            7.5,
          )
          tl.to(
            '.connection-path-scene',
            {
              strokeDashoffset: 0,
              opacity: 1,
              duration: 2.2,
              ease: 'power2.inOut',
            },
            7.6,
          )
          tl.to(
            matchBadgeRef.current,
            {
              scale: 1,
              opacity: 1,
              duration: 1.6,
              ease: 'back.out(1.8)',
            },
            8.0,
          )
          if (ctaExploreRef.current) {
            tl.to(
              ctaExploreRef.current,
              {
                scale: 1.03,
                boxShadow: '0 8px 30px rgba(8,197,138,0.45)',
                duration: 1.6,
                ease: 'power2.out',
              },
              8.5,
            )
          }
        }

        // =========================================================================
        // TABLET: TAILORED 4-STAGE TIMELINE (Pin +=1100px, Scrub: 0.8)
        // =========================================================================
        if (isTablet && heroRef.current) {
          gsap.set(studentCard1Ref.current, { x: -60, opacity: 0.9, scale: 0.9 })
          gsap.set(studentCard2Ref.current, { x: -40, y: 30, opacity: 0.8, scale: 0.85 })
          gsap.set(projectCardRef.current, { x: 180, opacity: 0, scale: 0.85 })
          gsap.set('.connection-path-scene', { strokeDashoffset: 100, opacity: 0 })
          gsap.set(matchBadgeRef.current, { opacity: 0, scale: 0.6 })

          const tlTablet = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 80px',
              end: '+=500',
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress
                if (p < 0.25) setActiveStage(1)
                else if (p < 0.5) setActiveStage(2)
                else if (p < 0.75) setActiveStage(3)
                else setActiveStage(4)
              },
            },
          })

          // Stage 1 -> 2: Sofia expands
          tlTablet.to(studentCard1Ref.current, { scale: 1.05, x: 0, opacity: 1, duration: 2 }, 2.5)

          // Stage 2 -> 3: Project enters
          tlTablet.to(studentCard1Ref.current, { x: -70, scale: 0.95, duration: 2 }, 5.0)
          tlTablet.to(projectCardRef.current, { x: 30, opacity: 1, scale: 0.95, duration: 2 }, 5.2)

          // Stage 3 -> 4: Path draws & badge illuminates
          tlTablet.to('.connection-path-scene', { strokeDashoffset: 0, opacity: 1, duration: 2 }, 7.5)
          tlTablet.to(matchBadgeRef.current, { scale: 1, opacity: 1, duration: 1.5 }, 8.0)
        }

        // =========================================================================
        // MOBILE: CLEAN VERTICAL PRESENTATION (No Pinning, Never Traps User)
        // =========================================================================
        if (isMobile && heroRef.current) {
          gsap.set([studentCard1Ref.current, projectCardRef.current], {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
          })
          gsap.set(studentCard2Ref.current, { display: 'none' })
          gsap.set('.connection-path-scene', { strokeDashoffset: 0, opacity: 1 })
          gsap.set(matchBadgeRef.current, { opacity: 1, scale: 1 })
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
      {/* Background ambient lighting */}
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

      {/* Main Hero Container (75–90vh on desktop) */}
      <div
        ref={sceneContainerRef}
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col justify-center py-6 sm:py-8 lg:py-6"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
            {/* LEFT: DOMINANT EDITORIAL TYPOGRAPHY & CTAS */}
            <div className="lg:col-span-5 xl:col-span-5">
              <HeroHeadline
                activeStage={activeStage}
                onExploreClick={() => scrollTo('#talent')}
                onPostProjectClick={() => scrollTo('#projects')}
                ctaExploreRef={ctaExploreRef}
              />
            </div>

            {/* RIGHT: SPACIOUS VISUAL MARKETPLACE SCENE */}
            <div className="lg:col-span-7 xl:col-span-7 relative w-full pt-4 lg:pt-0">
              <HeroConnectionScene
                studentCard1Ref={studentCard1Ref}
                studentCard2Ref={studentCard2Ref}
                projectCardRef={projectCardRef}
                skillTag1Ref={skillTag1Ref}
                skillTag2Ref={skillTag2Ref}
                skillTag3Ref={skillTag3Ref}
                matchBadgeRef={matchBadgeRef}
                onCardMouseMove={handleCardMouseMove}
                onCardMouseLeave={handleCardMouseLeave}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
