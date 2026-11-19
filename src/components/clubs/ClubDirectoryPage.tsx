import { useState, useMemo } from 'react'
import { Search, Users, ArrowRight, ExternalLink, Filter, Building2, Clock } from 'lucide-react'
import {
  mockClubs, mockColleges, getCollegeById, CLUB_CATEGORIES, CATEGORY_COLORS,
  type Club, type ClubCategory,
} from '../../data/collegeData'
import { encodeRoute } from '../../lib/collegeRouter'

interface ClubDirectoryPageProps {
  initialCategory?: string
  initialCollegeId?: string
  onNavigate: (hash: string) => void
}

export function ClubDirectoryPage({
  initialCategory,
  initialCollegeId,
  onNavigate,
}: ClubDirectoryPageProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ClubCategory | 'All'>(
    (initialCategory as ClubCategory) ?? 'All'
  )
  const [selectedCollege, setSelectedCollege] = useState<string>(initialCollegeId ?? 'All')
  const [recruitFilter, setRecruitFilter] = useState<'All' | 'Open' | 'Closed' | 'Coming Soon'>('All')

  const filtered = useMemo(() => {
    return mockClubs.filter((c) => {
      const college = getCollegeById(c.collegeId)
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        (college && college.name.toLowerCase().includes(search.toLowerCase())) ||
        (college && college.shortName.toLowerCase().includes(search.toLowerCase()))
      const matchCat = category === 'All' || c.category === category
      const matchCollege = selectedCollege === 'All' || c.collegeId === selectedCollege
      const matchRecruit = recruitFilter === 'All' || c.recruitmentStatus === recruitFilter
      return matchSearch && matchCat && matchCollege && matchRecruit
    })
  }, [search, category, selectedCollege, recruitFilter])

  return (
    <section className="min-h-screen bg-transparent py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="peer-eyebrow-pill mb-3">
            Club Directory
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171916] leading-tight tracking-tight mb-3">
            Explore College{' '}
            <span className="text-[#08C58A] relative inline-block">
              Clubs & Societies
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 w-full h-2.5 bg-[#E3F4EB] -rotate-1 -z-10 rounded-sm"
              />
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#777A72] max-w-2xl leading-relaxed">
            Browse across 8 categories — Technical, Cultural, Photography, Sports, Entrepreneurship,
            Marketing, Design, and Social Service. Join passionate student teams and build real projects.
          </p>
        </div>

        {/* 8 Required Category Filter Pills */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#171916] uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#08C58A]" />
              Select Category:
            </span>
            <button
              type="button"
              onClick={() => onNavigate(encodeRoute({ page: 'applications' }))}
              className="text-xs font-bold text-[#08C58A] hover:underline flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" /> Check Application Status
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
              All Categories ({mockClubs.length})
            </button>
            {CLUB_CATEGORIES.map((cat) => {
              const colors = CATEGORY_COLORS[cat]
              const isActive = category === cat
              const count = mockClubs.filter((c) => c.category === cat).length
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

        {/* Search, College Filter & Recruitment Filter */}
        <div className="bg-white rounded-3xl border border-[#E7E8E1] p-4 sm:p-5 mb-8 shadow-2xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777A72]" />
            <input
              type="text"
              placeholder="Search clubs by name, keywords, or college (e.g. Aperture, Manipal, AI)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E8E1] bg-[#F7F6F0] text-sm text-[#171916] placeholder:text-[#777A72] focus:outline-none focus:ring-2 focus:ring-[#08C58A]/30 focus:border-[#08C58A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* College Dropdown */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#08C58A] shrink-0" />
              <label htmlFor="college-filter" className="text-xs font-bold text-[#171916]">
                Campus:
              </label>
              <select
                id="college-filter"
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

            {/* Recruitment status toggle */}
            <div className="flex items-center gap-1.5 bg-[#F7F6F0] p-1 rounded-xl border border-[#E7E8E1]">
              {(['All', 'Open', 'Coming Soon', 'Closed'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRecruitFilter(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    recruitFilter === r
                      ? r === 'Open'
                        ? 'bg-[#08C58A] text-[#0A261D]'
                        : 'bg-[#171916] text-white'
                      : 'text-[#777A72] hover:text-[#171916]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#777A72]">
            Showing <strong className="text-[#171916]">{filtered.length}</strong> of{' '}
            {mockClubs.length} clubs
          </p>
          {(category !== 'All' || selectedCollege !== 'All' || recruitFilter !== 'All' || search) && (
            <button
              type="button"
              onClick={() => {
                setCategory('All')
                setSelectedCollege('All')
                setRecruitFilter('All')
                setSearch('')
              }}
              className="text-xs font-bold text-[#08C58A] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Club Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E7E8E1] space-y-3">
            <Users className="w-12 h-12 text-[#E7E8E1] mx-auto" />
            <h3 className="font-bold text-[#171916] text-base">No clubs found matching your criteria</h3>
            <p className="text-sm text-[#777A72] max-w-sm mx-auto">
              Try adjusting your category, campus, or recruitment status filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((club) => (
              <ClubCard key={club.id} club={club} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ClubCard({
  club,
  onNavigate,
}: {
  club: Club
  onNavigate: (hash: string) => void
}) {
  const college = getCollegeById(club.collegeId)
  const colors = CATEGORY_COLORS[club.category]

  const recruitColors: Record<string, string> = {
    Open: 'bg-[#E3F4EB] text-[#123D30] border-[#08C58A]/30',
    Closed: 'bg-[#F7F6F0] text-[#777A72] border-[#E7E8E1]',
    'Coming Soon': 'bg-amber-50 text-amber-800 border-amber-200/70',
  }

  return (
    <article className="peer-card-glass overflow-hidden hover:border-[#08C58A]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* Cover Header */}
      <div className="relative h-36 overflow-hidden bg-[#F7F6F0]">
        <img
          src={club.coverUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'}
          alt={club.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Club Logo */}
        <div className="absolute bottom-3 left-4 w-12 h-12 rounded-xl bg-white border-2 border-white shadow-md overflow-hidden p-0.5">
          <img
            src={club.logoUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80'}
            alt={club.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80'
            }}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${colors.bg} ${colors.text} ${colors.border}`}>
            {club.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div>
          <h2 className="font-black text-[#171916] text-base leading-snug group-hover:text-[#08C58A] transition-colors">
            {club.name}
          </h2>
          {college && (
            <p className="text-xs text-[#777A72] font-semibold mt-0.5">
              {college.name} · Est. {club.foundedYear}
            </p>
          )}
        </div>

        <p className="text-xs text-[#777A72] leading-relaxed line-clamp-2">
          {club.description}
        </p>

        {/* Metadata Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-[#777A72]">
            <Users className="w-3.5 h-3.5 text-[#08C58A]" />
            <span>{club.memberCount} members</span>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${recruitColors[club.recruitmentStatus]}`}>
            {club.recruitmentStatus === 'Open' ? `Hiring (${club.openings} Open)` : club.recruitmentStatus}
          </span>
        </div>

        {/* Social Links */}
        {Object.keys(club.socialLinks).length > 0 && (
          <div className="flex gap-3 pt-1 border-t border-[#E7E8E1]">
            {club.socialLinks.instagram && (
              <a
                href={club.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#777A72] hover:text-[#E1306C] font-semibold flex items-center gap-0.5 transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> Instagram
              </a>
            )}
            {club.socialLinks.linkedin && (
              <a
                href={club.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#777A72] hover:text-[#0A66C2] font-semibold flex items-center gap-0.5 transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> LinkedIn
              </a>
            )}
            {club.socialLinks.website && (
              <a
                href={club.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#777A72] hover:text-[#08C58A] font-semibold flex items-center gap-0.5 transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> Website
              </a>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 mt-auto">
          <button
            type="button"
            onClick={() => onNavigate(encodeRoute({ page: 'club-profile', clubId: club.id }))}
            className="flex-1 py-2.5 rounded-xl bg-[#F7F6F0] hover:bg-[#EAE8DF] text-[#171916] text-xs font-bold border border-[#E7E8E1] transition-colors cursor-pointer"
          >
            View Profile
          </button>
          {club.recruitmentStatus === 'Open' && (
            <button
              type="button"
              onClick={() => onNavigate(encodeRoute({ page: 'club-recruitment', clubId: club.id }))}
              className="flex-1 py-2.5 rounded-xl bg-[#08C58A] hover:bg-[#07B27C] text-[#0A261D] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
