import { useContext } from 'react'
import { SmoothScrollContext } from '../components/providers/SmoothScrollContext'

/**
 * Access the smooth scroll helper anywhere inside the provider tree.
 * Respects native CSS scroll-snapping and provides smooth navigation to section anchors.
 */
export function useSmoothScroll() {
  const { lenisRef } = useContext(SmoothScrollContext)

  const scrollTo = (
    target: number | string | HTMLElement,
    _options?: any,
  ) => {
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

    if (lenisRef.current?.scrollTo) {
      lenisRef.current.scrollTo(target)
    } else {
      window.scrollTo({
        top: typeof target === 'number' ? target : 0,
        behavior: 'smooth',
      })
    }
  }

  return {
    getLenis: () => lenisRef.current,
    lenisRef,
    scrollTo,
  }
}
