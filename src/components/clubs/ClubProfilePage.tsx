import { useMemo } from 'react'
import {
  ArrowLeft, Users, Calendar, ArrowRight,
  Globe, Sparkles, Award, MapPin, Building2,
} from 'lucide-react'
import {
  getClubById, getCollegeById, getEventsByClub, getOpeningsByClub,
  CATEGORY_COLORS,
} from '../../data/collegeData'
import { encodeRoute } from '../../lib/collegeRouter'

interface ClubProfilePageProps {
  clubId: string
  onNavigate: (hash: string) => void
}

export function ClubProfilePage({ clubId, onNavigate }: ClubProfilePageProps) {
  const club = getClubById(clubId)
  const college = useMemo(() => (club ? getCollegeById(club.collegeId) : undefined), [club])
  const events = useMemo(() => (club ? getEventsByClub(clubId) : []), [clubId, club])
  const openings = useMemo(() => (club ? getOpeningsByClub(clubId) : []), [clubId, club])

  if (!club) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4 py-20">
        <Users className="w-12 h-12 text-[#E7E8E1]" />
        <p className="font-bold text-[#171916] text-lg">Club not found</p>
        <button
          type="button"
          onClick={() => onNavigate(encodeRoute({ page: 'clubs' }))}
          className="px-5 py-2.5 rounded-full bg-[#171916] text-white text-sm font-semibold cursor-pointer"
        >
          Back to Clubs Directory
        </button>
      </div>
    )
  }

  const colors = CATEGORY_COLORS[club.category]

  const recruitColors: Record<string, string> = {
    Open: 'bg-[#E3F4EB] text-[#123D30] border-[#08C58A]/30',
    Closed: 'bg-[#F7F6F0] text-[#777A72] border-[#E7E8E1]',
    'Coming Soon': 'bg-amber-50 text-amber-800 border-amber-200/70',
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Cover Banner */}
      <div className="relative h-64 sm:h-80 bg-[#171916] overflow-hidden">
        <img
          src={club.coverUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'}
          alt={club.name}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
          }}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171916] via-[#171916]/40 to-transparent" />

        {/* Back Button */}
        <button
          type="button"
          onClick={() => onNavigate(encodeRoute({ page: 'clubs' }))}
          className="absolute top-6 left-5 sm:left-8 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20 hover:bg-white/25 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Clubs</span>
        </button>

        {/* Header Profile Identity */}
        <div className="absolute bottom-6 left-5 sm:left-8 right-5 sm:right-8 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 border-white/90 shadow-xl overflow-hidden shrink-0 p-1">
            <img
              src={club.logoUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80'}
              alt={club.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80'
              }}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                {club.category}
              </span>
              <span className="text-white/60 text-xs font-semibold">Established {club.foundedYear}</span>
            </div>
            <h1 className="text-white font-black text-2xl sm:text-3xl lg:text-4xl leading-tight">
              {club.name}
            </h1>
            {college && (
              <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
                <Building2 className="w-4 h-4 text-[#08C58A] shrink-0" />
                <span>{college.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2/3 Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Community Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Active Members', value: club.memberCount.toString(), icon: <Users className="w-4 h-4" /> },
                { label: 'Open Positions', value: openings.length.toString(), icon: <Sparkles className="w-4 h-4" /> },
                { label: 'Upcoming Events', value: events.length.toString(), icon: <Calendar className="w-4 h-4" /> },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-[#E7E8E1] p-5 text-center shadow-2xs">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#E3F4EB] text-[#08C58A] mb-2">
                    {s.icon}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#171916]">{s.value}</div>
                  <div className="text-xs text-[#777A72] font-medium mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* 1. Description & Mission */}
            <section className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs space-y-4">
              <h2 className="font-black text-xl text-[#171916]">About {club.name}</h2>
              <p className="text-sm text-[#777A72] leading-relaxed">
                {club.description}
              </p>

              {/* Social Links */}
              {Object.keys(club.socialLinks).length > 0 && (
                <div className="pt-4 border-t border-[#E7E8E1] space-y-2">
                  <p className="text-xs font-bold text-[#171916] uppercase tracking-wider">Connect & Follow</p>
                  <div className="flex flex-wrap gap-4">
                    {club.socialLinks.instagram && (
                      <a
                        href={club.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#777A72] hover:text-[#E1306C] transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" /> Instagram
                      </a>
                    )}
                    {club.socialLinks.linkedin && (
                      <a
                        href={club.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#777A72] hover:text-[#0A66C2] transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" /> LinkedIn
                      </a>
                    )}
                    {club.socialLinks.twitter && (
                      <a
                        href={club.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#777A72] hover:text-[#1DA1F2] transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" /> Twitter / X
                      </a>
                    )}
                    {club.socialLinks.website && (
                      <a
                        href={club.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08C58A] hover:underline transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" /> Official Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* 2. Core Team */}
            <section className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-black text-xl text-[#171916] flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#08C58A]" />
                    Core Team & Leadership
                  </h2>
                  <p className="text-xs text-[#777A72] mt-0.5">Meet the students steering club activities this academic year</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {club.coreTeam.map((member) => (
                  <div
                    key={member.name}
                    className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-2"
                  >
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <p className="font-bold text-sm text-[#171916]">{member.name}</p>
                      <p className="text-xs font-semibold text-[#08C58A] mt-0.5">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Previous Activities */}
            <section className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-black text-xl text-[#171916] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#08C58A]" />
                    Previous Activities & Milestones
                  </h2>
                  <p className="text-xs text-[#777A72] mt-0.5">Track record of workshops, showcases, and campus projects</p>
                </div>
              </div>

              <div className="space-y-3">
                {club.previousActivities.map((activity) => (
                  <div
                    key={activity.title}
                    className="p-4 rounded-2xl bg-[#F7F6F0] border border-[#E7E8E1] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-[#171916] text-sm">{activity.title}</h3>
                      <span className="text-[11px] font-semibold text-[#777A72] shrink-0 bg-white border border-[#E7E8E1] px-2.5 py-0.5 rounded-full">
                        {activity.date}
                      </span>
                    </div>
                    <p className="text-xs text-[#777A72] leading-relaxed">
                      {activity.description}
                    </p>
                    <p className="text-[11px] font-bold text-[#08C58A]">
                      ✓ {activity.attendees} Attendees Participated
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Upcoming Events */}
            {events.length > 0 && (
              <section className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-black text-xl text-[#171916] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#08C58A]" />
                    Upcoming Club Events
                  </h2>
                </div>

                <div className="space-y-3">
                  {events.map((evt) => (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => onNavigate(encodeRoute({ page: 'event-detail', eventId: evt.id }))}
                      className="w-full text-left flex items-center gap-4 p-4 rounded-2xl border border-[#E7E8E1] hover:border-[#08C58A]/50 hover:bg-[#F7F6F0] transition-all cursor-pointer group"
                    >
                      <img
                        src={evt.coverUrl}
                        alt={evt.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="font-bold text-sm text-[#171916] group-hover:text-[#08C58A] transition-colors truncate">
                          {evt.title}
                        </p>
                        <p className="text-xs text-[#777A72]">{evt.date} · {evt.time}</p>
                        <p className="text-[11px] font-semibold text-[#08C58A]">
                          {evt.volunteersNeeded} volunteers needed
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#777A72] group-hover:text-[#08C58A] shrink-0" />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Recruitment Status Card */}
            <div className="bg-white rounded-3xl border border-[#E7E8E1] p-6 shadow-2xs space-y-4">
              <h2 className="font-black text-base text-[#171916]">Recruitment Status</h2>
              <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border ${recruitColors[club.recruitmentStatus]}`}>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    club.recruitmentStatus === 'Open'
                      ? 'bg-[#08C58A] animate-pulse'
                      : club.recruitmentStatus === 'Coming Soon'
                      ? 'bg-amber-500'
                      : 'bg-[#D1D2C9]'
                  }`}
                />
                <span className="text-sm font-bold">
                  {club.recruitmentStatus === 'Open' ? 'Active Recruitment' : club.recruitmentStatus}
                </span>
              </div>

              {club.recruitmentStatus === 'Open' ? (
                <>
                  <p className="text-xs text-[#777A72] leading-relaxed">
                    This club is currently reviewing student applications for{' '}
                    <strong className="text-[#171916]">{openings.length} open roles</strong> ({club.openings} total seats).
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate(encodeRoute({ page: 'club-recruitment', clubId: club.id }))}
                    className="w-full py-3 rounded-2xl bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] text-sm font-bold transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>View Openings & Apply</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <p className="text-xs text-[#777A72] leading-relaxed">
                  Recruitments are currently closed for this session. Follow the club social pages
                  for upcoming cycle announcements.
                </p>
              )}
            </div>

            {/* College Affiliation Card */}
            {college && (
              <div className="bg-white rounded-3xl border border-[#E7E8E1] p-6 shadow-2xs space-y-3">
                <h2 className="font-black text-base text-[#171916]">College Affiliation</h2>
                <button
                  type="button"
                  onClick={() => onNavigate(encodeRoute({ page: 'college-detail', collegeId: college.id }))}
                  className="w-full text-left flex items-start gap-3 p-3.5 rounded-2xl bg-[#F7F6F0] border border-[#E7E8E1] hover:border-[#08C58A]/50 transition-colors cursor-pointer group"
                >
                  <img
                    src={college.logoUrl}
                    alt={college.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E7E8E1] p-0.5 bg-white"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#171916] group-hover:text-[#08C58A] transition-colors truncate">
                      {college.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#777A72] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#08C58A] shrink-0" />
                      <span className="truncate">{college.location}</span>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Application Tracker CTA */}
            <div className="bg-[#171916] rounded-3xl p-6 text-white space-y-3">
              <Sparkles className="w-5 h-5 text-[#08C58A]" />
              <h2 className="font-black text-base">Already Applied?</h2>
              <p className="text-xs text-white/60 leading-relaxed">
                Check the review progress of your club applications and interview invitations anytime.
              </p>
              <button
                type="button"
                onClick={() => onNavigate(encodeRoute({ page: 'applications' }))}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors cursor-pointer"
              >
                Track Application Status →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
