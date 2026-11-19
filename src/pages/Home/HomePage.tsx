import { HeroSection } from '../../components/home/HeroSection'
import { PeerConnectIntroSection } from '../../components/home/PeerConnectIntroSection'
import { HowItWorksSection } from '../../components/home/HowItWorksSection'
import { DarkCtaSection } from '../../components/home/DarkCtaSection'

export function HomePage() {
  return (
    <div className="home-page-surface w-full space-y-0">
      {/* 1. Hero with confident typography, floating cards & subtle geometric elements */}
      <HeroSection />

      {/* About PeerConnect and its interactive feature cards. */}
      <PeerConnectIntroSection />

      {/* Keep the homepage about the product and how people collaborate. */}
      <HowItWorksSection />

      {/* High-contrast invitation for builders and project owners. */}
      <DarkCtaSection />
    </div>
  )
}
