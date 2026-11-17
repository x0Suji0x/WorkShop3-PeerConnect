import { HeroIntroSection } from '../../components/home/HeroIntroSection'
import { TheProblemSection } from '../../components/home/TheProblemSection'
import { ForStudentsSection } from '../../components/home/ForStudentsSection'
import { ForCreatorsSection } from '../../components/home/ForCreatorsSection'
import { ProcessSequenceSection } from '../../components/home/ProcessSequenceSection'
import { MarketplacePreviewSection } from '../../components/home/MarketplacePreviewSection'
import { FinalCtaSection } from '../../components/home/FinalCtaSection'

export function HomePage() {
  return (
    <div className="w-full space-y-0">
      {/* 01. The Introduction — Talent is everywhere. Opportunity should be too. */}
      <HeroIntroSection />

      {/* 02. The Problem — The Campus Disconnect (Student & Creator realities) */}
      <TheProblemSection />

      {/* 03. For Students — Turn what you can do into what you can achieve. */}
      <ForStudentsSection />

      {/* 04. For Creators — Good work deserves the right people. */}
      <ForCreatorsSection />

      {/* 05. The Workflow — From brief to delivery in four clear steps. */}
      <ProcessSequenceSection />

      {/* 06. Marketplace Preview — Student Builders & Active Project Briefs */}
      <MarketplacePreviewSection />

      {/* 07. Final CTA & Integrated Editorial Footer — Starts with a connection. */}
      <FinalCtaSection />
    </div>
  )
}
