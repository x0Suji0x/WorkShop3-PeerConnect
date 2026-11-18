import { useState, useEffect } from 'react'
import { CommunityTabs } from '../../components/communities/CommunityTabs'
import { CollegesPage as CollegeDiscovery } from '../../components/colleges/CollegesPage'
import { CollegeDetailPage } from '../../components/colleges/CollegeDetailPage'
import { decodeRoute } from '../../lib/collegeRouter'

export function CollegesPage() {
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#cc?')) {
      const decoded = decodeRoute(window.location.hash)
      if (decoded.page === 'college-detail') return decoded.collegeId
    }
    return null
  })

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.startsWith('#cc?')) {
        const decoded = decodeRoute(window.location.hash)
        if (decoded.page === 'college-detail') {
          setSelectedCollegeId(decoded.collegeId)
          return
        }
      }
      setSelectedCollegeId(null)
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleNavigate = (hash: string) => {
    window.location.hash = hash.slice(1)
    const decoded = decodeRoute(hash)
    if (decoded.page === 'college-detail') {
      setSelectedCollegeId(decoded.collegeId)
    } else {
      setSelectedCollegeId(null)
    }
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <CommunityTabs />
      </div>

      {selectedCollegeId ? (
        <CollegeDetailPage collegeId={selectedCollegeId} onNavigate={handleNavigate} />
      ) : (
        <CollegeDiscovery onNavigate={handleNavigate} />
      )}
    </div>
  )
}
