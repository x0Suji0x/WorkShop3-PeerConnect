import { ArrowUpRight, Compass, Handshake, UsersRound } from 'lucide-react'

const features = [
  {
    icon: UsersRound,
    title: 'Discover student talent',
    description:
      'Find builders through their skills, portfolios, and the work they are proud to share.',
  },
  {
    icon: Compass,
    title: 'Explore real projects',
    description:
      'Browse clear briefs from founders, small businesses, and creators looking for collaborators.',
  },
  {
    icon: Handshake,
    title: 'Build with confidence',
    description:
      'Set expectations with shared goals, milestones, and feedback from kickoff to handoff.',
  },
]

export function PeerConnectIntroSection() {
  return (
    <section
      id="about"
      className="bg-gradient-to-b from-[#EAF4EC] via-[#F4F8F3] to-white py-20 text-[#171916] sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#176B4C]/15 bg-white/75 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-[#315448]">
            <span className="h-2 w-2 rounded-full bg-[#08A875]" aria-hidden="true" />
            ABOUT PEERCONNECT
          </div>
          <h2 className="text-3xl font-black leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            One place for student talent and meaningful projects.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#525A55] sm:text-lg">
            PeerConnect brings student builders and project owners together to find a fit, set a clear
            plan, and make useful work side by side.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16">
          {features.map(({ icon: Icon, title, description }, index) => (
            <article
              key={title}
              className="group rounded-3xl border border-[#DFE9E1] bg-white/90 p-6 shadow-[0_8px_28px_rgba(35,65,48,0.05)] transition-transform duration-300 hover:-translate-y-1 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F3EA] text-[#176B4C]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold tracking-[0.12em] text-[#8A968E]">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-7 text-xl font-bold tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#66736C]">{description}</p>
              <ArrowUpRight
                aria-hidden="true"
                className="mt-6 h-4 w-4 text-[#176B4C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
