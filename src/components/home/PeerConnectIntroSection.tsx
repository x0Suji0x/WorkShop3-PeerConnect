import { ArrowUpRight, Compass, Handshake, UsersRound } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'

const features = [
  {
    icon: UsersRound,
    title: 'Discover student talent',
    highlight: 'talent',
    description:
      'Find builders through their skills, portfolios, and the work they are proud to share.',
    detail: 'Profiles · Portfolios · Skills',
  },
  {
    icon: Compass,
    title: 'Explore real projects',
    highlight: 'real projects',
    description:
      'Browse clear briefs from founders, small businesses, and creators looking for collaborators.',
    detail: 'Clear briefs · Shared interests',
  },
  {
    icon: Handshake,
    title: 'Build with confidence',
    highlight: 'confidence',
    description:
      'Set expectations with shared goals, milestones, and feedback from kickoff to handoff.',
    detail: 'Goals · Milestones · Feedback',
  },
]

export function PeerConnectIntroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [openPreview, setOpenPreview] = useState<number | null>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.about-feature-card')
    gsap.fromTo(cards, { autoAlpha: 0, y: 22 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.65,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section py-20 text-[#171916] sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#176B4C]/15 bg-white/75 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-[#315448]">
            <span className="h-2 w-2 rounded-full bg-[#08A875]" aria-hidden="true" />
            ABOUT PEERCONNECT
          </div>
          <h2 className="about-heading text-3xl leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
            One place for student talent and <em>meaningful projects.</em>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#525A55] sm:text-lg">
            PeerConnect brings student builders and project owners together to find a fit, set a clear
            plan, and make useful work side by side.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-5 md:grid-cols-3 lg:mt-16">
          {features.map(({ icon: Icon, title, highlight, description, detail }, index) => (
            <article
              key={title}
              data-tone={index + 1}
              data-preview-open={openPreview === index}
              onPointerMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`)
                event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`)
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty('--pointer-x', '50%')
                event.currentTarget.style.setProperty('--pointer-y', '50%')
              }}
              className="about-feature-card group sm:p-7"
            >
              <span className="about-feature-number" aria-hidden="true">0{index + 1}</span>
              <div className="relative z-[1] flex h-full flex-col">
                <div className="flex items-center">
                  <span className="about-feature-icon">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <span className="about-feature-kicker mt-6">{['TALENT', 'OPPORTUNITY', 'COLLABORATION'][index]}</span>
                <h3 className="about-feature-title mt-2">
                  {title.split(highlight)[0]}<span>{highlight}</span>{title.split(highlight)[1]}
                </h3>
                <p className="about-feature-description mt-3">{description}</p>
                <div className="about-feature-detail mt-auto pt-7">
                  <span className="about-feature-detail-dot" aria-hidden="true" />
                  {detail}
                  <button
                    type="button"
                    className="about-feature-preview-trigger ml-auto"
                    aria-expanded={openPreview === index}
                    onClick={() => setOpenPreview(openPreview === index ? null : index)}
                  >
                    {openPreview === index ? 'Close' : 'View example'}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="about-feature-preview" aria-hidden={openPreview !== index}>
                {index === 0 && (
                  <>
                    <div className="about-feature-preview-top"><span>STUDENT PROFILE</span><span>AVAILABLE</span></div>
                    <div className="about-feature-preview-main">React <i /> Figma <i /> Next.js</div>
                  </>
                )}
                {index === 1 && (
                  <>
                    <div className="about-feature-preview-top"><span>OPEN BRIEF</span><span>2 WEEKS</span></div>
                    <div className="about-feature-preview-main">MVP landing page · React + GSAP</div>
                  </>
                )}
                {index === 2 && (
                  <>
                    <div className="about-feature-preview-top"><span>SHARED PLAN</span><span>01 — 03</span></div>
                    <div className="about-feature-preview-main">Scope <i /> Build <i /> Review</div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
