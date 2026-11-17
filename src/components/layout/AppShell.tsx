import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { SectionProgress } from '../navigation/SectionProgress'

export interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#090A0F] text-[#F4F3EE] selection:bg-[#D4FF00] selection:text-[#090A0F] font-sans antialiased">
      <Navbar />
      <SectionProgress />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  )
}
