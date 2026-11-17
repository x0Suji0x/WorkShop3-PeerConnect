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
    }
  }

  return {
    getLenis: () => lenisRef.current,
    lenisRef,
    scrollTo,
  }
}
