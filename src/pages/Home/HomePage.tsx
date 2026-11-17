import { HeroSection } from '../../components/home/HeroSection'
import { StudentDiscoverySection } from '../../components/home/StudentDiscoverySection'
import { ProjectMarketplaceSection } from '../../components/home/ProjectMarketplaceSection'
import { HowItWorksSection } from '../../components/home/HowItWorksSection'
import { DarkCtaSection } from '../../components/home/DarkCtaSection'

export function HomePage() {
  return (
    <div className="w-full space-y-0">
      {/* 1. Hero with confident typography, floating cards & subtle geometric elements */}
      <HeroSection />

      {/* 2. Student Discovery Section with curated profile cards & filters */}
      <StudentDiscoverySection />

      {/* 3. Project Marketplace Section with live scoped opportunities & budgets */}
      <ProjectMarketplaceSection />

      {/* 4. How It Works Section explaining Student & Client journeys */}
      <HowItWorksSection />

      {/* 5. High-contrast Dark CTA Section with strong typography & signups */}
      <DarkCtaSection />
    </div>
  )
}
