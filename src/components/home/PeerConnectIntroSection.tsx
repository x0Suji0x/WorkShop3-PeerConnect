import { Compass, Handshake, UsersRound } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

const features = [
  {
    icon: UsersRound,
    kicker: 'THE RIGHT START',
    title: 'Your next great idea ',
    highlight: 'starts here.',
    detail: 'Curated briefs · Clear direction',
  },
  {
    icon: Compass,
    kicker: 'BETTER, TOGETHER',
    title: 'Make something ',
    highlight: 'remarkable.',
    detail: 'Shared ambition · Real momentum',
  },
  {
    icon: Handshake,
    kicker: 'MADE TO MATTER',
    title: 'Build work worth ',
    highlight: 'remembering.',
    detail: 'Real outcomes · Your next chapter',
  },
]

export function PeerConnectIntroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.about-feature-card')
    gsap.fromTo(cards, { autoAlpha: 0.72, y: 10 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.32,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true, fastScrollEnd: true },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section scroll-mt-24 pt-20 pb-7 text-[#171916] sm:pt-24 sm:pb-10 lg:pt-24 lg:pb-12"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#176B4C]/15 bg-white/75 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-[#315448]">
            <span className="h-2 w-2 rounded-full bg-[#08A875]" aria-hidden="true" />
            ABOUT PEERCONNECT
          </div>
          <h2 className="about-heading text-3xl leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Good projects bring <em>the right people together.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#525A55] sm:text-lg">
            Start with a clear brief, build with a team, and leave with work you can share.
          </p>
        </div>

        <div className="mt-9 grid items-start gap-4 md:grid-cols-2 lg:mt-11 lg:grid-cols-3">
          {features.map(({ icon: Icon, kicker, title, highlight, detail }, index) => (
            <div
              key={title}
              className={`about-feature-shell ${index === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <article
                data-tone={index + 1}
                onPointerMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect()
                  event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`)
                  event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`)
                }}
                onPointerLeave={(event) => {
                  event.currentTarget.style.setProperty('--pointer-x', '50%')
                  event.currentTarget.style.setProperty('--pointer-y', '50%')
                }}
                className="about-feature-card group"
              >
                <span className="about-feature-number" aria-hidden="true">0{index + 1}</span>
                <div className="relative z-[1] flex h-full flex-col">
                  <div className="flex items-center">
                    <span className="about-feature-icon">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                  </div>
                  <span className="about-feature-kicker mt-6">{kicker}</span>
                  <h3 className="about-feature-title mt-2">
                    {title}<span>{highlight}</span>
                  </h3>
                  <div className="about-feature-detail mt-auto pt-7">
                    <span className="about-feature-detail-dot" aria-hidden="true" />
                    {detail}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
