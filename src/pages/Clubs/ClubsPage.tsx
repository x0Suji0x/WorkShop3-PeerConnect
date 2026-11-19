import { useState, useEffect } from 'react'
import { CommunityTabs } from '../../components/communities/CommunityTabs'
import { ClubDirectoryPage as ClubDirectory } from '../../components/clubs/ClubDirectoryPage'
import { ClubProfilePage } from '../../components/clubs/ClubProfilePage'
import { ClubRecruitmentPage } from '../../components/clubs/ClubRecruitmentPage'
import { decodeRoute, type CollegeRoute } from '../../lib/collegeRouter'

export function ClubsPage() {
  const [route, setRoute] = useState<CollegeRoute>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#cc?')) {
      return decodeRoute(window.location.hash)
    }
    return { page: 'clubs' }
  })

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.startsWith('#cc?')) {
        setRoute(decodeRoute(window.location.hash))
      } else {
        setRoute({ page: 'clubs' })
      }
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleNavigate = (hash: string) => {
    window.location.hash = hash.slice(1)
    setRoute(decodeRoute(hash))
  }

  return (
    <div className="peer-page-surface min-h-[calc(100vh-80px)] relative overflow-hidden pb-16">
      <div className="peer-ambient-glow peer-glow-gold -top-24 -left-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-rose top-1/4 -right-24 h-96 w-96 pointer-events-none" />
      <div className="peer-ambient-glow peer-glow-mint -bottom-24 left-1/3 h-96 w-96 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30 -z-0" />

      <div className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <CommunityTabs />
        </div>

        {route.page === 'club-profile' ? (
          <ClubProfilePage clubId={route.clubId} onNavigate={handleNavigate} />
        ) : route.page === 'club-recruitment' ? (
          <ClubRecruitmentPage
            clubId={route.clubId}
            initialOpeningId={route.openingId}
            onNavigate={handleNavigate}
          />
        ) : (
          <ClubDirectory onNavigate={handleNavigate} />
        )}
      </div>
    </div>
  )
}
