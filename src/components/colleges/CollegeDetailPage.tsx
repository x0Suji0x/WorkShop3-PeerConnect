import { useState, useMemo } from 'react'
import {
  ArrowLeft, MapPin, Users, Building2, Calendar, ExternalLink,
  BookOpen, Sparkles, ArrowRight, GraduationCap, Search,
} from 'lucide-react'
import {
  getCollegeById, getClubsByCollege, getEventsByCollege,
  getStudentsByCollege, getOpeningsByClub,
  CATEGORY_COLORS, type CollegeStudent,
} from '../../data/collegeData'
import { encodeRoute } from '../../lib/collegeRouter'
import { CollegeCoverImage, CollegeLogoBadge } from './CollegesPage'

interface CollegeDetailPageProps {
  collegeId: string
  onNavigate: (hash: string) => void
}

export function CollegeDetailPage({ collegeId, onNavigate }: CollegeDetailPageProps) {
  const college = getCollegeById(collegeId)
  const clubs = useMemo(() => getClubsByCollege(collegeId), [collegeId])
  const events = useMemo(() => getEventsByCollege(collegeId), [collegeId])
  const collegeStudents = useMemo(() => getStudentsByCollege(collegeId), [collegeId])

  const [studentSearch, setStudentSearch] = useState('')

  // Gather all open club recruitment openings for this college
  const openOpportunities = useMemo(() => {
    return clubs
      .filter((c) => c.recruitmentStatus === 'Open')
      .flatMap((c) => {
        const openings = getOpeningsByClub(c.id)
        return openings.map((op) => ({
          ...op,
          clubName: c.name,
          clubLogo: c.logoUrl,
        }))
      })
  }, [clubs])

  const filteredStudents = useMemo(() => {
    if (!studentSearch) return collegeStudents
    return collegeStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.major.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.skills.some((sk) => sk.toLowerCase().includes(studentSearch.toLowerCase()))
    )
  }, [collegeStudents, studentSearch])

  if (!college) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4 py-20">
        <Building2 className="w-12 h-12 text-[#E7E8E1]" />
        <p className="font-bold text-[#171916] text-lg">College not found</p>
        <button
          type="button"
          onClick={() => onNavigate(encodeRoute({ page: 'colleges' }))}
          className="px-5 py-2.5 rounded-full bg-[#171916] text-white text-sm font-semibold cursor-pointer"
        >
          Back to Colleges Directory
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Cover Hero Banner */}
      <div className="relative h-64 sm:h-80 bg-[#171916] overflow-hidden">
        <CollegeCoverImage
          src={college.coverUrl}
          alt={college.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171916] via-[#171916]/40 to-transparent" />

        {/* Back Button */}
        <button
          type="button"
          onClick={() => onNavigate(encodeRoute({ page: 'colleges' }))}
          className="absolute top-6 left-5 sm:left-8 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20 hover:bg-white/25 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Colleges</span>
        </button>

        {/* College Header Identity */}
        <div className="absolute bottom-6 left-5 sm:left-8 right-5 sm:right-8 flex flex-col sm:flex-row sm:items-end gap-4">
          <CollegeLogoBadge
            logoUrl={college.logoUrl}
            shortName={college.shortName}
            className="w-20 h-20 sm:w-24 sm:h-24"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#08C58A] text-xs font-bold uppercase tracking-wider bg-[#08C58A]/20 px-2.5 py-0.5 rounded-full border border-[#08C58A]/30">
                {college.type}
              </span>
              <span className="text-white/60 text-xs font-semibold">Established {college.established}</span>
            </div>
            <h1 className="text-white font-black text-2xl sm:text-3xl lg:text-4xl leading-tight">
              {college.name}
            </h1>
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-[#08C58A] shrink-0" />
              <span>{college.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Registered Students',
              value: college.registeredStudents.toLocaleString(),
              icon: <Users className="w-4 h-4" />,
            },
            {
              label: 'Active Clubs',
              value: clubs.length.toString(),
              icon: <GraduationCap className="w-4 h-4" />,
            },
            {
              label: 'Upcoming Events',
              value: events.length.toString(),
              icon: <Calendar className="w-4 h-4" />,
            },
            {
              label: 'Founding Year',
              value: college.established.toString(),
              icon: <Building2 className="w-4 h-4" />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-[#E7E8E1] p-5 text-center shadow-2xs"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E3F4EB] text-[#08C58A] mb-2.5">
                {s.icon}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#171916]">{s.value}</div>
              <div className="text-xs text-[#777A72] font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. College Information */}
            <section className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs space-y-4">
              <h2 className="font-black text-xl text-[#171916] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#08C58A]" />
                About {college.shortName}
              </h2>
              <p className="text-sm text-[#777A72] leading-relaxed">
                {college.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 items-center justify-between border-t border-[#E7E8E1]">
                <div className="flex items-center gap-2 text-xs text-[#777A72]">
                  <span className="font-bold text-[#171916]">Campus City:</span>
                  <span>{college.city}, {college.state}</span>
                </div>
                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08C58A] hover:underline"
                  >
                    <span>Visit Verified Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </section>

            {/* 2. Student Directory Preview */}
            <section className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-black text-xl text-[#171916] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#08C58A]" />
                    Student Directory Preview
                  </h2>
                  <p className="text-xs text-[#777A72] mt-0.5">
                    Connect with peers enrolled at {college.shortName} ({college.registeredStudents.toLocaleString()} total students)
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#123D30] bg-[#E3F4EB] border border-[#08C58A]/30 px-3 py-1 rounded-full w-fit">
                  {collegeStudents.length} Profiles Previewed
                </span>
              </div>

              {/* Quick Filter */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777A72]" />
                <input
                  type="text"
                  placeholder="Filter directory by student name, major, or skill…"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E7E8E1] bg-[#F7F6F0] text-xs text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30"
                />
              </div>

              {/* Student Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredStudents.map((student) => (
                  <StudentDirectoryCard key={student.id} student={student} />
                ))}
                {filteredStudents.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-xs text-[#777A72]">
                    No students match "{studentSearch}". Try another query.
                  </div>
                )}
              </div>
            </section>

            {/* 3. Upcoming Events at this College */}
            <section className="bg-white rounded-3xl border border-[#E7E8E1] p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-black text-xl text-[#171916] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#08C58A]" />
                    Upcoming Events on Campus
                  </h2>
                  <p className="text-xs text-[#777A72] mt-0.5">
                    Hackathons, symposiums, and exhibitions hosted at {college.shortName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(encodeRoute({ page: 'events', collegeId: college.id }))}
                  className="text-xs text-[#08C58A] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {events.length === 0 ? (
                <div className="p-8 text-center bg-[#F7F6F0] rounded-2xl border border-[#E7E8E1] text-xs text-[#777A72]">
                  No upcoming events currently scheduled at this college.
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((evt) => {
                    const colors =
                      CATEGORY_COLORS[evt.category as keyof typeof CATEGORY_COLORS] ??
                      CATEGORY_COLORS['Technical']
                    return (
                      <button
                        key={evt.id}
                        type="button"
                        onClick={() => onNavigate(encodeRoute({ page: 'event-detail', eventId: evt.id }))}
                        className="w-full text-left flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-[#E7E8E1] hover:border-[#08C58A]/50 hover:bg-[#F7F6F0] transition-all cursor-pointer group"
                      >
                        <div className="w-full sm:w-20 h-24 sm:h-20 rounded-xl overflow-hidden bg-[#F7F6F0] shrink-0">
                          <img
                            src={evt.coverUrl}
                            alt={evt.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                              {evt.category}
                            </span>
                            <span className="text-[11px] text-[#777A72]">{evt.locationType}</span>
                          </div>
                          <h3 className="font-bold text-[#171916] text-sm group-hover:text-[#08C58A] transition-colors leading-snug">
                            {evt.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-[#777A72]">
                            <span>{evt.date} · {evt.time}</span>
                            <span>·</span>
                            <span className="text-[#08C58A] font-semibold">{evt.volunteersNeeded} volunteers needed</span>
                          </div>
                        </div>
                        <ArrowRight className="hidden sm:block w-4 h-4 text-[#777A72] group-hover:text-[#08C58A] shrink-0" />
                      </button>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-8">
            {/* 4. Clubs affiliated with this College */}
            <section className="bg-white rounded-3xl border border-[#E7E8E1] p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-lg text-[#171916] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#08C58A]" />
                  Available Clubs
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate(encodeRoute({ page: 'clubs', collegeId: college.id }))}
                  className="text-xs text-[#08C58A] font-bold hover:underline cursor-pointer"
                >
                  All Clubs ({clubs.length})
                </button>
              </div>

              {clubs.length === 0 ? (
                <p className="text-xs text-[#777A72]">No clubs listed yet for this campus.</p>
              ) : (
                <div className="space-y-3">
                  {clubs.map((club) => {
                    const colors = CATEGORY_COLORS[club.category]
                    return (
                      <button
                        key={club.id}
                        type="button"
                        onClick={() => onNavigate(encodeRoute({ page: 'club-profile', clubId: club.id }))}
                        className="w-full text-left flex items-center gap-3 p-3 rounded-2xl border border-[#E7E8E1] hover:border-[#08C58A]/50 hover:bg-[#F7F6F0] transition-all group cursor-pointer"
                      >
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#F7F6F0] border border-[#E7E8E1] shrink-0 p-0.5">
                          <img
                            src={club.logoUrl}
                            alt={club.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#171916] group-hover:text-[#08C58A] transition-colors truncate">
                            {club.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                              {club.category}
                            </span>
                            <span className="text-[10px] text-[#777A72]">{club.memberCount} members</span>
                          </div>
                        </div>
                        {club.recruitmentStatus === 'Open' && (
                          <span className="text-[10px] font-bold text-[#08C58A] bg-[#E3F4EB] px-2 py-0.5 rounded-full border border-[#08C58A]/30 shrink-0">
                            Recruiting
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </section>

            {/* 5. Recent Opportunities at this College */}
            <section className="bg-[#171916] rounded-3xl p-6 text-white space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#08C58A]" />
                <h2 className="font-black text-lg">Recent Opportunities</h2>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Active recruitments & volunteer openings at {college.shortName}. Apply to contribute your skills.
              </p>

              {openOpportunities.length === 0 ? (
                <p className="text-xs text-white/50 py-3">No active positions open right now.</p>
              ) : (
                <div className="space-y-3">
                  {openOpportunities.slice(0, 4).map((op) => (
                    <div
                      key={op.id}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#08C58A]/50 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-white leading-snug">{op.role}</p>
                          <p className="text-[11px] text-white/60">{op.clubName}</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#08C58A] bg-[#08C58A]/20 px-2 py-0.5 rounded-full border border-[#08C58A]/30 shrink-0">
                          {op.count} open
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-white/50">Deadline: {op.deadline}</span>
                        <button
                          type="button"
                          onClick={() => onNavigate(encodeRoute({ page: 'club-recruitment', clubId: op.clubId, openingId: op.id }))}
                          className="px-3 py-1 rounded-lg bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] text-xs font-bold transition-colors cursor-pointer"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => onNavigate(encodeRoute({ page: 'clubs', collegeId: college.id }))}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors cursor-pointer text-center block"
              >
                Explore All Campus Openings
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function StudentDirectoryCard({ student }: { student: CollegeStudent }) {
  return (
    <article className="p-4 rounded-2xl bg-[#F7F6F0] border border-[#E7E8E1] flex flex-col justify-between space-y-3">
      <div className="flex items-start gap-3">
        <img
          src={student.avatarUrl}
          alt={student.name}
          className="w-12 h-12 rounded-xl object-cover border border-[#E7E8E1] shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#171916] truncate">{student.name}</p>
          <p className="text-xs text-[#08C58A] font-semibold truncate">{student.major}</p>
          <p className="text-[11px] text-[#777A72]">{student.year}</p>
        </div>
      </div>

      <p className="text-xs text-[#777A72] line-clamp-2 leading-relaxed">
        {student.bio}
      </p>

      {student.clubAffiliation && (
        <div className="text-[11px] font-semibold text-[#171916] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#08C58A]" />
          <span>Member: {student.clubAffiliation}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1 pt-1">
        {student.skills.slice(0, 3).map((sk) => (
          <span
            key={sk}
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#E7E8E1] text-[#171916]"
          >
            {sk}
          </span>
        ))}
      </div>
    </article>
  )
}
