import { useEffect, useRef, type ReactNode } from 'react'
import type Lenis from 'lenis'
import { ScrollTrigger } from '../../lib/gsap'
import { SmoothScrollContext } from './SmoothScrollContext'

export interface SmoothScrollProviderProps {
  children: ReactNode
}

/**
 * Keeps a single place for scroll behavior. Native browser scrolling is used
 * deliberately: it responds immediately to input and avoids a second
 * animation loop competing with scroll-linked homepage motion.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Let ScrollTrigger measure once after the layout is ready, then only on
    // normal refresh events. There is no custom scroll animation loop.
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
    }
  }, [])

  return (
    <SmoothScrollContext.Provider value={{ lenisRef }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
