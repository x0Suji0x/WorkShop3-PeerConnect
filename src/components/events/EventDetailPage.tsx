import {
  ArrowLeft, MapPin, Calendar, Clock, Users, ArrowRight,
  Tag, Building2, Sparkles,
} from 'lucide-react'
import { getEventById, getClubById, getCollegeById, CATEGORY_COLORS } from '../../data/collegeData'
import { encodeRoute } from '../../lib/collegeRouter'

interface EventDetailPageProps {
  eventId: string
  onNavigate: (hash: string) => void
}

export function EventDetailPage({ eventId, onNavigate }: EventDetailPageProps) {
  const event = getEventById(eventId)
  const club = event ? getClubById(event.clubId) : undefined
  const college = event ? getCollegeById(event.collegeId) : undefined

  if (!event) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4 py-20">
        <Calendar className="w-12 h-12 text-[#E7E8E1]" />
        <p className="font-bold text-[#171916] text-lg">Event not found</p>
        <button
          type="button"
          onClick={() => onNavigate(encodeRoute({ page: 'events' }))}
          className="px-5 py-2.5 rounded-full bg-[#171916] text-white text-sm font-semibold cursor-pointer"
        >
          Back to Events Directory
        </button>
      </div>
    )
  }

  const colors =
    CATEGORY_COLORS[event.category as keyof typeof CATEGORY_COLORS] ??
    CATEGORY_COLORS['Technical']

  const locationTypeStyle: Record<string, string> = {
    'On-Campus': 'bg-sky-50 text-sky-800 border-sky-200/80',
    'Off-Campus': 'bg-purple-50 text-purple-800 border-purple-200/80',
    Online: 'bg-[#E3F4EB] text-[#123D30] border-[#08C58A]/30',
    Hybrid: 'bg-amber-50 text-amber-800 border-amber-200/80',
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero Cover Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden bg-[#171916]">
        <img
          src={event.coverUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
          alt={event.title}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
          }}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171916] via-[#171916]/40 to-transparent" />

        <button
          type="button"
          onClick={() => onNavigate(encodeRoute({ page: 'events' }))}
          className="absolute top-6 left-5 sm:left-8 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20 hover:bg-white/25 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Events</span>
        </button>

        <div className="absolute bottom-6 left-5 sm:left-8 right-5 sm:right-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {event.category}
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${
                locationTypeStyle[event.locationType] ?? 'bg-white/90 text-[#171916]'
              }`}
            >
              {event.locationType}
            </span>
            {event.registrationOpen && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border bg-[#E3F4EB] text-[#123D30] border-[#08C58A]/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#08C58A] animate-pulse" />
                Volunteer Applications Open
              </span>
            )}
          </div>
          <h1 className="text-white font-black text-2xl sm:text-3xl lg:text-4xl leading-tight max-w-3xl">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2/3 Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Metadata Bar */}
            <div className="bg-white rounded-3xl border border-[#E7E8E1] p-5 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetaItem
                icon={<Calendar className="w-4 h-4 text-[#08C58A]" />}
                label="Event Date"
                value={event.date}
              />
              <MetaItem
                icon={<Clock className="w-4 h-4 text-[#08C58A]" />}
                label="Start Time"
                value={event.time}
              />
              <MetaItem
                icon={<MapPin className="w-4 h-4 text-[#08C58A]" />}
                label="Venue"
                value={event.location}
              />
              <MetaItem
                icon={<Users className="w-4 h-4 text-[#08C58A]" />}
                label="Volunteers"
                value={`${event.volunteersNeeded} Needed`}
              />
            </div>

            {/* Event Description */}
            <section className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs space-y-4">
              <h2 className="font-black text-xl text-[#171916]">About This Event</h2>
              <p className="text-sm text-[#777A72] leading-relaxed">
                {event.description}
              </p>

              {/* Tags */}
              {event.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#E7E8E1]">
                  <Tag className="w-3.5 h-3.5 text-[#777A72]" />
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F7F6F0] border border-[#E7E8E1] text-[#171916]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Volunteer Roles Showcase */}
            <section className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-black text-xl text-[#171916] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#08C58A]" />
                    Volunteer Opportunities
                  </h2>
                  <p className="text-xs text-[#777A72] mt-0.5">
                    Gain hands-on experience and receive verified volunteer credentials
                  </p>
                </div>
                <span className="text-xs font-bold text-[#08C58A] bg-[#E3F4EB] border border-[#08C58A]/30 px-3 py-1 rounded-full">
                  {event.volunteersNeeded} Total Openings
                </span>
              </div>

              <div className="space-y-4">
                {event.volunteerRoles.map((role) => (
                  <div
                    key={role.id}
                    className="border border-[#E7E8E1] rounded-2xl p-5 hover:border-[#08C58A]/50 transition-all space-y-3 bg-[#FAF8F5]/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-base text-[#171916]">{role.title}</h3>
                        <p className="text-xs text-[#777A72] mt-0.5">
                          {role.count} volunteer position{role.count !== 1 ? 's' : ''} available
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#08C58A] bg-[#E3F4EB] px-2.5 py-1 rounded-full border border-[#08C58A]/30 shrink-0">
                        {role.count} open
                      </span>
                    </div>

                    <p className="text-xs text-[#777A72] leading-relaxed">
                      {role.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-[#171916] uppercase tracking-wider block">
                        Relevant Skills:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {role.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#E7E8E1] text-[#171916]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate(
                            encodeRoute({
                              page: 'volunteer-apply',
                              eventId: event.id,
                              roleId: role.id,
                            })
                          )
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span>Apply for {role.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Organised By */}
            <div className="bg-white rounded-3xl border border-[#E7E8E1] p-6 shadow-2xs space-y-4">
              <h2 className="font-black text-base text-[#171916]">Organised By</h2>

              {club && (
                <button
                  type="button"
                  onClick={() => onNavigate(encodeRoute({ page: 'club-profile', clubId: club.id }))}
                  className="w-full text-left flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F6F0] border border-[#E7E8E1] hover:border-[#08C58A]/50 transition-colors cursor-pointer group"
                >
                  <img
                    src={club.logoUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80'}
                    alt={club.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80'
                    }}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E7E8E1] p-0.5 bg-white"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#171916] group-hover:text-[#08C58A] transition-colors truncate">
                      {club.name}
                    </p>
                    <p className="text-xs text-[#777A72]">{club.category} Society · {club.memberCount} members</p>
                  </div>
                </button>
              )}

              {college && (
                <button
                  type="button"
                  onClick={() => onNavigate(encodeRoute({ page: 'college-detail', collegeId: college.id }))}
                  className="w-full text-left flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F6F0] border border-[#E7E8E1] hover:border-[#08C58A]/50 transition-colors cursor-pointer group"
                >
                  <Building2 className="w-5 h-5 text-[#08C58A] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#171916] group-hover:text-[#08C58A] transition-colors truncate">
                      {college.name}
                    </p>
                    <p className="text-xs text-[#777A72]">{college.city}, {college.state}</p>
                  </div>
                </button>
              )}
            </div>

            {/* Volunteer Call to Action Card */}
            <div className="bg-[#171916] rounded-3xl p-6 text-white space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#08C58A]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="font-black text-lg">Join the Organizing Team</h2>
              <p className="text-xs text-white/60 leading-relaxed">
                Volunteering offers verified certificates, networking with industry mentors, and
                leadership experience.
              </p>

              <div className="space-y-2 py-2 border-y border-white/10">
                {event.volunteerRoles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between text-xs">
                    <span className="text-white/80">{role.title}</span>
                    <span className="text-[#08C58A] font-bold">{role.count} positions</span>
                  </div>
                ))}
              </div>

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
                className="w-full py-3 rounded-2xl bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Apply as Volunteer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Event Schedule Info */}
            <div className="bg-white rounded-3xl border border-[#E7E8E1] p-6 shadow-2xs space-y-3">
              <h2 className="font-black text-base text-[#171916]">Event Logistics</h2>
              <div className="space-y-2.5 text-xs text-[#777A72]">
                <div className="flex justify-between items-center py-1 border-b border-[#E7E8E1]">
                  <span>Date:</span>
                  <span className="font-bold text-[#171916]">{event.date}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#E7E8E1]">
                  <span>Start Time:</span>
                  <span className="font-bold text-[#171916]">{event.time}</span>
                </div>
                {event.endDate && (
                  <div className="flex justify-between items-center py-1 border-b border-[#E7E8E1]">
                    <span>End Date:</span>
                    <span className="font-bold text-[#171916]">{event.endDate}</span>
                  </div>
                )}
                <div className="flex justify-between items-start py-1">
                  <span>Venue:</span>
                  <span className="font-bold text-[#171916] text-right max-w-44 leading-snug">
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5">
      <span>{icon}</span>
      <span className="text-[10px] text-[#777A72] uppercase tracking-wider font-bold">
        {label}
      </span>
      <span className="text-xs font-black text-[#171916] leading-snug">{value}</span>
    </div>
  )
}
