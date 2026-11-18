import { HeroSection } from '../../components/home/HeroSection'
import { PeerConnectIntroSection } from '../../components/home/PeerConnectIntroSection'
import { StudentDiscoverySection } from '../../components/home/StudentDiscoverySection'
import { ProjectMarketplaceSection } from '../../components/home/ProjectMarketplaceSection'
import { HowItWorksSection } from '../../components/home/HowItWorksSection'
import { DarkCtaSection } from '../../components/home/DarkCtaSection'
import { CollegeCommunityModule } from '../../components/colleges/CollegeCommunityModule'

export function HomePage() {
  return (
    <div className="home-page-surface w-full space-y-0">
      {/* 1. Hero with confident typography, floating cards & subtle geometric elements */}
      <HeroSection />

      {/* 2. Short product introduction after the hero scroll story */}
      <PeerConnectIntroSection />

      {/* 3. Student Discovery Section with curated profile cards & filters */}
      <StudentDiscoverySection />

      {/* 4. Project Marketplace Section with live scoped opportunities & budgets */}
      <ProjectMarketplaceSection />

      {/* 5. College, Clubs & Events Module — independent, hash-routed */}
      <CollegeCommunityModule />

      {/* 6. How It Works Section explaining Student & Client journeys */}
      <HowItWorksSection />

      {/* 7. High-contrast Dark CTA Section with strong typography & signups */}
      <DarkCtaSection />
    </div>
  )
}
