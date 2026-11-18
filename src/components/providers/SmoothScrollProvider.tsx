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
    // Native scrolling is more responsive on touch-first devices. Lenis enhances
    // precision-pointer devices only, and never overrides a motion preference.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const hasPrecisionPointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    ).matches

    if (prefersReducedMotion || !hasPrecisionPointer) {
      ScrollTrigger.refresh()
      return
    }

    const lenisInstance = new Lenis({
      // A shorter duration keeps wheel input feeling direct instead of floaty.
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    })

    lenisRef.current = lenisInstance

    // Sync Lenis scroll progress with ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update)

    // Pipe GSAP ticker updates into Lenis requestAnimationFrame
    const tickerUpdate = (time: number) => {
      lenisInstance.raf(time * 1000)
    }

    gsap.ticker.add(tickerUpdate)

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
      lenisInstance.off('scroll', ScrollTrigger.update)
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
