import { useState, useEffect, useCallback } from 'react'
import { Building2, Users, Calendar, Clock, ChevronRight } from 'lucide-react'
import { decodeRoute, encodeRoute, type CollegeRoute } from '../../lib/collegeRouter'
import { CollegesPage } from '../colleges/CollegesPage'
import { CollegeDetailPage } from '../colleges/CollegeDetailPage'
import { ClubDirectoryPage } from '../clubs/ClubDirectoryPage'
import { ClubProfilePage } from '../clubs/ClubProfilePage'
import { ClubRecruitmentPage } from '../clubs/ClubRecruitmentPage'
import { EventsPage } from '../events/EventsPage'
import { EventDetailPage } from '../events/EventDetailPage'
import { VolunteerApplyPage } from '../events/VolunteerApplyPage'
import { ApplicationStatusPage } from '../applications/ApplicationStatusPage'
import {
  mockColleges, mockClubs, mockEvents, getCollegeById, getClubById, getEventById,
  getStoredApplications,
} from '../../data/collegeData'

// ----------------------------------------------------------------
// CollegeCommunityModule
// Self-contained, responsive module embedded in the Homepage.
// Uses hash routing (#cc?...) for internal page transitions.
// Does NOT modify global navbar.
// ----------------------------------------------------------------

export function CollegeCommunityModule() {
  const [route, setRoute] = useState<CollegeRoute>({ page: 'colleges' })
  const [isOpen, setIsOpen] = useState(true)
  const [applicationCount, setApplicationCount] = useState(0)

  // Sync application count
  useEffect(() => {
    const updateCount = () => {
      setApplicationCount(getStoredApplications().length)
    }
    updateCount()
    window.addEventListener('storage', updateCount)
    return () => window.removeEventListener('storage', updateCount)
  }, [])

  // Sync with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#cc?')) {
        const decoded = decodeRoute(hash)
        setRoute(decoded)
        setIsOpen(true)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = useCallback((hash: string) => {
    window.location.hash = hash.slice(1) // remove leading #
    const decoded = decodeRoute(hash)
    setRoute(decoded)
    setIsOpen(true)
    setTimeout(() => {
      document
        .getElementById('college-community-module')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }, [])

  const openModule = (page: CollegeRoute) => {
    const hash = encodeRoute(page)
    navigate(hash)
  }

  // Active top-level tab helper
  const getActiveTab = () => {
    if (route.page === 'colleges' || route.page === 'college-detail') return 'colleges'
    if (
      route.page === 'clubs' ||
      route.page === 'club-profile' ||
      route.page === 'club-recruitment'
    ) {
      return 'clubs'
    }
    if (
      route.page === 'events' ||
      route.page === 'event-detail' ||
      route.page === 'volunteer-apply'
    ) {
      return 'events'
    }
    if (route.page === 'applications') return 'applications'
    return 'colleges'
  }

  const activeTab = getActiveTab()

  // Breadcrumbs computation
  const renderBreadcrumbs = () => {
    if (route.page === 'college-detail') {
      const col = getCollegeById(route.collegeId)
      return (
        <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
          <button
            type="button"
            onClick={() => openModule({ page: 'colleges' })}
            className="hover:text-[#171916] cursor-pointer"
          >
            Colleges
          </button>
          <ChevronRight className="w-3 h-3 text-[#B5B2A8]" />
          <span className="font-semibold text-[#171916] truncate max-w-48 sm:max-w-none">
            {col?.shortName ?? 'College Details'}
          </span>
        </div>
      )
    }

    if (route.page === 'club-profile') {
      const cl = getClubById(route.clubId)
      return (
        <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
          <button
            type="button"
            onClick={() => openModule({ page: 'clubs' })}
            className="hover:text-[#171916] cursor-pointer"
          >
            Clubs
          </button>
          <ChevronRight className="w-3 h-3 text-[#B5B2A8]" />
          <span className="font-semibold text-[#171916] truncate max-w-48 sm:max-w-none">
            {cl?.name ?? 'Club Profile'}
          </span>
        </div>
      )
    }

    if (route.page === 'club-recruitment') {
      const cl = getClubById(route.clubId)
      return (
        <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
          <button
            type="button"
            onClick={() => openModule({ page: 'clubs' })}
            className="hover:text-[#171916] cursor-pointer"
          >
            Clubs
          </button>
          <ChevronRight className="w-3 h-3 text-[#B5B2A8]" />
          <button
            type="button"
            onClick={() => openModule({ page: 'club-profile', clubId: route.clubId })}
            className="hover:text-[#171916] cursor-pointer truncate max-w-36"
          >
            {cl?.name ?? 'Club'}
          </button>
          <ChevronRight className="w-3 h-3 text-[#B5B2A8]" />
          <span className="font-semibold text-[#171916]">Recruitment</span>
        </div>
      )
    }

    if (route.page === 'event-detail') {
      const evt = getEventById(route.eventId)
      return (
        <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
          <button
            type="button"
            onClick={() => openModule({ page: 'events' })}
            className="hover:text-[#171916] cursor-pointer"
          >
            Events
          </button>
          <ChevronRight className="w-3 h-3 text-[#B5B2A8]" />
          <span className="font-semibold text-[#171916] truncate max-w-48 sm:max-w-none">
            {evt?.title ?? 'Event Details'}
          </span>
        </div>
      )
    }

    if (route.page === 'volunteer-apply') {
      const evt = getEventById(route.eventId)
      return (
        <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
          <button
            type="button"
            onClick={() => openModule({ page: 'events' })}
            className="hover:text-[#171916] cursor-pointer"
          >
            Events
          </button>
          <ChevronRight className="w-3 h-3 text-[#B5B2A8]" />
          <button
            type="button"
            onClick={() => openModule({ page: 'event-detail', eventId: route.eventId })}
            className="hover:text-[#171916] cursor-pointer truncate max-w-36"
          >
            {evt?.title ?? 'Event'}
          </button>
          <ChevronRight className="w-3 h-3 text-[#B5B2A8]" />
          <span className="font-semibold text-[#171916]">Volunteer Application</span>
        </div>
      )
    }

    if (route.page === 'applications') {
      return (
        <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
          <button
            type="button"
            onClick={() => openModule({ page: 'colleges' })}
            className="hover:text-[#171916] cursor-pointer"
          >
            Community
          </button>
          <ChevronRight className="w-3 h-3 text-[#B5B2A8]" />
          <span className="font-semibold text-[#171916]">Track Applications</span>
        </div>
      )
    }

    return null
  }

  const renderPage = () => {
    switch (route.page) {
      case 'colleges':
        return <CollegesPage onNavigate={navigate} />
      case 'college-detail':
        return <CollegeDetailPage collegeId={route.collegeId} onNavigate={navigate} />
      case 'clubs':
        return (
          <ClubDirectoryPage
            initialCategory={route.category}
            initialCollegeId={route.collegeId}
            onNavigate={navigate}
          />
        )
      case 'club-profile':
        return <ClubProfilePage clubId={route.clubId} onNavigate={navigate} />
      case 'club-recruitment':
        return (
          <ClubRecruitmentPage
            clubId={route.clubId}
            initialOpeningId={route.openingId}
            onNavigate={navigate}
          />
        )
      case 'events':
        return (
          <EventsPage
            initialCategory={route.category}
            initialCollegeId={route.collegeId}
            onNavigate={navigate}
          />
        )
      case 'event-detail':
        return <EventDetailPage eventId={route.eventId} onNavigate={navigate} />
      case 'volunteer-apply':
        return (
          <VolunteerApplyPage
            eventId={route.eventId}
            roleId={route.roleId}
            onNavigate={navigate}
          />
        )
      case 'applications':
        return (
          <ApplicationStatusPage
            initialEmail={route.filterEmail}
            onNavigate={navigate}
          />
        )
      default:
        return <CollegesPage onNavigate={navigate} />
    }
  }

  return (
    <section
      id="college-community-module"
      className="w-full bg-[#FAF8F5] border-t border-[#E7E8E1] scroll-mt-20 transition-colors"
    >
      {/* SECTION HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E7E8E1]">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3F4EB] border border-[#08C58A]/30 text-[#123D30] text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
              Colleges, Clubs & Campus Events Module
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171916] leading-[1.08] tracking-tight">
              Campus{' '}
              <span className="text-[#08C58A] relative inline-block">
                ecosystem.
                <span
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1 w-full h-2.5 bg-[#E3F4EB] -rotate-1 -z-10 rounded-sm"
                />
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#777A72] leading-relaxed pt-1">
              Explore colleges across India, join student clubs across 8 categories, volunteer for campus
              hackathons and festivals, and track your recruitment status live.
            </p>
          </div>

          {/* Quick Stats Pill Cards */}
          <div className="flex items-center gap-3 flex-wrap">
            {[
              {
                icon: <Building2 className="w-4 h-4" />,
                value: mockColleges.length.toString(),
                label: 'Colleges',
                onClick: () => openModule({ page: 'colleges' }),
              },
              {
                icon: <Users className="w-4 h-4" />,
                value: `${mockClubs.length}+`,
                label: 'Clubs',
                onClick: () => openModule({ page: 'clubs' }),
              },
              {
                icon: <Calendar className="w-4 h-4" />,
                value: mockEvents.length.toString(),
                label: 'Events',
                onClick: () => openModule({ page: 'events' }),
              },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={s.onClick}
                className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl bg-white border border-[#E7E8E1] hover:border-[#08C58A]/50 shadow-2xs min-w-22 text-center cursor-pointer transition-all group"
              >
                <span className="text-[#08C58A] group-hover:scale-110 transition-transform">
                  {s.icon}
                </span>
                <span className="text-xl font-black text-[#171916]">{s.value}</span>
                <span className="text-[11px] font-semibold text-[#777A72]">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PERSISTENT SUB-NAVIGATION BAR (Sticky, Tab-Based) */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E7E8E1] p-2 shadow-2xs">
          {/* Main Module Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => openModule({ page: 'colleges' })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === 'colleges'
                  ? 'bg-[#171916] text-white shadow-2xs'
                  : 'text-[#777A72] hover:text-[#171916] hover:bg-[#F7F6F0]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Colleges</span>
            </button>

            <button
              type="button"
              onClick={() => openModule({ page: 'clubs' })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === 'clubs'
                  ? 'bg-[#171916] text-white shadow-2xs'
                  : 'text-[#777A72] hover:text-[#171916] hover:bg-[#F7F6F0]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Clubs</span>
            </button>

            <button
              type="button"
              onClick={() => openModule({ page: 'events' })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-[#171916] text-white shadow-2xs'
                  : 'text-[#777A72] hover:text-[#171916] hover:bg-[#F7F6F0]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Events</span>
            </button>

            <button
              type="button"
              onClick={() => openModule({ page: 'applications' })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === 'applications'
                  ? 'bg-[#171916] text-white shadow-2xs'
                  : 'text-[#777A72] hover:text-[#171916] hover:bg-[#F7F6F0]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Track Status</span>
              {applicationCount > 0 && (
                <span className="text-[10px] font-bold bg-[#08C58A] text-[#0A261D] px-1.5 py-0.2 rounded-full">
                  {applicationCount}
                </span>
              )}
            </button>
          </div>

          {/* Breadcrumbs or Collapsible toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-3 px-2">
            {renderBreadcrumbs()}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs font-semibold text-[#777A72] hover:text-[#171916] px-3 py-1.5 rounded-lg hover:bg-[#F7F6F0] cursor-pointer transition-colors shrink-0"
            >
              {isOpen ? 'Collapse ▴' : 'Expand ▾'}
            </button>
          </div>
        </div>
      </div>

      {/* MODULE CONTENT */}
      {isOpen && (
        <div className="border-t border-[#E7E8E1] transition-all">
          {renderPage()}
        </div>
      )}
    </section>
  )
}
