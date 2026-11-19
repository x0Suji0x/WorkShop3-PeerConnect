import { ArrowRight, BriefcaseBusiness, UserRoundSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { authRoutes, routes } from '../../app/routes'

const paths = [
  {
    title: 'I’m looking for work',
    description:
      'Find projects that fit your skills, meet collaborators, and turn your work into experience you can show.',
    details: ['Explore scoped projects', 'Showcase your skills', 'Build with a team'],
    action: 'Browse projects',
    to: `${authRoutes.signup}?role=student`,
    icon: UserRoundSearch,
    tone: 'work',
  },
  {
    title: 'I’m hiring for work',
    description:
      'Review student profiles, compare skills and portfolios, and choose the people who fit your work.',
    details: ['Browse student applicants', 'Compare skills and work', 'Choose your best fit'],
    action: 'Choose an applicant',
    to: `${routes.profiles}?role=employer`,
    icon: BriefcaseBusiness,
    tone: 'hire',
  },
]

export function GetStartedPage() {
  return (
    <div className="peer-page-surface relative flex min-h-[calc(100svh-80px)] flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div className="peer-ambient-glow peer-glow-gold -left-28 top-0 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-rose -right-28 top-1/4 h-96 w-96 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-25" aria-hidden="true" />

      <main className="relative z-10 mx-auto w-full max-w-5xl">
        <header className="mx-auto max-w-3xl text-center">
          <span className="peer-eyebrow-pill">
            <span className="dot" aria-hidden="true" />
            FIND YOUR PLACE ON PEERCONNECT
          </span>
          <h1 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#171916] sm:text-5xl">
            What brings you here?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#626A64] sm:text-lg">
            Whether you’re ready to build or looking for the right people to build with, start with the path that fits you.
          </p>
        </header>

        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
          {paths.map(({ title, description, details, action, to, icon: Icon, tone }) => (
            <Link
              key={tone}
              to={to}
              className={`peer-card-glass group relative flex min-h-[330px] flex-col overflow-hidden rounded-[28px] border border-[#E5DED5] p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(79,58,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B4C] focus-visible:ring-offset-4 sm:p-8 ${tone === 'work' ? 'peer-card-glow-mint' : 'peer-card-glow-gold'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone === 'work' ? 'bg-[#E8F3EA] text-[#176B4C]' : 'bg-[#FBF0DC] text-[#9A6A24]'}`}>
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-[#E5DED5] bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#747B75]">
                  {tone === 'work' ? 'FOR BUILDERS' : 'FOR PROJECT OWNERS'}
                </span>
              </div>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.035em] text-[#171916] sm:text-3xl">
                {title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#626A64] sm:text-base">
                {description}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {details.map((detail) => (
                  <li key={detail} className="rounded-full border border-[#E8E1D8] bg-white/75 px-3 py-1.5 text-xs font-medium text-[#525A55]">
                    {detail}
                  </li>
                ))}
              </ul>

              <span className={`mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold ${tone === 'work' ? 'text-white' : 'text-[#176B4C]'}`}>
                <span className={`rounded-full px-5 py-3 transition-colors ${tone === 'work' ? 'bg-[#176B4C] group-hover:bg-[#12583E]' : 'border border-[#176B4C]/25 bg-white group-hover:bg-[#E8F3EA]'}`}>
                  {action}
                </span>
                <span className={`flex h-11 w-11 items-center justify-center rounded-full transition-transform group-hover:translate-x-1 ${tone === 'work' ? 'bg-[#176B4C]' : 'bg-[#E8F3EA]'}`}>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[#747B75]">
          Just looking around?{' '}
          <Link to={routes.home} className="font-semibold text-[#176B4C] underline decoration-[#176B4C]/30 underline-offset-4 hover:decoration-[#176B4C]">
            Back to PeerConnect
          </Link>
        </p>
      </main>
    </div>
  )
}
