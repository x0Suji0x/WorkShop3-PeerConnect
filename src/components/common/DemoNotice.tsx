import type { ReactNode } from 'react'

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <aside className="rounded-xl border border-[#E9D9B7] bg-[#FBF5E8] px-4 py-3 text-xs leading-relaxed text-[#765820]">
      {children}
    </aside>
  )
}
