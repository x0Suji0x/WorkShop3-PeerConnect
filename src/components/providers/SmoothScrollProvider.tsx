import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { SmoothScrollContext } from './SmoothScrollContext'

export interface SmoothScrollProviderProps {
  children: ReactNode
}

/**
 * Initializes and manages Lenis smooth scrolling instance
 * with GSAP ScrollTrigger synchronization.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      ScrollTrigger.refresh()
      return
    }

    const lenisInstance = new Lenis({
      // A snappy duration keeps input feeling direct and natural instead of floaty/laggy.
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
    })

    lenisRef.current = lenisInstance

    // Sync Lenis scroll progress with ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update)

    // Pipe GSAP ticker updates into Lenis requestAnimationFrame
    const tickerUpdate = (time: number) => {
      lenisInstance.raf(time * 1000)
    }

    gsap.ticker.add(tickerUpdate)
    // Enable healthy lag smoothing so frame drops don't cause sudden animation jumps
    gsap.ticker.lagSmoothing(500, 33)

    // Ensure ScrollTrigger measures the document correctly once Lenis attaches
    const refreshFrame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    const handleLoad = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('load', handleLoad)

    return () => {
      window.cancelAnimationFrame(refreshFrame)
      window.removeEventListener('load', handleLoad)
      gsap.ticker.remove(tickerUpdate)
      lenisInstance.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <SmoothScrollContext.Provider value={{ lenisRef }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
