import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { HeroHeadline } from './hero/HeroHeadline'
import { HeroConnectionScene } from './hero/HeroConnectionScene'

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const ctaExploreRef = useRef<HTMLButtonElement>(null)
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    // If user prefers reduced motion, leave elements in natural state
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 1. Eyebrow badge reveals
      tl.fromTo(
        '.hero-eyebrow',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.1,
      )

      // 2. Headline title lines reveal in a tight staggered sequence
      tl.fromTo(
        '.hero-title-line',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
        0.2,
      )

      // 3. Supporting copy fades in
      tl.fromTo(
        '.hero-subtext',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55 },
        0.5,
      )

      // 4. CTAs appear
      tl.fromTo(
        '.hero-ctas',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.65,
      )

      // 5. Trust / community row appears
      tl.fromTo(
        '.hero-trust',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.8,
      )

      // 6. Right side student artwork reveals with subtle scale and fade
      tl.fromTo(
        '.hero-student-artwork',
        { opacity: 0, scale: 0.95, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8 },
        0.35,
      )

      // 7. Decorative hand-drawn stroke draws in
      tl.fromTo(
        '.hero-drawn-stroke',
        { strokeDashoffset: 140, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0.75,
      )
    }, heroRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative bg-[#FAF8F5] text-[#171916] overflow-hidden border-b border-[#E7E8E1] w-full"
    >
      {/* Subtle ambient lighting matching warm background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#08C58A]/8 rounded-full blur-[140px] -z-0"
      />

      {/* Main Hero Container */}
      <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center py-10 sm:py-14 lg:py-12">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
            {/* LEFT: EDITORIAL TYPOGRAPHY, BUTTONS & TRUST ROW */}
            <div className="lg:col-span-5 xl:col-span-5">
              <HeroHeadline
                onExploreClick={() => scrollTo('#projects')}
                onFindTalentClick={() => scrollTo('#talent')}
                ctaExploreRef={ctaExploreRef}
              />
            </div>

            {/* RIGHT: COMPLETE STUDENT COMMUNITY ARTWORK COMPOSITION */}
            <div className="lg:col-span-7 xl:col-span-7 relative w-full flex justify-center lg:justify-end">
              <HeroConnectionScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
