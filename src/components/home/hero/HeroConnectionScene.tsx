import { Code2, Sparkles, CheckCircle2 } from 'lucide-react'
import { StudentProfileCard } from './StudentProfileCard'
import { ProjectOpportunityCard } from './ProjectOpportunityCard'

export interface HeroConnectionSceneProps {
  studentCard1Ref: React.RefObject<HTMLDivElement | null>
  studentCard2Ref: React.RefObject<HTMLDivElement | null>
  projectCardRef: React.RefObject<HTMLDivElement | null>
  skillTag1Ref: React.RefObject<HTMLDivElement | null>
  skillTag2Ref: React.RefObject<HTMLDivElement | null>
  skillTag3Ref: React.RefObject<HTMLDivElement | null>
  matchBadgeRef: React.RefObject<HTMLDivElement | null>
  onCardMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void
  onCardMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export function HeroConnectionScene({
  studentCard1Ref,
  studentCard2Ref,
  projectCardRef,
  skillTag1Ref,
  skillTag2Ref,
  skillTag3Ref,
  matchBadgeRef,
  onCardMouseMove,
  onCardMouseLeave,
}: HeroConnectionSceneProps) {
  return (
    <div className="relative w-full h-[520px] sm:h-[560px] lg:h-[580px] xl:h-[620px] flex items-center justify-center">
      {/* SVG Connection Paths Canvas */}
      <svg
        aria-hidden="true"
        viewBox="0 0 700 600"
        className="absolute inset-0 w-full h-full pointer-events-none z-15"
      >
        <defs>
          <linearGradient id="heroSceneBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#08C58A" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#08C58A" stopOpacity="1" />
            <stop offset="100%" stopColor="#08C58A" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Dynamic Curved Connection Line between Sofia (left) and Project (right) */}
        <path
          d="M 240,240 C 330,240 370,240 460,240"
          fill="none"
          stroke="url(#heroSceneBeamGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100}
          className="connection-path-scene"
        />
      </svg>

      {/* 1. Primary Student Card (Sofia Rodriguez) */}
      <StudentProfileCard
        variant="primary"
        cardRef={studentCard1Ref}
        onMouseMove={onCardMouseMove}
        onMouseLeave={onCardMouseLeave}
        className="top-6 sm:top-10 left-1 sm:left-4 z-20 w-[290px] sm:w-[330px] lg:w-[350px]"
      />

      {/* 2. Secondary Student Card (Marcus Chen) */}
      <StudentProfileCard
        variant="secondary"
        cardRef={studentCard2Ref}
        onMouseMove={onCardMouseMove}
        onMouseLeave={onCardMouseLeave}
        className="bottom-4 sm:bottom-6 left-2 sm:left-6 z-15 w-[270px] sm:w-[305px] lg:w-[325px]"
      />

      {/* 3. Prominent Project Opportunity Card (Campus Event Platform) */}
      <ProjectOpportunityCard
        cardRef={projectCardRef}
        onMouseMove={onCardMouseMove}
        onMouseLeave={onCardMouseLeave}
        className="top-8 sm:top-12 right-1 sm:right-4 z-20 w-[300px] sm:w-[340px] lg:w-[365px]"
      />

      {/* 4. Floating Skill Tags */}
      <div
        ref={skillTag1Ref}
        className="hero-skill-chip absolute top-2 left-[38%] sm:left-[42%] z-25 pointer-events-none will-change-transform"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#171916] text-[10px] sm:text-[11px] font-extrabold border border-[#E7E8E1] shadow-md backdrop-blur-sm">
          <Code2 className="w-3 h-3 text-[#08C58A]" />
          <span>REACT 19</span>
        </div>
      </div>

      <div
        ref={skillTag2Ref}
        className="hero-skill-chip absolute top-[44%] left-[2%] sm:left-[6%] z-25 pointer-events-none will-change-transform"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F4EB] text-[#123D30] text-[10px] sm:text-[11px] font-extrabold border border-[#08C58A]/30 shadow-xs backdrop-blur-sm">
          <Sparkles className="w-3 h-3 text-[#08C58A]" />
          <span>UI / DESIGN SYSTEMS</span>
        </div>
      </div>

      <div
        ref={skillTag3Ref}
        className="hero-skill-chip absolute bottom-24 right-[42%] sm:right-[45%] z-25 pointer-events-none will-change-transform"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#171916] text-[10px] sm:text-[11px] font-bold border border-[#E7E8E1] shadow-xs">
          <span>✦ TYPESCRIPT</span>
        </div>
      </div>

      {/* 5. Stage 4 Connection Match Badge (Bridge between student & project) */}
      <div
        ref={matchBadgeRef}
        className="hero-match-badge absolute top-[38%] left-1/2 -translate-x-1/2 z-30 pointer-events-none will-change-transform"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#08C58A] text-[#0A261D] text-xs font-black shadow-[0_6px_24px_rgba(8,197,138,0.4)] border border-white/60 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4" />
          <span>SKILLS MATCHED · READY TO BUILD</span>
        </div>
      </div>
    </div>
  )
}
