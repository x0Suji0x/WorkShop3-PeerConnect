import { ArrowRight } from 'lucide-react'

export interface HeroHeadlineProps {
  onExploreClick: () => void
  onFindTalentClick: () => void
  ctaExploreRef?: React.RefObject<HTMLButtonElement | null>
}

export function HeroHeadline({
  onExploreClick,
  onFindTalentClick,
  ctaExploreRef,
}: HeroHeadlineProps) {
  return (
    <div className="space-y-6 text-left max-w-xl">
      {/* Eyebrow Pill */}
      <div className="hero-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-black/10 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-xs font-bold tracking-wider text-[#1F2937] uppercase">
        <span className="w-2 h-2 rounded-full bg-[#08C58A]" />
        <span>STUDENT TALENT MARKETPLACE</span>
      </div>

      {/* Main Headline: 4-line Stack matching the exact visual typography */}
      <h1 className="hero-headline-title text-5xl sm:text-6xl lg:text-[66px] xl:text-[74px] font-black text-[#171916] leading-[0.98] tracking-tight">
        <span className="block hero-title-line">Talent is</span>
        <span className="block hero-title-line">everywhere.</span>
        <span className="block hero-title-line relative my-0.5">
          <span className="relative inline-block font-serif italic font-normal text-[#08C58A] pr-2">
            Opportunity
            {/* Hand-drawn Green Curved Underline Stroke */}
            <svg
              aria-hidden="true"
              viewBox="0 0 280 20"
              fill="none"
              className="absolute left-0 -bottom-1 sm:-bottom-1.5 w-full h-3 sm:h-4 text-[#08C58A] pointer-events-none overflow-visible"
            >
              <path
                d="M 4,13 Q 130,19 270,9"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="hero-drawn-stroke"
              />
            </svg>
          </span>
        </span>
        <span className="block hero-title-line">should be too.</span>
      </h1>

      {/* Supporting Copy */}
      <p className="hero-subtext text-base sm:text-[17px] text-[#525A55] leading-relaxed max-w-[440px] pt-1">
        PeerConnect connects talented students with exciting projects, businesses and campus opportunities.
      </p>

      {/* Two Prominent Action CTAs */}
      <div className="hero-ctas flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
        <button
          ref={ctaExploreRef}
          type="button"
          onClick={onExploreClick}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm bg-[#123D30] hover:bg-[#0E3127] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span>Explore Opportunities</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>

        <button
          type="button"
          onClick={onFindTalentClick}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm bg-transparent hover:bg-white text-[#171916] border border-[#CBD5E1] hover:border-[#94A3B8] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-2xs cursor-pointer"
        >
          <span>Find Student Talent</span>
        </button>
      </div>

      {/* Trust & Community Baseline */}
      <div className="hero-trust flex flex-wrap items-center gap-y-2 pt-6 mt-8 border-t border-[#E5E7EB]">
        {/* 4 Overlapping Avatar Circles */}
        <div className="flex -space-x-2 shrink-0 mr-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Sofia"
            className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
          />
          <img
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
            alt="Marcus"
            className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
          />
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
            alt="Aria"
            className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
            alt="Liam"
            className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
          />
        </div>

        {/* Community Proof */}
        <span className="text-xs font-semibold text-[#171916]">
          Join 10k+ students &amp; creators
        </span>

        {/* Divider */}
        <span className="hidden sm:inline-block h-3.5 w-px bg-[#CBD5E1] mx-3" />

        {/* Value Tagline */}
        <span className="text-xs text-[#525A55]">
          Build skills. Make connections. Grow together.
        </span>
      </div>
    </div>
  )
}
