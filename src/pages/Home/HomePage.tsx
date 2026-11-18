import { HeroSection } from '../../components/home/HeroSection'
import { PeerConnectIntroSection } from '../../components/home/PeerConnectIntroSection'
import { ProjectMarketplaceSection } from '../../components/home/ProjectMarketplaceSection'
import { HowItWorksSection } from '../../components/home/HowItWorksSection'
import { DarkCtaSection } from '../../components/home/DarkCtaSection'

export function HomePage() {
  return (
    <div className="home-page-surface w-full space-y-0">
      {/* 1. Hero with confident typography, floating cards & subtle geometric elements */}
      <HeroSection />

      {/* About PeerConnect and its interactive feature cards. */}
      <PeerConnectIntroSection />

      {/* Keep the landing page focused on finding and building projects. */}
      <ProjectMarketplaceSection />

      {/* Explain the project collaboration flow. */}
      <HowItWorksSection />

      {/* High-contrast invitation for builders and project owners. */}
      <DarkCtaSection />
    </div>
  )
}
