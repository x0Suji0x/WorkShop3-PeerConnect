import type { ReactNode } from 'react'

export interface PageHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeading({ eyebrow, title, description, actions }: PageHeadingProps) {
  return (
    <div className="flex flex-col gap-4 peer-divider-fade pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        {eyebrow && (
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-[#176B4C]/15 bg-white/85 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-[#315448] shadow-2xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#08A875]" aria-hidden="true" />
            {eyebrow.toUpperCase()}
          </div>
        )}
        <h1 className="text-3xl font-black tracking-tight text-[#171916] sm:text-4xl">{title}</h1>
        {description && <p className="text-sm leading-relaxed text-[#777A72] sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
