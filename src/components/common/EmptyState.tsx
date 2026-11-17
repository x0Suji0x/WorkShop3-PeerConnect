import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  icon?: LucideIcon
}

export function EmptyState({ title, description, action, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D1D2C9] bg-[#F7F6F0] px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E3F4EB] text-[#123D30]">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-base font-bold text-[#171916]">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-[#777A72]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
