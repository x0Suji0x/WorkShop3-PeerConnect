import { useState, useEffect } from 'react'
import { CommunityTabs } from '../../components/communities/CommunityTabs'
import { EventsPage as EventDiscovery } from '../../components/events/EventsPage'
import { EventDetailPage } from '../../components/events/EventDetailPage'
import { VolunteerApplyPage } from '../../components/events/VolunteerApplyPage'
import { decodeRoute, type CollegeRoute } from '../../lib/collegeRouter'

export function EventsPage() {
  const [route, setRoute] = useState<CollegeRoute>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#cc?')) {
      return decodeRoute(window.location.hash)
    }
    return { page: 'events' }
  })

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.startsWith('#cc?')) {
        setRoute(decodeRoute(window.location.hash))
      } else {
        setRoute({ page: 'events' })
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
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <CommunityTabs />
      </div>

      {route.page === 'event-detail' ? (
        <EventDetailPage eventId={route.eventId} onNavigate={handleNavigate} />
      ) : route.page === 'volunteer-apply' ? (
        <VolunteerApplyPage
          eventId={route.eventId}
          roleId={route.roleId}
          onNavigate={handleNavigate}
        />
      ) : (
        <EventDiscovery onNavigate={handleNavigate} />
      )}
    </div>
  )
}
