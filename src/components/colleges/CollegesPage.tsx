import { useState, useMemo } from 'react'
import {
  Search, MapPin, Users, Building2, Calendar, ArrowRight,
  GraduationCap, Filter,
} from 'lucide-react'
import {
  mockColleges, getClubsByCollege, getEventsByCollege,
  CATEGORY_COLORS, type College,
} from '../../data/collegeData'
import { encodeRoute } from '../../lib/collegeRouter'

interface CollegesPageProps {
  onNavigate: (hash: string) => void
}

const COLLEGE_TYPES = [
  'All',
  'Engineering',
  'Liberal Arts',
  'Management',
  'Arts & Design',
] as const

export function CollegesPage({ onNavigate }: CollegesPageProps) {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('All')

  const locations = useMemo(() => {
    const cities = [...new Set(mockColleges.map((c) => c.city))]
    return ['All Cities', ...cities]
  }, [])

  const filtered = useMemo(() => {
    return mockColleges.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.shortName.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.state.toLowerCase().includes(search.toLowerCase())
      const matchLocation =
        !locationFilter || locationFilter === 'All Cities' || c.city === locationFilter
      const matchType = typeFilter === 'All' || c.type === typeFilter
      return matchSearch && matchLocation && matchType
    })
  }, [search, locationFilter, typeFilter])

  return (
    <section className="min-h-screen bg-[#FAF8F5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3F4EB] border border-[#08C58A]/30 text-[#123D30] text-xs font-bold tracking-wider uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
            <span>College Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171916] leading-tight tracking-tight mb-3">
            Explore Campus{' '}
            <span className="text-[#08C58A] relative inline-block">
              Communities
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 w-full h-2.5 bg-[#E3F4EB] -rotate-1 -z-10 rounded-sm"
              />
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#777A72] max-w-2xl leading-relaxed">
            Discover premier colleges across India, explore active student clubs, register for campus
            events, and connect with vibrant student communities.
          </p>
        </div>

        {/* Search & Location Filters */}
        <div className="bg-white rounded-3xl border border-[#E7E8E1] p-5 sm:p-6 mb-8 shadow-2xs space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777A72]" />
            <input
              type="text"
              placeholder="Search colleges by name, shortform, or location (e.g. IIT Bombay, Mumbai, Manipal)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E7E8E1] bg-[#F7F6F0] text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 focus:border-[#08C58A] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            {/* Location Filter */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#08C58A] shrink-0" />
              <label htmlFor="city-filter" className="text-xs font-bold text-[#171916]">
                City:
              </label>
              <select
                id="city-filter"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="text-xs font-semibold border border-[#E7E8E1] rounded-xl px-3 py-2 bg-[#F7F6F0] text-[#171916] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc === 'All Cities' ? '' : loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#777A72] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Type:
              </span>
              {COLLEGE_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    typeFilter === t
                      ? 'bg-[#171916] text-white'
                      : 'bg-[#F7F6F0] text-[#777A72] hover:text-[#171916] hover:bg-[#EAE8DF] border border-[#E7E8E1]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <p className="text-sm text-[#777A72]">
            Showing <strong className="text-[#171916]">{filtered.length}</strong> of{' '}
            {mockColleges.length} colleges
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onNavigate(encodeRoute({ page: 'clubs' }))}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#E3F4EB] text-[#123D30] border border-[#08C58A]/30 hover:bg-[#08C58A]/20 transition-colors cursor-pointer"
            >
              Browse All Clubs
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate(encodeRoute({ page: 'events' }))}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#171916] text-white hover:bg-[#242723] transition-colors cursor-pointer"
            >
              Discover Events
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* College Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E7E8E1]">
            <Building2 className="w-10 h-10 text-[#E7E8E1] mx-auto mb-3" />
            <p className="font-bold text-[#171916] text-base">No colleges match your criteria</p>
            <p className="text-sm text-[#777A72] mt-1">Try resetting your search query or city filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setLocationFilter('')
                setTypeFilter('All')
              }}
              className="mt-4 px-5 py-2 rounded-full text-xs font-semibold bg-[#171916] text-white cursor-pointer hover:bg-[#242723]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function CollegeCard({
  college,
  onNavigate,
}: {
  college: College
  onNavigate: (hash: string) => void
}) {
  const clubs = useMemo(() => getClubsByCollege(college.id), [college.id])
  const events = useMemo(() => getEventsByCollege(college.id), [college.id])
  const nextEvent = events[0]

  return (
    <article className="bg-white rounded-3xl border border-[#E7E8E1] overflow-hidden hover:border-[#08C58A]/50 hover:shadow-[0_8px_32px_rgba(23,25,22,0.08)] transition-all duration-300 group flex flex-col">
      {/* College Logo / Cover Image */}
      <div className="relative h-44 overflow-hidden bg-[#F7F6F0]">
        <img
          src={college.coverUrl}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Logo Badge */}
        <div className="absolute bottom-3 left-4">
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-white shadow-md overflow-hidden p-0.5">
            <img
              src={college.logoUrl}
              alt={`${college.shortName} official logo`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* College Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#171916] text-[11px] font-bold border border-white/60 shadow-2xs">
            {college.type}
          </span>
        </div>
      </div>

      {/* College Details */}
      <div className="p-5 flex flex-col flex-1 space-y-3.5">
        <div>
          {/* College Name */}
          <h2 className="font-black text-[#171916] text-base sm:text-lg leading-snug group-hover:text-[#08C58A] transition-colors">
            {college.name}
          </h2>
          <p className="text-xs text-[#777A72] font-semibold mt-0.5">
            {college.shortName} · Est. {college.established}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#08C58A]" />
          <span>{college.location}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#777A72] leading-relaxed line-clamp-2">
          {college.description}
        </p>

        {/* Number of Registered Students (Demo Data) */}
        <div className="p-3 rounded-2xl bg-[#F7F6F0] border border-[#E7E8E1] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#08C58A]" />
            <span className="text-[#777A72]">Registered Students:</span>
          </div>
          <span className="font-black text-[#171916]">
            {college.registeredStudents.toLocaleString()}
          </span>
        </div>

        {/* Available Clubs Preview */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#171916] flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#08C58A]" /> Available Clubs:
            </span>
            <span className="text-[11px] font-bold text-[#08C58A] bg-[#E3F4EB] px-2 py-0.5 rounded-full border border-[#08C58A]/30">
              {clubs.length} Clubs
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {clubs.slice(0, 3).map((club) => {
              const colors = CATEGORY_COLORS[club.category]
              return (
                <span
                  key={club.id}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border truncate max-w-36 ${colors.bg} ${colors.text} ${colors.border}`}
                >
                  {club.name}
                </span>
              )
            })}
            {clubs.length > 3 && (
              <span className="text-[10px] text-[#777A72] font-semibold px-1.5 py-0.5">
                +{clubs.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Upcoming Events Preview */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#171916] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#08C58A]" /> Upcoming Events:
            </span>
            <span className="text-[11px] font-bold text-[#171916] bg-[#F7F6F0] border border-[#E7E8E1] px-2 py-0.5 rounded-full">
              {events.length} Events
            </span>
          </div>
          {nextEvent ? (
            <div className="p-2.5 rounded-xl bg-[#F7F6F0] border border-[#E7E8E1] text-xs space-y-0.5">
              <p className="font-bold text-[#171916] truncate">{nextEvent.title}</p>
              <div className="flex items-center justify-between text-[11px] text-[#777A72]">
                <span>{nextEvent.date}</span>
                <span className="text-[#08C58A] font-semibold">{nextEvent.volunteersNeeded} volunteers needed</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#777A72] italic">No scheduled events right now</p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 mt-auto">
          <button
            type="button"
            onClick={() => onNavigate(encodeRoute({ page: 'college-detail', collegeId: college.id }))}
            className="w-full py-2.5 rounded-xl bg-[#F7F6F0] hover:bg-[#08C58A] text-[#171916] hover:text-[#0A261D] text-sm font-semibold border border-[#E7E8E1] hover:border-[#08C58A] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group/btn"
          >
            <span>Explore College Details</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  )
}
