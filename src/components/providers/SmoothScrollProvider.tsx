import { useEffect, useRef, type ReactNode } from 'react'
import { ScrollTrigger } from '../../lib/gsap'
import { SmoothScrollContext } from './SmoothScrollContext'

export interface SmoothScrollProviderProps {
  children: ReactNode
}

/**
 * Manages smooth scroll coordination while enabling native CSS scroll snapping.
 * Ensures zero scroll hijacking, allows native trackpad/touch/mousewheel snap,
 * and synchronizes GSAP ScrollTrigger transitions.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<any | null>(null)

  useEffect(() => {
    // Provide a lightweight mock/wrapper interface for lenisRef so legacy consumers don't break
    lenisRef.current = {
      scrollTo: (target: string | number | HTMLElement) => {
        if (typeof target === 'string') {
          const el = document.querySelector(target)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return
          }
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        window.scrollTo({
          top: typeof target === 'number' ? target : 0,
          behavior: 'smooth',
        })
      },
    }

    // Refresh ScrollTrigger so triggers align with viewport
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      lenisRef.current = null
    }
  }, [])

  return (
    <SmoothScrollContext.Provider value={{ lenisRef }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
