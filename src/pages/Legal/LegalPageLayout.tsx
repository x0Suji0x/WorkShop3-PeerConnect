import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '../../app/routes'

export function LegalPageLayout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <main className="peer-page-surface min-h-[calc(100svh-80px)] px-4 py-14 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-3xl border border-[#E7E8E1] bg-white/85 p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#176B4C]">PeerConnect policy draft</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171916] sm:text-4xl">{title}</h1>
        <p className="mt-5 rounded-xl border border-[#E9D9B7] bg-[#FBF5E8] px-4 py-3 text-sm font-semibold text-[#765820]">
          Draft: pending legal review.
        </p>
        <div className="mt-8 space-y-7 text-sm leading-7 text-[#525A55]">{children}</div>
        <p className="mt-10 border-t border-[#E7E8E1] pt-5 text-sm text-[#777A72]">
          <Link to={routes.home} className="font-semibold text-[#176B4C] underline underline-offset-4">Return to PeerConnect</Link>
        </p>
      </article>
    </main>
  )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-[#171916]">{title}</h2>
      <p className="mt-2">{children}</p>
    </section>
  )
}
