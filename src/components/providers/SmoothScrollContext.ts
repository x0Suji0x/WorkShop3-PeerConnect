import { createContext, type RefObject } from 'react'
import type Lenis from 'lenis'

export interface SmoothScrollContextValue {
  lenisRef: RefObject<Lenis | null>
}

export const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenisRef: { current: null },
})
