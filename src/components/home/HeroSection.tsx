import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { HeroHeadline } from './hero/HeroHeadline'
import { HeroConnectionScene } from './hero/HeroConnectionScene'

export function HeroSection() {
  const trackRef = useRef<HTMLElement>(null)
  const { scrollTo } = useSmoothScroll()
  const [activeStage, setActiveStage] = useState(0)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: reduce)', () => { setActiveStage(2) })
    media.add('(prefers-reduced-motion: no-preference)', () => {
      setActiveStage(0)
      gsap.set('.hero-copy-stage-0', { autoAlpha: 1, y: 0 })
      gsap.set(['.hero-copy-stage-1', '.hero-copy-stage-2'], { autoAlpha: 0, y: 20 })
      gsap.set('.hero-transition-glow', { autoAlpha: 0, y: 28 })
      gsap.set('.hero-cinematic-scene', { '--scene-fade-radius': '200%' })
      // Their final positions flank the center. Start inward, behind her foreground layer.
      gsap.set('.hero-student-right', { autoAlpha: 0, xPercent: -50, y: 24, scale: 0.93 })
      gsap.set('.hero-student-left', { autoAlpha: 0, xPercent: -50, y: 24, scale: 0.93 })
      let stage = 0
      const story = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate() {
          const progress = this.progress()
          const next = progress < 0.3 ? 0 : progress < 0.65 ? 1 : 2
          if (next !== stage) { stage = next; setActiveStage(next) }
          const fadeProgress = gsap.utils.clamp(0, 1, (progress - 0.72) / 0.28)
          trackRef.current?.querySelector<HTMLElement>('.hero-cinematic-scene')?.style.setProperty('--scene-fade-radius', `${200 - 100 * fadeProgress}%`)
        },
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          // Let the three hero story beats settle into place; the rest of the page stays free scroll.
          snap: {
            snapTo: [0, 0.3, 0.65, 1],
            delay: 0.12,
            duration: { min: 0.16, max: 0.38 },
            ease: 'power1.inOut',
          },
          invalidateOnRefresh: true,
        },
      })
      story
        .to('.hero-copy-stage-0', { autoAlpha: 0, y: -16, duration: 0.08 }, 0.25)
        .to('.hero-copy-stage-1', { autoAlpha: 1, y: 0, duration: 0.1 }, 0.3)
        .to('.hero-student-right', { autoAlpha: 1, xPercent: 5, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' }, 0.3)
        .to('.hero-copy-stage-1', { autoAlpha: 0, y: -16, duration: 0.08 }, 0.6)
        .to('.hero-copy-stage-2', { autoAlpha: 1, y: 0, duration: 0.1 }, 0.65)
        .to('.hero-student-left', { autoAlpha: 1, xPercent: -105, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' }, 0.65)
        .to('.hero-transition-glow', { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power1.out' }, 0.8)
        .to('.hero-scroll-hint', { autoAlpha: 0, duration: 0.08 }, 0.84)
    })
    return () => media.revert()
  }, { scope: trackRef })

  return (
    <section id="hero" ref={trackRef} className="hero-scroll-track" aria-label="PeerConnect introduction">
      <div className="hero-story-stage">
        <HeroConnectionScene />
        <HeroHeadline activeStage={activeStage} onExploreClick={() => scrollTo('#about')} />
      </div>
    </section>
  )
}
