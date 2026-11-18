import { useContext } from 'react'
import { SmoothScrollContext } from '../components/providers/SmoothScrollContext'

/**
 * Access the active smooth scroll instance anywhere inside the provider tree.
 */
export function useSmoothScroll() {
  const { lenisRef } = useContext(SmoothScrollContext)

  const scrollTo = (
    target: number | string | HTMLElement,
    options?: Parameters<NonNullable<typeof lenisRef.current>['scrollTo']>[1],
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options)
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const behavior = prefersReducedMotion ? 'auto' : 'smooth'

    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior })
      return
    }

    const element = typeof target === 'string'
      ? document.querySelector<HTMLElement>(target)
      : target

    if (element) {
      const headerOffset = 80
      const top = element.getBoundingClientRect().top + window.scrollY - headerOffset
      window.scrollTo({ top, behavior })
    }
  }

  return {
    getLenis: () => lenisRef.current,
    lenisRef,
    scrollTo,
  }
}
