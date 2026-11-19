import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { DemoModeBanner } from './DemoModeBanner'

export interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171916] selection:bg-[#08C58A]/25 selection:text-[#0A261D] font-sans antialiased">
      <a href="#main-content" className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-[#123D30] px-4 py-2 text-sm font-bold text-white focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-[#08C58A] focus:ring-offset-2">
        Skip to content
      </a>
      <DemoModeBanner />
      <Navbar />
      <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
