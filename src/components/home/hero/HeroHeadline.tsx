import { ArrowRight, Sparkles } from 'lucide-react'

export interface HeroHeadlineProps {
  activeStage: number
  onExploreClick: () => void
  onPostProjectClick: () => void
  ctaExploreRef?: React.RefObject<HTMLButtonElement | null>
}

export function HeroHeadline({
  activeStage,
  onExploreClick,
  onPostProjectClick,
  ctaExploreRef,
}: HeroHeadlineProps) {
  const stageLabels = [
    '01 Talent',
    '02 Discovery',
    '03 Opportunity',
    '04 Connection',
  ]

  return (
    <div className="space-y-6 text-left">
      {/* Eyebrow Label & Active Stage Tracker */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3F4EB] border border-[#08C58A]/30 text-[#123D30] text-xs font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
          <span>THE NETWORK FOR WHAT&apos;S NEXT</span>
        </div>

        {/* Clean Stage Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#E7E8E1] shadow-2xs backdrop-blur-sm text-xs text-[#777A72]">
          <span className="font-mono text-[11px] font-bold text-[#171916]">
            {stageLabels[activeStage - 1]}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#08C58A]" />
          <span className="text-[10px] text-[#777A72] uppercase font-semibold">
            Stage {activeStage} of 4
          </span>
        </div>
      </div>

      {/* Main Dominant Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-black text-[#171916] leading-[1.05] tracking-tight">
        Good people.
        <br />
        Big ideas.
        <br />
        <span className="text-[#08C58A] relative inline-block">
          Better together.
          <span
            aria-hidden="true"
            className="absolute left-0 -bottom-1 w-full h-3 bg-[#E3F4EB] -rotate-1 -z-10 rounded-sm"
          />
        </span>
      </h1>

      {/* Supporting Copy */}
      <p className="text-base sm:text-lg text-[#777A72] leading-relaxed max-w-xl">
        PeerConnect brings talented students together with startups, local
        businesses and project creators looking for fresh ideas and real skills.
      </p>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
        <button
          ref={ctaExploreRef}
          type="button"
          onClick={onExploreClick}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm bg-[#08C58A] hover:bg-[#07b27c] text-[#0A261D] shadow-[0_2px_14px_rgba(8,197,138,0.25)] hover:shadow-[0_4px_22px_rgba(8,197,138,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span>Explore Talent</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>

        <button
          type="button"
          onClick={onPostProjectClick}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm bg-white hover:bg-[#F2F1EA] text-[#171916] border border-[#E7E8E1] hover:border-[#D1D2C9] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-2xs cursor-pointer"
        >
          <span>Post a Project</span>
        </button>
      </div>

      {/* Authentic Supporting Trust Line without fabricated statistics */}
      <div className="flex items-center gap-3 pt-3 border-t border-[#E7E8E1]">
        <div className="flex -space-x-2 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Sofia Rodriguez"
            className="w-7 h-7 rounded-full border-2 border-white object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
            alt="Marcus Chen"
            className="w-7 h-7 rounded-full border-2 border-white object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
            alt="Aria Vance"
            className="w-7 h-7 rounded-full border-2 border-white object-cover"
          />
          <div className="w-7 h-7 rounded-full bg-[#123D30] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#08C58A]">
            <Sparkles className="w-3 h-3 text-[#08C58A]" />
          </div>
        </div>
        <p className="text-xs text-[#777A72] leading-snug">
          Connecting university students with real-world projects and creators.
        </p>
      </div>
    </div>
  )
}
