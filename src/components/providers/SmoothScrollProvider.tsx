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
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
      syncTouch: false,
    })

    lenisRef.current = lenisInstance

    // Sync Lenis scroll progress with ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update)

    // Pipe GSAP ticker updates into Lenis requestAnimationFrame
    const tickerUpdate = (time: number) => {
      lenisInstance.raf(time * 1000)
    }

    gsap.ticker.add(tickerUpdate)
    // Enable healthy lagSmoothing so frame drops don't cause animation jumps
    gsap.ticker.lagSmoothing(500, 33)

    // Ensure ScrollTrigger measures the document correctly once Lenis attaches
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    const handleLoad = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('load', handleLoad)

    return () => {
      clearTimeout(refreshTimer)
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
