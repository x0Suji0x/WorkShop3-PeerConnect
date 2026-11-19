import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from '../../app/routes'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { HeroHeadline } from './hero/HeroHeadline'
import { HeroConnectionScene } from './hero/HeroConnectionScene'

export function HeroSection() {
  const trackRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const [activeStage, setActiveStage] = useState(0)

  useGSAP(() => {
    const media = gsap.matchMedia()
    const showStaticHero = () => {
      setActiveStage(0)
      gsap.set('.hero-copy-stage-0', { autoAlpha: 1, y: 0 })
      gsap.set('.hero-copy-stage-1, .hero-copy-stage-2', { autoAlpha: 0, y: 20 })
      gsap.set('.hero-transition-glow', { autoAlpha: 0, y: 28 })
      gsap.set('.hero-cinematic-scene', { '--hero-fade-start': '100%', '--hero-fade-mid': '100%', '--hero-fade-soft': '100%' })
      gsap.set('.hero-student-right', { autoAlpha: 1, xPercent: 5, y: 0, scale: 1 })
      gsap.set('.hero-student-left', { autoAlpha: 1, xPercent: -105, y: 0, scale: 1 })
    }

    media.add('(prefers-reduced-motion: reduce)', showStaticHero)
    media.add('(prefers-reduced-motion: no-preference)', () => {
      setActiveStage(0)
      gsap.set('.hero-copy-stage-0', { autoAlpha: 1, y: 0 })
      gsap.set(['.hero-copy-stage-1', '.hero-copy-stage-2'], { autoAlpha: 0, y: 20 })
      gsap.set('.hero-transition-glow', { autoAlpha: 0, y: 28 })
      gsap.set('.hero-cinematic-scene', { '--hero-fade-start': '100%', '--hero-fade-mid': '100%', '--hero-fade-soft': '100%' })
      gsap.set('.hero-student-right', { autoAlpha: 0, xPercent: -50, y: 24, scale: 0.93 })
      gsap.set('.hero-student-left', { autoAlpha: 0, xPercent: -50, y: 24, scale: 0.93 })

      const story = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
      })
      story
        // Bring the side students in once as the opening headline lands.
        .to('.hero-student-right', { autoAlpha: 1, xPercent: 5, y: 0, scale: 1, duration: 0.85, ease: 'power2.out' }, 0.45)
        .to('.hero-student-left', { autoAlpha: 1, xPercent: -105, y: 0, scale: 1, duration: 0.85, ease: 'power2.out' }, 1.1)
        // Cycle the existing copy independently of the visitor's scroll position.
        .call(() => setActiveStage(1), [], 3.8)
        .to('.hero-copy-stage-0', { autoAlpha: 0, y: -16, duration: 0.42 }, 3.8)
        .to('.hero-copy-stage-1', { autoAlpha: 1, y: 0, duration: 0.42 }, 3.8)
        .call(() => setActiveStage(2), [], 7.2)
        .to('.hero-copy-stage-1', { autoAlpha: 0, y: -16, duration: 0.42 }, 7.2)
        .to('.hero-copy-stage-2', { autoAlpha: 1, y: 0, duration: 0.42 }, 7.2)
    })

    const scene = trackRef.current?.querySelector('.hero-cinematic-scene')
    const glow = trackRef.current?.querySelector('.hero-transition-glow')
    if (scene && glow) {
      const clearTransition = {
        '--hero-fade-start': '100%',
        '--hero-fade-mid': '100%',
        '--hero-fade-soft': '100%',
      }
      const revealedTransition = {
        '--hero-fade-start': '84%',
        '--hero-fade-mid': '92%',
        '--hero-fade-soft': '96%',
      }
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduceMotion) {
        ScrollTrigger.create({
          trigger: '#hero',
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 0.3)}`,
          onEnter: () => {
            scene.classList.add('is-transition-active')
            gsap.set(scene, revealedTransition)
            gsap.set(glow, { autoAlpha: 0.52, y: 0 })
          },
          onEnterBack: () => {
            scene.classList.add('is-transition-active')
            gsap.set(scene, revealedTransition)
            gsap.set(glow, { autoAlpha: 0.52, y: 0 })
          },
          onLeaveBack: () => {
            scene.classList.remove('is-transition-active')
            gsap.set(scene, clearTransition)
            gsap.set(glow, { autoAlpha: 0, y: 28 })
          },
        })
      } else {
        gsap.timeline({
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * 0.3)}`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              scene.classList.toggle('is-transition-active', self.progress > 0.001)
            },
          },
        })
          .fromTo(scene, clearTransition, { ...revealedTransition, ease: 'none' }, 0)
          .fromTo(glow, { autoAlpha: 0, y: 28 }, { autoAlpha: 0.52, y: 0, ease: 'none' }, 0)
      }
    }

    return () => {
      scene?.classList.remove('is-transition-active')
      media.revert()
    }
  }, { scope: trackRef })

  return (
    <section id="hero" ref={trackRef} className="hero-scroll-track" aria-label="PeerConnect introduction">
      <div className="hero-story-stage">
        <HeroConnectionScene />
        <HeroHeadline activeStage={activeStage} onExploreClick={() => navigate(routes.getStarted)} />
      </div>
    </section>
  )
}
