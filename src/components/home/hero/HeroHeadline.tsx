import { ArrowRight, ArrowDown } from 'lucide-react'

const beats = [
  { first: 'Talent is everywhere.', before: '', accent: 'Opportunity', after: ' should be too.', description: 'Discover student talent. Share ideas. Build together.' },
  { first: 'Discover people by', before: 'what they can ', accent: 'build.', after: '', description: 'Explore student skills, portfolios, and creative work.' },
  { first: 'Bring ideas to life', before: '', accent: 'together.', after: '', description: 'Find projects with clear goals, shared milestones, and room to grow.' },
]

export function HeroHeadline({ activeStage, onExploreClick }: { activeStage: number; onExploreClick: () => void }) {
  return (
    <div className="hero-editorial-copy">
      <div className="hero-copy-stack">
        {beats.map((beat, index) => (
          <div key={beat.first} className={`hero-copy-stage hero-copy-stage-${index}`} aria-hidden={activeStage !== index}>
            {index === 0 ? (
              <h1>{beat.first}<br />{beat.before}<em>{beat.accent}</em>{beat.after}</h1>
            ) : (
              <h2>{beat.first}<br />{beat.before}<em>{beat.accent}</em>{beat.after}</h2>
            )}
            <p>{beat.description}</p>
          </div>
        ))}
      </div>
      <button type="button" onClick={onExploreClick} className="hero-final-cta">
        Explore PeerConnect <ArrowRight size={17} aria-hidden="true" />
      </button>
      <span className="hero-scroll-hint" aria-hidden="true">Scroll to discover <ArrowDown size={14} /></span>
    </div>
  )
}
