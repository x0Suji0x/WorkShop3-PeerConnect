import type { ReactNode } from 'react'

export interface PageHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeading({ eyebrow, title, description, actions }: PageHeadingProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#E7E8E1] pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#08A876]">{eyebrow}</p>}
        <h1 className="text-3xl font-black tracking-tight text-[#171916] sm:text-4xl">{title}</h1>
        {description && <p className="text-sm leading-relaxed text-[#777A72] sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
