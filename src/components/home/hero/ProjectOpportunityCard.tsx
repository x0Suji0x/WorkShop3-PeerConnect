import { Clock, Briefcase } from 'lucide-react'

export interface ProjectOpportunityCardProps {
  cardRef: React.RefObject<HTMLDivElement | null>
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void
  className?: string
}

export function ProjectOpportunityCard({
  cardRef,
  onMouseMove,
  onMouseLeave,
  className = '',
}: ProjectOpportunityCardProps) {
  return (
    <div
      ref={cardRef}
      className={`hero-project-card absolute will-change-transform ${className}`}
    >
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="w-full bg-[#123D30] text-white rounded-2xl p-4 sm:p-5 border border-[#08C58A]/30 shadow-[0_16px_40px_rgba(18,61,48,0.28)] hover:border-[#08C58A] transition-all duration-200 space-y-3"
      >
        {/* Header Tag & Duration */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#08C58A] text-[#0A261D] tracking-wide uppercase">
            Sample Project
          </span>
          <span className="text-[11px] text-emerald-200/90 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            3 Weeks Scope
          </span>
        </div>

        {/* Project Title & Brief */}
        <div>
          <h4 className="font-extrabold text-white text-base sm:text-lg leading-snug">
            Interactive Campus Event &amp; Showcase Web Platform
          </h4>
          <p className="text-xs text-stone-200/80 pt-1 leading-relaxed">
            Looking for a student frontend developer to build an interactive event
            platform with schedule, speaker lineup, and attendee registration.
          </p>
        </div>

        {/* Terms Box: Budget & Type */}
        <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
              Project Budget
            </span>
            <span className="text-lg font-black text-white font-mono">₹3,200</span>
          </div>
          <span className="text-[11px] text-emerald-200 font-medium bg-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#08C58A]" />
            Direct Collaboration
          </span>
        </div>

        {/* Required Skills Row */}
        <div>
          <span className="text-[10px] text-emerald-200/70 font-semibold uppercase tracking-wider block pb-1.5">
            Required Skills
          </span>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-white/15 text-white font-medium">
              React 19
            </span>
            <span className="px-2 py-0.5 rounded bg-white/15 text-white font-medium">
              Tailwind CSS
            </span>
            <span className="px-2 py-0.5 rounded bg-white/15 text-white font-medium">
              Next.js
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
