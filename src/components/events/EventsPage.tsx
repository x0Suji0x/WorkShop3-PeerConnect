import { useState, useMemo } from 'react'
import {
  Search, MapPin, Calendar, Users, ArrowRight, Filter,
  Building2, Clock,
} from 'lucide-react'
import {
  mockEvents, mockClubs, mockColleges, getCollegeById,
  CLUB_CATEGORIES, CATEGORY_COLORS, type ClubCategory,
} from '../../data/collegeData'
import { encodeRoute } from '../../lib/collegeRouter'

interface EventsPageProps {
  initialCategory?: string
  initialCollegeId?: string
  onNavigate: (hash: string) => void
}

const LOCATION_TYPES = ['All', 'On-Campus', 'Off-Campus', 'Online', 'Hybrid'] as const

export function EventsPage({
  initialCategory,
  initialCollegeId,
  onNavigate,
}: EventsPageProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ClubCategory | 'All'>(
    (initialCategory as ClubCategory) ?? 'All'
  )
  const [selectedCollege, setSelectedCollege] = useState<string>(initialCollegeId ?? 'All')
  const [locationType, setLocationType] = useState<string>('All')

  const filtered = useMemo(() => {
    return mockEvents.filter((e) => {
      const club = mockClubs.find((c) => c.id === e.clubId)
      const college = getCollegeById(e.collegeId)
      const matchSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()) ||
        (club && club.name.toLowerCase().includes(search.toLowerCase())) ||
        (college && college.name.toLowerCase().includes(search.toLowerCase()))
      const matchCat = category === 'All' || e.category === category
      const matchCollege = selectedCollege === 'All' || e.collegeId === selectedCollege
      const matchLoc = locationType === 'All' || e.locationType === locationType
      return matchSearch && matchCat && matchCollege && matchLoc
    })
  }, [search, category, selectedCollege, locationType])

  return (
    <section className="min-h-screen bg-transparent py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="peer-eyebrow-pill mb-3">
            Event Discovery & Volunteer Openings
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171916] leading-tight tracking-tight mb-3">
            Campus{' '}
            <span className="text-[#08C58A] relative inline-block">
              Events
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 w-full h-2.5 bg-[#E3F4EB] -rotate-1 -z-10 rounded-sm"
              />
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#777A72] max-w-2xl leading-relaxed">
            Discover hackathons, exhibitions, pitch nights, symposiums, and sports cups happening across
            top campuses. View open volunteer roles and apply to gain hands-on experience.
          </p>
        </div>

        {/* Category Pills */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#171916] uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#08C58A]" />
              Event Category:
            </span>
            <button
              type="button"
              onClick={() => onNavigate(encodeRoute({ page: 'applications' }))}
              className="text-xs font-bold text-[#08C58A] hover:underline flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" /> Track Application Status
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory('All')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                category === 'All'
                  ? 'bg-[#171916] text-white border-[#171916] shadow-2xs'
                  : 'bg-white text-[#777A72] border-[#E7E8E1] hover:border-[#171916] hover:text-[#171916]'
              }`}
            >
              All Events ({mockEvents.length})
            </button>
            {CLUB_CATEGORIES.map((cat) => {
              const colors = CATEGORY_COLORS[cat]
              const count = mockEvents.filter((e) => e.category === cat).length
              const isActive = category === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isActive
                      ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-current/20 shadow-2xs`
                      : 'bg-white text-[#777A72] border-[#E7E8E1] hover:border-[#D1D2C9] hover:text-[#171916]'
                  }`}
                >
                  {cat} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Search, Campus Filter & Location Type */}
        <div className="bg-white rounded-3xl border border-[#E7E8E1] p-4 sm:p-5 mb-8 shadow-2xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777A72]" />
            <input
              type="text"
              placeholder="Search events by title, organizer, campus, or venue…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E8E1] bg-[#F7F6F0] text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 focus:border-[#08C58A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Campus dropdown */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#08C58A] shrink-0" />
              <label htmlFor="event-campus-filter" className="text-xs font-bold text-[#171916]">
                Campus:
              </label>
              <select
                id="event-campus-filter"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="text-xs font-semibold border border-[#E7E8E1] rounded-xl px-3 py-2 bg-[#F7F6F0] text-[#171916] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 cursor-pointer"
              >
                <option value="All">All Campuses</option>
                {mockColleges.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.shortName}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Type */}
            <div className="flex items-center gap-1.5 bg-[#F7F6F0] p-1 rounded-xl border border-[#E7E8E1]">
              {LOCATION_TYPES.map((lt) => (
                <button
                  key={lt}
                  type="button"
                  onClick={() => setLocationType(lt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    locationType === lt
                      ? 'bg-[#171916] text-white shadow-2xs'
                      : 'text-[#777A72] hover:text-[#171916]'
                  }`}
                >
                  {lt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Counter Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#777A72]">
            Showing <strong className="text-[#171916]">{filtered.length}</strong> of{' '}
            {mockEvents.length} campus events
          </p>
          {(category !== 'All' || selectedCollege !== 'All' || locationType !== 'All' || search) && (
            <button
              type="button"
              onClick={() => {
                setCategory('All')
                setSelectedCollege('All')
                setLocationType('All')
                setSearch('')
              }}
              className="text-xs font-bold text-[#08C58A] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Events Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E7E8E1] space-y-3">
            <Calendar className="w-12 h-12 text-[#E7E8E1] mx-auto" />
            <h3 className="font-bold text-[#171916] text-base">No events found matching your filters</h3>
            <p className="text-sm text-[#777A72] max-w-sm mx-auto">
              Try adjusting your category, venue type, or campus filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventDiscoveryCard
                key={event.id}
                event={event}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function EventDiscoveryCard({
  event,
  onNavigate,
}: {
  event: (typeof mockEvents)[number]
  onNavigate: (hash: string) => void
}) {
  const club = mockClubs.find((c) => c.id === event.clubId)
  const college = getCollegeById(event.collegeId)
  const colors =
    CATEGORY_COLORS[event.category as keyof typeof CATEGORY_COLORS] ??
    CATEGORY_COLORS['Technical']

  return (
    <article className="peer-card-glass overflow-hidden hover:border-[#08C58A]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* Cover Banner */}
      <div className="relative h-44 overflow-hidden bg-[#F7F6F0]">
        <img
          src={event.coverUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
          alt={event.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category Badge */}
        <span
          className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {event.category}
        </span>

        {/* Location Type Badge */}
        <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#171916] border border-white/60 shadow-2xs">
          {event.locationType}
        </span>

        {/* Date / Time Overlay */}
        <div className="absolute bottom-3 left-4 text-white">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#08C58A]" />
            <span>{event.date}</span>
            <span>·</span>
            <span className="text-white/80">{event.time}</span>
          </div>
        </div>
      </div>

      {/* Content Body showcasing all 7 required fields */}
      <div className="p-5 flex flex-col flex-1 space-y-3">
        {/* 1. Event Name */}
        <div>
          <h2 className="font-black text-[#171916] text-base sm:text-lg leading-snug group-hover:text-[#08C58A] transition-colors line-clamp-2">
            {event.title}
          </h2>
        </div>

        {/* 2. Organising Club & 3. College */}
        <div className="space-y-1 pt-0.5">
          {club && (
            <div className="flex items-center gap-2 text-xs text-[#171916] font-semibold">
              <img
                src={club.logoUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80'}
                alt={club.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80'
                }}
                className="w-4 h-4 rounded-md object-cover shrink-0"
              />
              <span className="truncate">Organised by {club.name}</span>
            </div>
          )}
          {college && (
            <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
              <Building2 className="w-3.5 h-3.5 text-[#08C58A] shrink-0" />
              <span className="truncate">{college.name}</span>
            </div>
          )}
          {/* 4. Date and Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
            <MapPin className="w-3.5 h-3.5 text-[#08C58A] shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* 5. Description */}
        <p className="text-xs text-[#777A72] leading-relaxed line-clamp-2">
          {event.description}
        </p>

        {/* 6. Required Volunteers Badge */}
        <div className="p-2.5 rounded-xl bg-[#E3F4EB] border border-[#08C58A]/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-[#123D30]">
            <Users className="w-4 h-4 text-[#08C58A]" />
            <span>Required Volunteers:</span>
          </div>
          <span className="font-black text-[#08C58A]">
            {event.volunteersNeeded} Volunteers Needed
          </span>
        </div>

        {/* 7. Available Roles */}
        <div className="space-y-1.5 pt-0.5">
          <span className="text-[11px] font-bold text-[#171916] uppercase tracking-wider block">
            Available Roles:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {event.volunteerRoles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() =>
                  onNavigate(encodeRoute({ page: 'volunteer-apply', eventId: event.id, roleId: role.id }))
                }
                className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#F7F6F0] hover:bg-[#EAE8DF] border border-[#E7E8E1] text-[#171916] transition-colors cursor-pointer"
              >
                {role.title} ({role.count})
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 mt-auto flex gap-2">
          <button
            type="button"
            onClick={() => onNavigate(encodeRoute({ page: 'event-detail', eventId: event.id }))}
            className="flex-1 py-2.5 rounded-xl bg-[#F7F6F0] hover:bg-[#EAE8DF] text-[#171916] text-xs font-bold border border-[#E7E8E1] transition-colors cursor-pointer"
          >
            Event Details
          </button>
          <button
            type="button"
            onClick={() =>
              onNavigate(
                encodeRoute({
                  page: 'volunteer-apply',
                  eventId: event.id,
                  roleId: event.volunteerRoles[0]?.id ?? '',
                })
              )
            }
            className="flex-1 py-2.5 rounded-xl bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Apply to Volunteer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  )
}
